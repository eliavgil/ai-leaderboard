import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, CheckSquare, Square, Copy } from 'lucide-react'
import { cn } from '../../utils/cn'
import { buildWAUrl } from '../../utils/whatsapp'
import WhatsAppQueueModal from '../WhatsAppQueueModal'

export default function WhatsAppDashboard({ students, adminMode }) {
  const [selected, setSelected] = useState(new Set())
  const [search,   setSearch]   = useState('')
  const [copied,   setCopied]   = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)

  if (!adminMode) return (
    <div className="flex items-center justify-center min-h-[60vh] text-slate-600">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p>גישה למנהלים בלבד</p>
      </div>
    </div>
  )

  const withPhone = students.filter(s => s.phone)
  const filtered  = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  )
  const selectedStudents = students.filter(s => selected.has(s.name) && s.phone)

  // ── selection ────────────────────────────────────────────────────────────
  const toggle = (name) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const eligibleInFilter = filtered.filter(s => s.phone)
  const allChecked =
    eligibleInFilter.length > 0 &&
    eligibleInFilter.every(s => selected.has(s.name))

  const toggleAll = () => {
    const names = eligibleInFilter.map(s => s.name)
    setSelected(prev => {
      const next = new Set(prev)
      if (allChecked) names.forEach(n => next.delete(n))
      else            names.forEach(n => next.add(n))
      return next
    })
  }

  // ── copy numbers ─────────────────────────────────────────────────────────
  const handleCopy = async () => {
    await navigator.clipboard.writeText(selectedStudents.map(s => s.phone).join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-emerald-400" />
                WhatsApp Bulk
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {withPhone.length} עם טלפון · {selected.size} נבחרו
              </p>
            </div>

            {/* OPEN QUEUE BUTTON */}
            <motion.button
              onClick={() => setQueueOpen(true)}
              disabled={selectedStudents.length === 0}
              whileHover={{ scale: selectedStudents.length > 0 ? 1.04 : 1 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                selectedStudents.length > 0
                  ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-slate-800/50 border border-slate-700/40 text-slate-600 cursor-not-allowed',
              )}
            >
              <Send size={14} />
              <span>
                {selectedStudents.length > 0
                  ? `פתח תור שליחה (${selectedStudents.length})`
                  : 'בחר סטודנטים'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── No phone warning ─────────────────────────────────────────────── */}
        {withPhone.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-5 border border-amber-400/20 bg-amber-400/5 mb-6 text-center"
          >
            <p className="text-amber-300 font-semibold mb-1">לא נמצאו מספרי טלפון</p>
            <p className="text-slate-500 text-sm">
              הוסף עמודת{' '}
              <span className="font-mono text-amber-400">"Phone"</span> או{' '}
              <span className="font-mono text-amber-400">"טלפון"</span>{' '}
              לגיליון הסטודנטים
            </p>
          </motion.div>
        )}

        {/* ── Student list ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden border border-slate-700/40 mb-5"
        >
          {/* List header */}
          <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-3">
            <button
              onClick={toggleAll}
              title="בחר/בטל הכל"
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            >
              {allChecked
                ? <CheckSquare size={16} className="text-emerald-400" />
                : <Square size={16} />
              }
            </button>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש סטודנט..."
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
            />
            <span className="text-xs text-slate-700 font-mono shrink-0">
              {eligibleInFilter.length} עם טלפון
            </span>
          </div>

          <div className="divide-y divide-slate-800/40 max-h-96 overflow-y-auto">
            {filtered.map((student, i) => {
              const isSelected = selected.has(student.name)
              const hasPhone   = Boolean(student.phone)

              return (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => hasPhone && toggle(student.name)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 transition-colors',
                    hasPhone
                      ? cn('cursor-pointer hover:bg-white/3', isSelected && 'bg-emerald-500/6')
                      : 'opacity-35 cursor-not-allowed',
                  )}
                >
                  {/* Checkbox */}
                  <div className="shrink-0">
                    {isSelected
                      ? <CheckSquare size={15} className="text-emerald-400" />
                      : <Square size={15} className="text-slate-600" />
                    }
                  </div>

                  <span className="text-xl shrink-0">{student.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{student.name}</p>
                    <p className="text-xs text-slate-600 font-mono">
                      {hasPhone ? student.phone : 'אין מספר'}
                    </p>
                  </div>

                  {/* Single direct WA link for this student */}
                  {hasPhone && (
                    <button
                      onClick={e => { e.stopPropagation(); window.location.href = buildWAUrl(student.phone, student.name, student.score) }}
                      title={`פתח WhatsApp ל-${student.name}`}
                      className="shrink-0 text-emerald-600 hover:text-emerald-400 transition-colors p-1"
                    >
                      <MessageSquare size={14} />
                    </button>
                  )}

                  <span className="text-xs font-orbitron text-slate-700 shrink-0">
                    #{student.rank}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Bottom: copy numbers ─────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass rounded-2xl p-4 border border-emerald-400/15 bg-emerald-400/3 flex items-center justify-between gap-4"
            >
              <p className="text-slate-400 text-sm">
                <span className="font-semibold text-emerald-400">{selectedStudents.length}</span> נבחרו
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                           bg-slate-700/50 border border-slate-600/40 text-slate-300
                           hover:bg-slate-700/70 transition-all"
              >
                <Copy size={13} />
                <span>{copied ? '✓ הועתק!' : 'העתק מספרים'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Queue Modal ──────────────────────────────────────────────────────── */}
      <WhatsAppQueueModal
        isOpen={queueOpen}
        onClose={() => setQueueOpen(false)}
        students={selectedStudents}
      />
    </>
  )
}
