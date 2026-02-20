import { useState, useEffect, useCallback } from 'react'
import Papa from 'papaparse'
import { buildAnimalMap } from '../utils/animalMap'

const SCORES_URL =
  'https://docs.google.com/spreadsheets/d/1TTuD5vvmE9BhNMDqwsNDXsLEgjUVm54nkqMiFaw_8zY/export?format=csv'
const CREDS_URL =
  'https://docs.google.com/spreadsheets/d/17WWVtK7hKwt2-LW8AA4Gw7ouiHkXoFThyB8bdi9te8s/export?format=csv'

function parseCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: resolve,
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

/** Strip hidden unicode direction/zero-width marks that can appear in Hebrew text */
function cleanStr(s = '') {
  return s.toString().trim().replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
}

export function useLeaderboardData() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

      // Build credentials map  (lowercase name → {id, email, phone})
      const credsMap = {}
      credsRows.forEach(row => {
        const rawName = credNameCol ? cleanStr(row[credNameCol]) : ''
        if (!rawName) return
        credsMap[rawName.toLowerCase()] = {
          id:    cleanStr(credIdCol    ? row[credIdCol]    : ''),
          email: cleanStr(credEmailCol ? row[credEmailCol] : '').toLowerCase(),
          phone: cleanStr(credPhoneCol ? row[credPhoneCol] : ''),
        }
      })

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
   * Matches by ID, email, or (fallback) real name.
   */
  function authenticate(identifier) {
    const raw = cleanStr(identifier)
    if (!raw) return null
    const lower = raw.toLowerCase()
    return (
      students.find(s =>
        (s.id    && cleanStr(s.id).toLowerCase()    === lower) ||
        (s.email && cleanStr(s.email).toLowerCase() === lower) ||
        (s.name  && cleanStr(s.name).toLowerCase()  === lower)
      ) || null
    )
  }

  return { students, loading, error, lastUpdated, refetch: fetchData, authenticate }
}
