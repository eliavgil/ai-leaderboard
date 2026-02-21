import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, ExternalLink, Bot } from 'lucide-react'
import { cn } from '../../utils/cn'

/* ── Gemini helper ───────────────────────────────────────────────────────── */
const PROMPT_PREFIX = 'אני תלמיד בנבחרת ה-AI, קיבלתי את המשימה הזו: '
const PROMPT_SUFFIX = '. אני רוצה שתעזור לי לעשות עבודה מצוינת. מה עוד אתה צריך לדעת בשביל לעזור לי בצורה הכי טובה?'

const buildGeminiPrompt = (instructions) =>
  PROMPT_PREFIX + instructions + PROMPT_SUFFIX

/* ── משימות (ניקוד נמוך) ─────────────────────────────────────────────────── */
const TASKS = [
  {
    id: 't1',
    title: 'משימה 1 — פאדלט',
    description: 'השתתפות בכנס חינוך ובינה מלאכותית בירושלים והעלאת המלצות על דוכנים לפדלט משותף.',
    deadline: 'לפני המפגש הראשון',
    maxLabel: 'ניקוד נמוך',
    link: 'https://padlet.com/eliavgil/padlet-92whdpbavm10cbhj',
    linkLabel: 'לפדלט',
    docLink: 'https://padlet.com/eliavgil/padlet-92whdpbavm10cbhj',
    colKey: 'משימה 1 פאדלט',
    geminiInstructions: 'השתתפות בכנס חינוך ובינה מלאכותית בירושלים והעלאת המלצות על דוכנים לפדלט משותף.',
  },
  {
    id: 't2',
    title: 'משימה 2 — תיוג וואטסאפ',
    description: 'הוספת תיוג אישי בקבוצת וואטסאפ',
    deadline: 'תחילת הקורס',
    maxLabel: 'ניקוד נמוך',
    link: null,
    linkLabel: null,
    docLink: null,
    colKey: 'משימה 2 תיג וואצפ',
    geminiInstructions: 'הוספת תיוג אישי בקבוצת וואטסאפ.',
  },
  {
    id: 't3b',
    title: 'משימה 3 — מייל ארגוני, פרומפט, נוטבוק',
    description: "כניסה לג'ימיני עם המייל הארגוני, כתיבת פרומפט מעולה שמלמד לעבוד עם נוטבוק, יצירת מחברת נוטבוק עם סקירה קולית ובוחן ואינפוגרפיקה על נושא לבחירה.",
    deadline: 'ניקוד נמוך',
    maxLabel: 'ניקוד נמוך',
    link: 'https://docs.google.com/document/d/1JZaSryPktAYAEseZiVCRUZHW1Q2w7e8OPVD_W0WUdcM/edit?usp=sharing',
    linkLabel: 'פתח משימה',
    docLink: 'https://docs.google.com/document/d/1JZaSryPktAYAEseZiVCRUZHW1Q2w7e8OPVD_W0WUdcM/edit?usp=sharing',
    colKey: 'משימה 3 מייל ארגוני, פרומפט, נוטבוק',
    geminiInstructions: "כניסה לג'ימיני עם המייל הארגוני, כתיבת פרומפט מעולה שמלמד לעבוד עם נוטבוק, יצירת מחברת נוטבוק עם סקירה קולית ובוחן ואינפוגרפיקה על נושא לבחירה.",
  },
  {
    id: 't4',
    title: 'משימה 4 — מפגש סטאדיוויז ונוטבוק 17.2',
    description: 'השתתפות פעילה במפגש Studywise ו-NotebookLM ביום 17.2.',
    deadline: '17.2.2026',
    maxLabel: 'ניקוד נמוך',
    link: null,
    linkLabel: null,
    docLink: null,
    colKey: 'משימה 4 מפגש סטאדיוויז, נוטבוק 17.2',
    geminiInstructions: 'השתתפות פעילה במפגש Studywise ו-NotebookLM ביום 17.2.',
    hidden: true,
  },
]

/* ── עבודות (ניקוד גבוה, נכנסות לתיק עבודות) ────────────────────────────── */
const WORKS = [
  {
    id: 'w1',
    title: 'עבודה 1 — נוטבוק וסטאדיוויז',
    description: 'מחקר על יתרונות AI למורים, הכנת חומר לימוד ב-NotebookLM הכולל לפחות 3 סוגי מידע, ויצירת מבחן של 10 שאלות ב-Studywise.',
    deadline: '25.2.2026 עד 22:00',
    maxLabel: '30 נקודות',
    link: null,
    linkLabel: null,
    docLink: 'https://docs.google.com/document/d/1BUzYwKdDKIgw_YR_3o5y8aCgF50wImQClzIWcnWhzPw/edit?usp=drive_link',
    colKey: 'עבודה 1 נוטבוק וסטאדיוויז',
    geminiInstructions: 'מחקר על יתרונות AI למורים, הכנת חומר לימוד ב-נוטבוק הכולל לפחות 3 סוגי מידע, יצירת מבחן של 10 שאלות ב-סטאדיוויז, שליחת קישורים. מועד הגשה 25.2.2026 עד 22:00.',
  },
]

// הצג רק עמודות שמכילות "משימה" או "עבודה", ודחה עמודות הערה בלבד
const isRelevantCol = (col) =>
  (col.includes('משימה') || col.includes('עבודה')) &&
  !col.includes('הערה')

export default function MissionsPage({ user, students }) {
  const student   = students.find(s => s.name === user.name) || user
  const breakdown = (student.taskBreakdown || []).filter(t => isRelevantCol(t.col))

  const all       = [...TASKS, ...WORKS]
  const doneCount = all.filter(m => (breakdown.find(t => t.col === m.colKey)?.score ?? 0) > 0).length
  const tasksDone = TASKS.filter(m => (breakdown.find(t => t.col === m.colKey)?.score ?? 0) > 0).length
  const worksDone = WORKS.filter(m => (breakdown.find(t => t.col === m.colKey)?.score ?? 0) > 0).length

  const renderCards = (list, offset = 0) =>
    list.filter(m => !m.hidden).map((mission, i) => {
      const task  = breakdown.find(t => t.col === mission.colKey)
      const score = task?.score ?? 0
      return (
        <MissionCard
          key={mission.id}
          mission={mission}
          score={score}
          done={score > 0}
          note={task?.note}
          index={offset + i}
          geminiPrompt={buildGeminiPrompt(mission.geminiInstructions)}
        />
      )
    })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>🎯</span> משימות ועבודות
        </h1>
        <p className="text-slate-500 text-sm mt-1">{doneCount} מתוך {all.length} הוגשו</p>
      </motion.div>

      {/* Overall progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-slate-700/40 mb-7"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-semibold text-sm">התקדמות כוללת</span>
          <span className="font-orbitron font-bold text-cyan-400 text-sm">
            {Math.round((doneCount / all.length) * 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / all.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600">
          <span>{all.length - doneCount} לא הוגשו</span>
          <span>{doneCount} הוגשו</span>
        </div>
      </motion.div>

      {/* ── משימות ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
            משימות
          </h2>
          <span className="text-xs text-slate-600">{tasksDone}/{TASKS.length} הוגשו</span>
        </div>
        <div className="space-y-3 mb-7">
          {renderCards(TASKS, 0)}
        </div>
      </motion.div>

      {/* ── עבודות ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
            עבודות — תיק עבודות
          </h2>
          <span className="text-xs text-slate-600">{worksDone}/{WORKS.length} הוגשו</span>
        </div>
        <div className="space-y-3">
          {renderCards(WORKS, TASKS.length)}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Mission Card ─────────────────────────────────────────────────────────── */

function MissionCard({ mission, score, done, note, index, geminiPrompt }) {
  const [copied, setCopied] = useState(false)

  const handleGeminiHelp = async () => {
    await navigator.clipboard.writeText(geminiPrompt)
    window.open('https://gemini.google.com/app', '_blank')
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

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

            {/* Gemini help */}
            <button
              onClick={handleGeminiHelp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-cyan-500/10 border border-cyan-400/25 text-cyan-300
                         text-xs font-medium hover:bg-cyan-500/20 transition-colors"
            >
              <Bot size={11} />
              {copied ? 'הפרומפט הועתק — הדבק אותו בג\'ימיני' : 'עזרה 🤖'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
