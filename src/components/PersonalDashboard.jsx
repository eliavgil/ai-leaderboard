import { motion } from 'framer-motion'
import { Star, Hash, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react'
import { cn } from '../utils/cn'

export default function PersonalDashboard({ user, students, adminMode }) {
  // Use the live-updated student from the sorted list (rank might have changed)
  const student = students.find(s => s.name === user.name) || user

  const completedTasks = student.taskBreakdown.filter(t => t.score > 0).length
  const allFeedback = student.taskBreakdown.filter(t => t.note)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" dir="rtl">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          className="text-7xl mb-3 inline-block select-none"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {student.emoji}
        </motion.div>

        <h2 className="font-orbitron font-black text-2xl text-white mb-1">
          {adminMode ? student.name : student.animalName}
        </h2>
        <p className="text-slate-500 text-sm">
          {adminMode ? `${student.emoji} ${student.animalName}` : 'סוכן AI'}
        </p>

        {student.isWeeklyChampion && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full
                       bg-amber-400/10 border border-amber-400/30 text-amber-300 text-sm font-semibold"
            style={{ boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}
          >
            <span>👑</span>
            <span>אלוף השבוע!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <StatCard
          icon={<Star size={16} />}
          label='סה"כ נקודות'
          value={student.score.toLocaleString()}
          color="cyan"
        />
        <StatCard
          icon={<Hash size={16} />}
          label="דירוג"
          value={`#${student.rank}`}
          color="violet"
          sub={`מתוך ${students.length}`}
        />
        <StatCard
          icon={<TrendingUp size={16} />}
          label="השבוע"
          value={student.weeklyScore > 0 ? `+${student.weeklyScore}` : '—'}
          color="emerald"
        />
      </motion.div>

      {/* Progress bar vs class */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-sm rounded-xl px-5 py-4 mb-6 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">
              {Math.round((student.score / students[0].score) * 100)}% מהניקוד המקסימלי
            </span>
            <span className="text-xs text-slate-400 font-medium">התקדמות כוללת</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-cyan-400 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (student.score / students[0].score) * 100)}%` }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Task Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden border border-slate-700/40 mb-5"
      >
        <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <CheckCircle size={13} />
            <span>{completedTasks} / {student.taskBreakdown.length} הושלמו</span>
          </div>
          <h3 className="font-semibold text-slate-200 text-sm">פירוט ניקוד</h3>
        </div>

        {student.taskBreakdown.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-sm">אין משימות לתצוגה</div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {student.taskBreakdown.map((task, i) => (
              <motion.div
                key={task.col}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className={cn(
                  'px-5 py-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-white/2',
                  task.score === 0 && 'opacity-40'
                )}
              >
                {/* Left: score + note */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    'font-orbitron font-bold text-sm tabular-nums shrink-0 w-10 text-left',
                    task.score > 0 ? 'text-cyan-400' : 'text-slate-600'
                  )}>
                    {task.score > 0 ? task.score : '—'}
                  </span>
                  {task.note && (
                    <span className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700/40 rounded-lg px-2 py-0.5 truncate">
                      💬 {task.note}
                    </span>
                  )}
                </div>

                {/* Right: column name */}
                <span className="text-sm text-slate-300 font-medium text-right shrink-0">{task.col}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Feedback summary (all notes) */}
      {allFeedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-sm rounded-2xl p-5 border border-slate-700/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={14} className="text-cyan-400" />
            <h3 className="font-semibold text-slate-300 text-sm">משוב מהמרצה</h3>
          </div>
          <div className="space-y-3">
            {allFeedback.map((task, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1 bg-cyan-400/30 rounded-full shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">{task.col}</p>
                  <p className="text-sm text-slate-300">{task.note}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color, sub }) {
  const colorMap = {
    cyan: 'text-cyan-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-4 text-center border border-slate-700/40"
    >
      <div className={cn('flex justify-center mb-2', colorMap[color])}>{icon}</div>
      <p className={cn('font-orbitron font-black text-xl', colorMap[color])}>{value}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
      {sub && <p className="text-slate-600 text-xs">{sub}</p>}
    </motion.div>
  )
}
