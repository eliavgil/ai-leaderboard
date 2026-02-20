import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Check } from 'lucide-react'
import { cn } from '../../utils/cn'

const STORAGE_KEY = 'logistics_schedule'

const DEFAULT_SCHEDULE = [
  { id: 1,  date: '02.02.2026', type: 'השראה',        content: 'כנס AI בחינוך בירושלים',                            notes: 'לינק למשוב תלמידים, לינק לפאדלט דוכנים אהובים' },
  { id: 2,  date: '10.02.2026', type: 'למידה/עבודה',  content: "פרומפטים ג'ימיני ונוטבוק",                         notes: '' },
  { id: 3,  date: '17.02.2026', type: 'למידה/עבודה',  content: 'סטאדי וויז, וייז, קנבה',                           notes: '' },
  { id: 4,  date: '24.02.2026', type: 'למידה/עבודה',  content: 'בייס',                                              notes: '' },
  { id: 5,  date: '03.03.2026', type: 'חופשה',         content: 'חופשת פורים',                                      notes: '' },
  { id: 6,  date: '10.03.2026', type: 'השראה',        content: 'סיור תל אביב — מטא, למוניייד, גוגל',               notes: '' },
  { id: 7,  date: '17.03.2026', type: 'למידה/עבודה',  content: "בייס ופיצ'",                                       notes: '' },
  { id: 8,  date: '24.03.2026', type: 'חופשה',         content: 'חופשת פסח',                                       notes: '' },
  { id: 9,  date: '31.03.2026', type: 'חופשה',         content: 'חופשת פסח',                                       notes: '' },
  { id: 10, date: '07.04.2026', type: 'חופשה',         content: 'חופשת פסח',                                       notes: '' },
  { id: 11, date: '14.04.2026', type: 'השראה',        content: 'הרצאה: אילנה ריכטר, שיווק בעידן AI',               notes: '' },
  { id: 12, date: '21.04.2026', type: 'למידה/עבודה',  content: "פיצ' והצגת פעילות אישית",                         notes: '' },
  { id: 13, date: '28.04.2026', type: 'חופשה',         content: 'השתלמות מורים',                                   notes: '' },
  { id: 14, date: '05.05.2026', type: 'חופשה',         content: "ל\"ג בעומר",                                      notes: '' },
  { id: 15, date: '12.05.2026', type: 'השראה',        content: 'סיור מיינדסט ירוחם',                               notes: '' },
  { id: 16, date: '19.05.2026', type: 'השראה',        content: 'הרצאה: דן טימסיט, AI בעולם העבודה',                notes: '' },
  { id: 17, date: '26.05.2026', type: 'למידה/עבודה',  content: 'סיכום פעילות והכנה למפגש סיום',                   notes: '' },
  { id: 18, date: '02.06.2026', type: 'מפגש סיום',    content: 'מפגש סיום',                                        notes: '' },
  { id: 19, date: '09.06.2026', type: 'פנוי',          content: 'פנוי',                                             notes: '' },
  { id: 20, date: '16.06.2026', type: 'פנוי',          content: 'פנוי',                                             notes: '' },
]

const TYPE_ICON = {
  'השראה':       '✨',
  'למידה/עבודה': '🛠️',
  'חופשה':       '🏖️',
  'מפגש סיום':   '🏆',
  'פנוי':        '📅',
}

const TYPES = ['השראה', 'למידה/עבודה', 'חופשה', 'מפגש סיום', 'פנוי']

const STATUS_CONFIG = {
  completed: { label: 'הושלם', dot: 'bg-emerald-400',              card: 'border-emerald-400/20 bg-emerald-400/4' },
  active:    { label: 'הבא',   dot: 'bg-cyan-400 animate-pulse',   card: 'border-cyan-400/30 bg-cyan-400/5'       },
  upcoming:  { label: 'בקרוב', dot: 'bg-slate-600',                card: 'border-slate-700/40'                    },
}

function parseDate(str) {
  const [d, m, y] = str.split('.').map(Number)
  return new Date(y, m - 1, d)
}

function withStatus(schedule) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const firstUpcoming = schedule.findIndex(item => parseDate(item.date) >= today)
  return schedule.map((item, i) => ({
    ...item,
    status: parseDate(item.date) < today ? 'completed' : i === firstUpcoming ? 'active' : 'upcoming',
  }))
}

export default function LogisticsPage({ adminMode }) {
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE
    } catch {
      return DEFAULT_SCHEDULE
    }
  })
  const [editItem, setEditItem] = useState(null)

  const items = withStatus(schedule)

  const handleSave = (updated) => {
    const next = schedule.map(item => item.id === updated.id ? updated : item)
    setSchedule(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setEditItem(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>📅</span> לוח זמנים
        </h1>
        <p className="text-slate-500 text-sm mt-1">כל המפגשים — ימי שלישי{adminMode && ' · לחץ על מפגש לעריכה'}</p>
      </motion.div>

      <div className="relative">
        <div className="absolute right-[1.4rem] top-4 bottom-4 w-0.5 bg-slate-800" />
        <div className="space-y-4">
          {items.map((item, i) => {
            const cfg = STATUS_CONFIG[item.status]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center shrink-0 mt-4">
                  <div className={cn('w-4 h-4 rounded-full border-2 border-slate-950 z-10', cfg.dot)} />
                </div>

                <div
                  className={cn(
                    'flex-1 glass-sm rounded-xl p-4 border transition-colors',
                    cfg.card,
                    adminMode && 'cursor-pointer hover:border-violet-400/40',
                  )}
                  onClick={() => adminMode && setEditItem({ ...item })}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base leading-none">{TYPE_ICON[item.type] ?? '📅'}</span>
                        <span className="text-xs text-slate-500">{item.type}</span>
                        {adminMode && <Pencil size={10} className="text-violet-400/50 mr-1" />}
                      </div>
                      <p className="font-semibold text-slate-200 text-sm leading-snug">{item.content}</p>
                      {item.notes && (
                        <p className="text-xs text-amber-400/70 mt-1.5 leading-relaxed">{item.notes}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-xs text-slate-600 font-mono mb-1">{item.date}</p>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full border',
                        item.status === 'completed' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' :
                        item.status === 'active'    ? 'bg-cyan-400/10    border-cyan-400/20    text-cyan-400'    :
                                                      'bg-slate-700/50   border-slate-600/30   text-slate-500',
                      )}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {editItem && (
          <EditModal item={editItem} onSave={handleSave} onClose={() => setEditItem(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Edit Modal ─────────────────────────────────────────────────────────── */

function EditModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ ...item })
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="pointer-events-auto w-full max-w-sm"
          dir="rtl"
          onClick={e => e.stopPropagation()}
        >
          <div className="glass rounded-2xl border border-violet-400/20 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-200 text-sm">עריכת מפגש</h2>
              <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">תאריך</label>
              <input
                value={form.date}
                onChange={e => set('date', e.target.value)}
                placeholder="dd.mm.yyyy"
                dir="ltr"
                className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-400/40"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">סוג</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-400/40"
              >
                {TYPES.map(t => <option key={t} value={t}>{TYPE_ICON[t]} {t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">תוכן</label>
              <input
                value={form.content}
                onChange={e => set('content', e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-400/40"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">הערות</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-400/40 resize-none"
              />
            </div>

            <button
              onClick={() => onSave(form)}
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
