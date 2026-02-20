import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { cn } from '../../utils/cn'

const STORAGE_KEY = 'okr_progress_v2'

const OBJECTIVE = 'השבחת מערכת החינוך באמצעות הטמעת AI על ידי תלמידים'

const GOALS = [
  {
    id: 'g1',
    title: 'הכשרת תלמידים כסוכני בינה מלאכותית',
    color: {
      border:  'border-cyan-400/30',
      bg:      'bg-cyan-400/5',
      badge:   'bg-cyan-500/15 text-cyan-300 border-cyan-400/30',
      bar:     'from-cyan-400 to-blue-500',
      heading: 'text-cyan-400',
      dot:     'bg-cyan-400',
    },
    krs: [
      { id: 'g1k1', label: '5 מפגשי השראה עם אנשי תעשייה' },
      { id: 'g1k2', label: 'שלושה שיתופי פעולה עם מורים' },
      { id: 'g1k3', label: 'כולם עוברים מבחן הסמכה' },
    ],
  },
  {
    id: 'g2',
    title: 'יצירת תוצרים אמיתיים שמשפיעים',
    color: {
      border:  'border-violet-400/30',
      bg:      'bg-violet-400/5',
      badge:   'bg-violet-500/15 text-violet-300 border-violet-400/30',
      bar:     'from-violet-400 to-purple-500',
      heading: 'text-violet-400',
      dot:     'bg-violet-400',
    },
    krs: [
      { id: 'g2k1', label: '50% מהתלמידים יצרו תוצר בשימוש פעיל' },
      { id: 'g2k2', label: 'מורים/כיתות אחרות מבקשות להשתמש בתוצר' },
      { id: 'g2k3', label: 'תיק עבודות אישי לכל סוכן' },
    ],
  },
  {
    id: 'g3',
    title: 'השפעה על קהילת המורים',
    color: {
      border:  'border-emerald-400/30',
      bg:      'bg-emerald-400/5',
      badge:   'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
      bar:     'from-emerald-400 to-teal-500',
      heading: 'text-emerald-400',
      dot:     'bg-emerald-400',
    },
    krs: [
      { id: 'g3k1', label: '40 מורים ענו על סקר מיקוד צרכים' },
      { id: 'g3k2', label: '10 מורים מקיימים אינטראקציות עם הסוכנים' },
      { id: 'g3k3', label: 'כתבה אוהדת במקור תקשורת כלשהו' },
    ],
  },
  {
    id: 'g4',
    title: 'בניית תשתית לעתיד',
    color: {
      border:  'border-amber-400/30',
      bg:      'bg-amber-400/5',
      badge:   'bg-amber-500/15 text-amber-300 border-amber-400/30',
      bar:     'from-amber-400 to-orange-500',
      heading: 'text-amber-400',
      dot:     'bg-amber-400',
    },
    krs: [
      { id: 'g4k1', label: "ביקוש גבוה להצטרפות למחזור ב'" },
      { id: 'g4k2', label: 'נוצר מאגר מידע עם תובנות מורים' },
      { id: 'g4k3', label: 'התעניינות מצד בתי ספר אחרים' },
    ],
  },
]

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  catch { return {} }
}

export default function OKRPage({ adminMode }) {
  const [progress, setProgress] = useState(loadProgress)
  const [editing, setEditing]   = useState(null) // { krId, label, barClass }

  const get = (id) => progress[id] ?? 0

  const save = (id, val) => {
    const v = Math.min(100, Math.max(0, Math.round(Number(val) || 0)))
    const next = { ...progress, [id]: v }
    setProgress(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setEditing(null)
  }

  const allKrs  = GOALS.flatMap(g => g.krs)
  const overall = Math.round(allKrs.reduce((s, kr) => s + get(kr.id), 0) / allKrs.length)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">

      {/* ── Objective ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7 glass rounded-2xl p-6 border border-slate-600/30 relative overflow-hidden"
      >
        {/* subtle glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

        <p className="text-[10px] font-orbitron font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">
          Objective · מטרת-על
        </p>
        <h1 className="text-lg font-bold text-slate-100 leading-snug mb-3">
          {OBJECTIVE}
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          החזון הגדול של הנבחרת — שאפתני, לטווח ארוך, ומניע את כל הפעילות.
        </p>

        {/* Overall bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-cyan-400 via-violet-400 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${overall}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className="font-orbitron font-bold text-sm text-cyan-400 w-10 text-left shrink-0">
            {overall}%
          </span>
        </div>
      </motion.div>

      {/* ── Goals ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {GOALS.map((goal, gi) => {
          const goalAvg = Math.round(goal.krs.reduce((s, kr) => s + get(kr.id), 0) / goal.krs.length)
          const c = goal.color
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + gi * 0.08 }}
              className={cn('rounded-2xl border overflow-hidden', c.border, c.bg)}
            >
              {/* Goal header */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn('w-2 h-2 rounded-full shrink-0', c.dot)} />
                  <h2 className={cn('font-bold text-sm', c.heading)}>{goal.title}</h2>
                </div>
                <span className={cn(
                  'shrink-0 text-xs font-orbitron font-bold px-2 py-0.5 rounded-full border',
                  c.badge,
                )}>
                  {goalAvg}%
                </span>
              </div>

              {/* KRs */}
              <div className="px-4 pb-4 space-y-2.5">
                {goal.krs.map((kr, ki) => {
                  const pct = get(kr.id)
                  return (
                    <div key={kr.id}>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <button
                          disabled={!adminMode}
                          onClick={() => adminMode && setEditing({ krId: kr.id, label: kr.label, bar: c.bar })}
                          className={cn(
                            'text-xs text-slate-400 text-right leading-snug flex-1',
                            adminMode && 'hover:text-slate-200 cursor-pointer transition-colors',
                          )}
                        >
                          <span className="text-slate-600 ml-1">{ki + 1}.</span> {kr.label}
                          {adminMode && <span className="text-violet-400/50 mr-1"> ✏️</span>}
                        </button>
                        <span className="text-xs font-orbitron font-bold text-slate-500 shrink-0 w-8 text-left">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full bg-gradient-to-l', c.bar)}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut', delay: gi * 0.05 + ki * 0.03 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {adminMode && (
        <p className="text-xs text-slate-700 text-center mt-6">
          לחץ על יעד לעדכון אחוז ההתקדמות
        </p>
      )}

      {/* ── Edit Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {editing && (
          <ProgressModal
            krId={editing.krId}
            label={editing.label}
            barClass={editing.bar}
            current={get(editing.krId)}
            onSave={save}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Modal ──────────────────────────────────────────────────────────── */

function ProgressModal({ krId, label, barClass, current, onSave, onClose }) {
  const [val, setVal] = useState(String(current))
  const num = Math.min(100, Math.max(0, Number(val) || 0))

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto w-full max-w-xs"
          dir="rtl"
          onClick={e => e.stopPropagation()}
        >
          <div className="glass rounded-2xl border border-violet-400/25 p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-slate-400 leading-snug flex-1">{label}</p>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                <X size={15} />
              </button>
            </div>

            <div>
              <input
                type="number" min={0} max={100}
                value={val}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSave(krId, val)}
                autoFocus
                className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-3 text-3xl font-orbitron font-bold text-center text-violet-300 focus:outline-none focus:border-violet-400/50"
                dir="ltr"
              />

              {/* Live bar */}
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full bg-gradient-to-l transition-all duration-200', barClass)}
                  style={{ width: `${num}%` }}
                />
              </div>
              <p className="text-center text-xs text-slate-600 mt-1">{num}%</p>
            </div>

            <button
              onClick={() => onSave(krId, val)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-500/15 border border-violet-400/30 text-violet-300 text-sm font-semibold hover:bg-violet-500/25 transition-colors"
            >
              <Check size={14} /> שמור
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
