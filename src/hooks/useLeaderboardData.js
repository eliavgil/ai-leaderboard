import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'
import { buildAnimalMap } from '../utils/animalMap'

const SCORES_URL =
  'https://docs.google.com/spreadsheets/d/1TTuD5vvmE9BhNMDqwsNDXsLEgjUVm54nkqMiFaw_8zY/export?format=csv'
const CREDS_URL =
  'https://docs.google.com/spreadsheets/d/17WWVtK7hKwt2-LW8AA4Gw7ouiHkXoFThyB8bdi9te8s/export?format=csv'
const XLSX_URL =
  'https://docs.google.com/spreadsheets/d/1TTuD5vvmE9BhNMDqwsNDXsLEgjUVm54nkqMiFaw_8zY/export?format=xlsx'

function parseCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: false,          // handle duplicate headers manually
      skipEmptyLines: true,
      complete: (raw) => {
        const rows = raw.data
        if (!rows.length) { resolve({ data: [], meta: { fields: [] } }); return }

        // First row = headers; keep only the FIRST occurrence of each duplicate
        const rawHeaders = rows[0].map(h => (h || '').trim())
        const uniqueHeaders = []
        const seen = {}
        rawHeaders.forEach((h, i) => {
          if (!seen[h]) {
            seen[h] = true
            uniqueHeaders.push({ name: h, index: i })
          }
          // subsequent duplicates are silently ignored
        })

        const data = rows.slice(1).map(row => {
          const obj = {}
          uniqueHeaders.forEach(({ name, index }) => {
            obj[name] = row[index] !== undefined ? row[index] : ''
          })
          return obj
        })

        resolve({ data, meta: { fields: uniqueHeaders.map(h => h.name) } })
      },
      error: reject,
    })
  })
}

function findCol(headers, ...keywords) {
  return (
    headers.find(h =>
      keywords.some(kw => h.toLowerCase().includes(kw.toLowerCase()))
    ) || null
  )
}

function parseNum(val) {
  if (val === undefined || val === null) return 0
  const n = parseFloat(val.toString().replace(/,/g, '').trim())
  return isNaN(n) ? 0 : n
}

/** Strip hidden unicode direction/zero-width marks; normalize apostrophe variants */
function cleanStr(s = '') {
  return s.toString()
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
    .replace(/[\u2018\u2019\u02BC\u05F3`]/g, "'")   // ׳ / ' / ' → plain apostrophe
}

// ── XLSX hyperlink extraction (no external dependencies) ──────────────────────

/** Convert Excel column letter(s) to 0-based index. A→0, B→1, Z→25, AA→26 */
function colLetterToIndex(letters) {
  let idx = 0
  for (const c of letters.toUpperCase()) {
    idx = idx * 26 + (c.charCodeAt(0) - 64)
  }
  return idx - 1
}

/**
 * Minimal ZIP reader: extracts named files from a ZIP ArrayBuffer.
 * Returns { filename: textContent } for each requested file.
 * Uses the browser's native DecompressionStream (deflate-raw) — no libraries.
 */
async function extractZipFiles(buffer, targets) {
  const bytes = new Uint8Array(buffer)
  const view  = new DataView(buffer)
  const dec   = new TextDecoder('utf-8')
  const result = {}

  // Find End of Central Directory signature (PK\x05\x06 = 0x06054b50)
  let eocd = -1
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65558); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) return result

  const cdCount  = view.getUint16(eocd + 10, true)
  const cdOffset = view.getUint32(eocd + 16, true)
  let pos = cdOffset

  for (let i = 0; i < cdCount; i++) {
    if (view.getUint32(pos, true) !== 0x02014b50) break   // central dir entry sig

    const fnLen    = view.getUint16(pos + 28, true)
    const extraLen = view.getUint16(pos + 30, true)
    const cmtLen   = view.getUint16(pos + 32, true)
    // Read compSize from the central directory — always correct, even when the
    // local header has 0 because the data-descriptor flag (bit 3) is set.
    const cdCompSize = view.getUint32(pos + 20, true)
    const localOff = view.getUint32(pos + 42, true)
    const fname    = dec.decode(bytes.subarray(pos + 46, pos + 46 + fnLen))
    pos += 46 + fnLen + extraLen + cmtLen

    if (!targets.includes(fname)) continue

    // Read local file header to find actual data offset
    const localFnLen  = view.getUint16(localOff + 26, true)
    const localExtLen = view.getUint16(localOff + 28, true)
    const method      = view.getUint16(localOff + 8, true)
    const localCompSize = view.getUint32(localOff + 18, true)
    // Prefer central-directory size; fall back to local header (for stored files)
    const compSize    = cdCompSize || localCompSize
    const dataStart   = localOff + 30 + localFnLen + localExtLen
    const compData    = bytes.subarray(dataStart, dataStart + compSize)

    let text
    if (method === 0) {
      text = dec.decode(compData)
    } else {
      // Deflate (method 8) — use native DecompressionStream
      // Must await write + close so the stream receives all data before reading
      const ds     = new DecompressionStream('deflate-raw')
      const writer = ds.writable.getWriter()
      await writer.write(compData)
      await writer.close()
      const out = await new Response(ds.readable).arrayBuffer()
      text = dec.decode(out)
    }
    result[fname] = text
  }
  return result
}

/**
 * Fetch the XLSX file and extract hyperlinks from row-1 column headers.
 * Returns a map of { columnHeaderText: url } using the CSV headers array
 * to resolve column letter → header name.
 */
async function fetchXlsxLinks(csvHeaders) {
  try {
    const resp = await fetch(XLSX_URL)
    if (!resp.ok) return {}
    const buf = await resp.arrayBuffer()

    const files = await extractZipFiles(buf, [
      'xl/worksheets/_rels/sheet1.xml.rels',
      'xl/worksheets/sheet1.xml',
    ])

    const relsXml  = files['xl/worksheets/_rels/sheet1.xml.rels'] || ''
    const sheetXml = files['xl/worksheets/sheet1.xml'] || ''

    // rId → URL
    const ridToUrl = {}
    for (const m of relsXml.matchAll(/Id="(rId\d+)"[^>]*Target="([^"]+)"/g)) {
      ridToUrl[m[1]] = m[2]
    }

    // hyperlinks section of sheet1.xml: ref="X1" r:id="rIdN" (either attribute order)
    const hlBlock = sheetXml.match(/<hyperlinks>([\s\S]*?)<\/hyperlinks>/)
    if (!hlBlock) return {}

    const colLinks = {}
    const pattern = /ref="([A-Z]+)1"[^>]*r:id="(rId\d+)"|r:id="(rId\d+)"[^>]*ref="([A-Z]+)1"/g
    for (const m of hlBlock[1].matchAll(pattern)) {
      const letter = m[1] || m[4]
      const rid    = m[2] || m[3]
      const url    = ridToUrl[rid]
      if (!letter || !url) continue
      const idx    = colLetterToIndex(letter)
      const header = csvHeaders[idx]
      if (header) colLinks[header] = url
    }
    return colLinks
  } catch {
    return {}
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export function useLeaderboardData() {
  const [students, setStudents]       = useState([])
  const [colLinks, setColLinks]       = useState({})
  const [rawCredsMap, setRawCredsMap] = useState({})
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [scoresResult, credsResult] = await Promise.allSettled([
        parseCSV(SCORES_URL),
        parseCSV(CREDS_URL),
      ])

      if (scoresResult.status === 'rejected') {
        throw new Error('לא ניתן לטעון את גיליון הניקוד')
      }

      const scoresRows = scoresResult.value.data
      const credsRows = credsResult.status === 'fulfilled' ? credsResult.value.data : []

      if (!scoresRows.length) throw new Error('הגיליון ריק')

      const scoresHeaders = Object.keys(scoresRows[0])
      const credsHeaders = credsRows.length ? Object.keys(credsRows[0]) : []

      // --- identify score-sheet columns ---
      const nameCol  = findCol(scoresHeaders, 'שם')
      const scoreCol = findCol(scoresHeaders, 'סך', 'ניקוד', 'total', 'score')
      const commentCols = new Set(scoresHeaders.filter(h => h.includes('הערה')))

      const taskCols = scoresHeaders.filter(h => {
        if (!h || !h.trim()) return false
        if (h === nameCol || h === scoreCol) return false
        if (commentCols.has(h)) return false
        return true
      })

      // Extract URL row: a row where the name column contains "קישורים".
      // In that row, put the task URL in the matching task column.
      // This row is removed from the student list.
      const urlRowIdx = nameCol
        ? scoresRows.findIndex(r => cleanStr(r[nameCol]).includes('קישורים'))
        : -1
      if (urlRowIdx !== -1) {
        const urlRow = scoresRows.splice(urlRowIdx, 1)[0]
        const links = {}
        taskCols.forEach(col => {
          const val = cleanStr(urlRow[col] || '')
          if (val.startsWith('http')) links[col] = val
        })
        setColLinks(links)
      }

      let weeklyCol = null
      for (let i = taskCols.length - 1; i >= 0; i--) {
        if (scoresRows.some(r => parseNum(r[taskCols[i]]) !== 0)) {
          weeklyCol = taskCols[i]
          break
        }
      }

      // --- identify credentials columns ---
      const credNameCol  = findCol(credsHeaders, 'שם', 'name')
      const credIdCol    = findCol(credsHeaders, 'זהות', 'id', 'tz', 'תז')
      const credEmailCol = findCol(credsHeaders, 'email', 'mail', 'אימייל')
      const credPhoneCol = findCol(credsHeaders, 'טלפון', 'phone', 'נייד', 'mobile', 'tel', 'whatsapp')

      // Build credentials map  (lowercase name → {name, id, email, phone})
      const credsMap = {}
      credsRows.forEach(row => {
        const rawName = credNameCol ? cleanStr(row[credNameCol]) : ''
        if (!rawName) return
        credsMap[rawName.toLowerCase()] = {
          name:  rawName,
          id:    cleanStr(credIdCol    ? row[credIdCol]    : ''),
          email: cleanStr(credEmailCol ? row[credEmailCol] : '').toLowerCase(),
          phone: cleanStr(credPhoneCol ? row[credPhoneCol] : ''),
        }
      })
      setRawCredsMap(credsMap)

      // Build animal map from sorted names
      const allNames = scoresRows
        .map(r => cleanStr(nameCol ? r[nameCol] : ''))
        .filter(Boolean)
      const animalMap = buildAnimalMap(allNames)

      // Build student objects
      let processed = scoresRows
        .filter(row => nameCol && cleanStr(row[nameCol]))
        .map(row => {
          const name = cleanStr(row[nameCol])
          const score = parseNum(row[scoreCol])
          const animal = animalMap[name] || { emoji: '❓', name: 'Unknown' }
          const creds = credsMap[name.toLowerCase()] || { id: '', email: '', phone: '' }
          const weeklyScore = weeklyCol ? parseNum(row[weeklyCol]) : 0

          const taskBreakdown = taskCols.map(col => {
            const colIdx = scoresHeaders.indexOf(col)
            const nextCol = scoresHeaders[colIdx + 1] || null
            const note = nextCol && commentCols.has(nextCol)
              ? cleanStr(row[nextCol])
              : ''
            return { col, score: parseNum(row[col]), note }
          })

          return {
            name,
            emoji: animal.emoji,
            animalName: animal.name,
            id: creds.id,
            email: creds.email,
            phone: creds.phone,
            score,
            rank: 0,
            weeklyScore,
            isWeeklyChampion: false,
            taskBreakdown,
            badges: [],
          }
        })

      // Sort and rank
      processed.sort((a, b) => b.score - a.score)
      processed.forEach((s, i) => { s.rank = i + 1 })

      // Weekly champion(s)
      if (weeklyCol) {
        const maxWeekly = Math.max(...processed.map(s => s.weeklyScore))
        if (maxWeekly > 0) {
          processed.forEach(s => { s.isWeeklyChampion = s.weeklyScore === maxWeekly })
        }
      }

      // Achievement badges
      const topWeekly = Math.max(...processed.map(s => s.weeklyScore), 0)
      processed.forEach(s => {
        s.badges = []
        if (s.isWeeklyChampion) s.badges.push({ icon: '👑', label: 'אלוף השבוע' })
        if (s.rank <= 3)        s.badges.push({ icon: '🔥', label: 'מובילים' })
        // 🚀 Top weekly riser (not already champ, scored ≥80% of top weekly)
        if (!s.isWeeklyChampion && topWeekly > 0 && s.weeklyScore >= topWeekly * 0.8) {
          s.badges.push({ icon: '🚀', label: 'מזנק השבוע' })
        }
      })

      setStudents(processed)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message || 'שגיאה לא ידועה')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  /**
   * Case-insensitive, Hebrew-safe auth.
   * 1. Matches in students[] by ID, email, or name.
   * 2. Falls back to rawCredsMap (handles students not yet in scores sheet,
   *    or name-mismatch between sheets).
   */
  function authenticate(identifier) {
    const raw = cleanStr(identifier)
    if (!raw) return null
    const lower = raw.toLowerCase()

    // Primary: look in processed students
    const found = students.find(s =>
      (s.id    && cleanStr(s.id).toLowerCase()    === lower) ||
      (s.email && cleanStr(s.email).toLowerCase() === lower) ||
      (s.name  && cleanStr(s.name).toLowerCase()  === lower)
    )
    if (found) return found

    // Fallback: look in credentials map (student exists in creds sheet but not scores)
    const credEntry = Object.values(rawCredsMap).find(c =>
      (c.id    && cleanStr(c.id).toLowerCase()    === lower) ||
      (c.email && cleanStr(c.email).toLowerCase() === lower) ||
      (c.name  && cleanStr(c.name).toLowerCase()  === lower)
    )
    if (credEntry) {
      return {
        name: credEntry.name,
        emoji: '👤',
        animalName: 'Student',
        id: credEntry.id,
        email: credEntry.email,
        phone: credEntry.phone,
        score: 0,
        rank: 0,
        weeklyScore: 0,
        isWeeklyChampion: false,
        taskBreakdown: [],
        badges: [],
      }
    }

    return null
  }

  return { students, colLinks, loading, error, lastUpdated, refetch: fetchData, authenticate }
}
