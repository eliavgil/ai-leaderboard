import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const SCHEDULE = [
  {
    week: 1,
    title: 'מבוא לבינה מלאכותית',
    date: 'שבוע 1',
    status: 'completed',
    description: 'יסודות AI ו-ML, כלים ומושגים בסיסיים, הכרת הסוכנים',
    icon: '🧠',
  },
  {
    week: 2,
    title: 'שיטות למידה',
    date: 'שבוע 2',
    status: 'completed',
    description: 'Supervised, Unsupervised ו-Reinforcement Learning, מודלים קלאסיים',
    icon: '📊',
  },
  {
    week: 3,
    title: 'עיבוד שפה טבעית',
    date: 'שבוע 3',
    status: 'active',
    description: 'NLP, Tokenization, Transformers ו-Prompt Engineering',
    icon: '📝',
  },
  {
    week: 4,
    title: 'ראייה ממוחשבת',
    date: 'שבוע 4',
    status: 'upcoming',
    description: 'CNN, Object Detection, Image Generation, Multimodal AI',
    icon: '👁️',
  },
  {
    week: 5,
    title: 'סוכנים אוטונומיים',
    date: 'שבוע 5',
    status: 'upcoming',
    description: 'AI Agents, ReAct, Tool Use, Multi-Agent Systems',
    icon: '🤖',
  },
  {
    week: 6,
    title: 'פרויקט גמר',
    date: 'שבוע 6',
    status: 'upcoming',
    description: 'בניית סוכן AI עצמאי מקצה לקצה — תכנון, פיתוח, הצגה',
    icon: '🚀',
  },
]

const STATUS_CONFIG = {
  completed: { label: 'הושלם',   dot: 'bg-emerald-400', line: 'bg-emerald-400/40', text: 'text-emerald-400',  card: 'border-emerald-400/20 bg-emerald-400/4'  },
  active:    { label: 'עכשיו',   dot: 'bg-cyan-400 animate-pulse', line: 'bg-cyan-400/40',    text: 'text-cyan-400',    card: 'border-cyan-400/30 bg-cyan-400/5 glow-cyan'   },
  upcoming:  { label: 'בקרוב',   dot: 'bg-slate-600',  line: 'bg-slate-700',      text: 'text-slate-500',   card: 'border-slate-700/40'                          },
}

export default function LogisticsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>📅</span> לוח זמנים ולוגיסטיקה
        </h1>
        <p className="text-slate-500 text-sm mt-1">מסלול הקורס ותאריכי המשימות</p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute right-[1.4rem] top-4 bottom-4 w-0.5 bg-slate-800" />

        <div className="space-y-5">
          {SCHEDULE.map((item, i) => {
            const cfg = STATUS_CONFIG[item.status]
            return (
              <motion.div
                key={item.week}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex gap-4"
              >
                {/* Dot */}
                <div className="flex flex-col items-center shrink-0 mt-4">
                  <div className={cn('w-4 h-4 rounded-full border-2 border-slate-950 z-10', cfg.dot)} />
                </div>

                {/* Card */}
                <div className={cn(
                  'flex-1 glass-sm rounded-xl p-4 border transition-colors',
                  cfg.card,
                )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <h3 className="font-semibold text-slate-200 text-sm">{item.title}</h3>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
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

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-slate-700 text-center mt-8"
      >
        * לוח הזמנים עשוי להתעדכן — עקבו אחר הודעות המרצה
      </motion.p>
    </div>
  )
}
