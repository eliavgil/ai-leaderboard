import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, ExternalLink, Bot, X, Send, Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const MISSIONS = [
  {
    id: 1,
    title: 'משימת פאדלט — כנס בינה מלאכותית ירושלים',
    description:
      'השתתפות בכנס חינוך ובינה מלאכותית בירושלים והעלאת המלצות על דוכנים לפדלט משותף.',
    deadline: 'לפני המפגש הראשון',
    maxLabel: 'נמוך',
    link: 'https://padlet.com/eliavgil/padlet-92whdpbavm10cbhj',
    linkLabel: 'לפדלט',
    docLink: 'https://padlet.com/eliavgil/padlet-92whdpbavm10cbhj',
    colKey: 'משימה פאדלט',
    systemPrompt:
      'אתה עוזר לימודי לקורס AI למורים. המשימה הנוכחית היא "משימת פאדלט": המשתתפים השתתפו בכנס חינוך ובינה מלאכותית בירושלים ועליהם להעלות המלצות על דוכנים לפדלט משותף. עזור לתלמידים עם שאלות על אופן ההעלאה לפדלט, מה לכלול בהמלצה, ואיך לנסח אותה. ענה בעברית, בצורה ידידותית וקצרה.',
  },
  {
    id: 2,
    title: 'מייל ארגוני, פרומפט ועבודה עם נוטבוק',
    description:
      "כניסה לג'ימיני עם המייל הארגוני, כתיבת פרומפט מעולה, ויצירת מחברת NotebookLM עם סקירה קולית, בוחן ואינפוגרפיקה.",
    deadline: '16.9',
    maxLabel: '4 נקודות',
    link: null,
    docLink: 'https://docs.google.com/document/d/1BUzYwKdDKIgw_YR_3o5y8aCgF50wImQClzIWcnWhzPw/edit',
    colKey: 'משימה מייל ארגוני, פרומפט ועבודה עם נוטבוק',
    systemPrompt:
      'אתה עוזר לימודי לקורס AI למורים. המשימה הנוכחית: כניסה לג\'ימיני עם מייל ארגוני, כתיבת פרומפט מעולה, ויצירת מחברת NotebookLM הכוללת סקירה קולית, בוחן ואינפוגרפיקה. עזור לתלמידים עם שאלות על: איך להיכנס לג\'ימיני עם מייל ארגוני, מה מאפיין פרומפט טוב, ואיך להשתמש ב-NotebookLM ליצירת תוכן. ענה בעברית, בצורה ברורה ומעשית.',
  },
  {
    id: 3,
    title: 'מבחן Studywise ומחקר NotebookLM — תיק עבודות 1',
    description:
      'מחקר על יתרונות AI למורים, הכנת חומר לימוד ב-NotebookLM הכולל לפחות 3 סוגי מידע, ויצירת מבחן של 10 שאלות ב-Studywise.',
    deadline: '25.2.2026 עד 22:00',
    maxLabel: '30 נקודות',
    link: null,
    docLink: null,
    colKey: 'משימה מבחן סטאדיוויז מחקר נוטבוק',
    systemPrompt:
      'אתה עוזר לימודי לקורס AI למורים. המשימה הנוכחית (תיק עבודות 1): מחקר על יתרונות AI למורים, הכנת חומר לימוד ב-NotebookLM הכולל לפחות 3 סוגי מידע שונים (טקסט, וידאו, אודיו וכד\'), ויצירת מבחן של 10 שאלות ב-Studywise. עזור לתלמידים עם שאלות על: איך לבנות חומר לימוד איכותי, מה נחשב "3 סוגי מידע", ואיך ליצור מבחן ב-Studywise. ענה בעברית, צעד אחר צעד.',
  },
]

export default function MissionsPage({ user, students }) {
  const student = students.find(s => s.name === user.name) || user
  const breakdown = student.taskBreakdown || []
  const [chatMission, setChatMission] = useState(null)

  const submittedCount = MISSIONS.filter(m => {
    const task = breakdown.find(t => t.col === m.colKey)
    return task && task.score > 0
  }).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>🎯</span> משימות
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {submittedCount} מתוך {MISSIONS.length} משימות הוגשו
        </p>
      </motion.div>

      {/* Overall progress bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-slate-700/40 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-semibold text-sm">התקדמות כוללת</span>
          <span className="font-orbitron font-bold text-cyan-400 text-sm">
            {Math.round((submittedCount / MISSIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(submittedCount / MISSIONS.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <span>{MISSIONS.length - submittedCount} לא הוגשו</span>
          <span>{submittedCount} הוגשו</span>
        </div>
      </motion.div>

      {/* Mission cards */}
      <div className="space-y-3">
        {MISSIONS.map((mission, i) => {
          const task  = breakdown.find(t => t.col === mission.colKey)
          const score = task?.score ?? 0
          const done  = score > 0
          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              score={score}
              done={done}
              note={task?.note}
              index={i}
              onOpenChat={() => setChatMission(mission)}
            />
          )
        })}
      </div>

      {/* Chatbot modal */}
      <AnimatePresence>
        {chatMission && (
          <MissionChatModal
            mission={chatMission}
            onClose={() => setChatMission(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Mission Card ─────────────────────────────────────────────────────────── */

function MissionCard({ mission, score, done, note, index, onOpenChat }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        'glass rounded-2xl p-5 border transition-colors',
        done
          ? 'border-emerald-400/25 bg-emerald-500/4'
          : 'border-slate-700/30',
      )}
    >
      <div className="flex items-start gap-3">

        {/* Status icon */}
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5',
          done
            ? 'bg-emerald-400/10 border border-emerald-400/20'
            : 'bg-slate-800/60 border border-slate-700/30',
        )}>
          {done ? '✅' : '⏳'}
        </div>

        <div className="flex-1 min-w-0">

          {/* Title + status badge */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-slate-200 leading-snug">{mission.title}</h3>
            {done ? (
              <span className="flex items-center gap-1 text-xs font-orbitron font-bold text-emerald-400 tabular-nums shrink-0 mt-0.5">
                <CheckCircle size={12} /> {score} נק׳
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-600 shrink-0 mt-0.5">
                <Clock size={11} /> לא הוגש
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {mission.description}
          </p>

          {/* Meta: deadline + max score */}
          <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-3">
            <span>📅 הגשה: <span className="text-slate-500">{mission.deadline}</span></span>
            <span>⭐ מקסימום: <span className="text-slate-500">{mission.maxLabel}</span></span>
          </div>

          {/* Note from sheet */}
          {note && (
            <p className="mb-3 text-xs text-amber-400/80 flex items-center gap-1">
              <span>💬</span> {note}
            </p>
          )}

          {/* Action buttons row */}
          <div className="flex flex-wrap gap-2">
            {/* Open mission doc */}
            {mission.docLink && (
              <a
                href={mission.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                           bg-violet-500/10 border border-violet-400/25 text-violet-300
                           text-xs font-medium hover:bg-violet-500/20 transition-colors"
              >
                <ExternalLink size={11} />
                פתח משימה
              </a>
            )}

            {/* AI Help chatbot */}
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-cyan-500/10 border border-cyan-400/25 text-cyan-300
                         text-xs font-medium hover:bg-cyan-500/20 transition-colors"
            >
              <Bot size={11} />
              עזרה 🤖
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Chat Modal ───────────────────────────────────────────────────────────── */

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
console.log('[ChatBot] API_KEY:', API_KEY ? `${API_KEY.slice(0, 10)}...` : 'MISSING')

function MissionChatModal({ mission, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const headers = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'x-api-key': API_KEY,
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: mission.systemPrompt,
          messages: updated,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `שגיאה ${res.status}`)
      }

      const data = await res.json()
      const reply = data.content?.[0]?.text ?? '...'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-lg"
          dir="rtl"
          onClick={e => e.stopPropagation()}
        >
          <div className="glass rounded-2xl border border-cyan-400/20 overflow-hidden shadow-2xl flex flex-col"
               style={{ height: '75vh', maxHeight: '600px' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={15} className="text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">עזרה — {mission.title}</p>
                  <p className="text-xs text-slate-600">AI לעזרה במשימה</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-600 hover:text-slate-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🤖</p>
                  <p className="text-sm text-slate-500">שאל אותי כל שאלה על המשימה</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-start' : 'justify-end',
                  )}
                >
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-slate-800/70 border border-slate-700/40 text-slate-200 rounded-tr-sm'
                      : 'bg-cyan-500/12 border border-cyan-400/20 text-slate-200 rounded-tl-sm',
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-end">
                  <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <Loader2 size={14} className="text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 text-center px-4">
                  שגיאה: {error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-800/60 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="כתוב שאלה... (Enter לשליחה)"
                  rows={2}
                  className="flex-1 bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2
                             text-sm text-slate-200 placeholder-slate-600
                             focus:outline-none focus:border-cyan-400/40 resize-none leading-relaxed"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300
                             hover:bg-cyan-500/25 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
