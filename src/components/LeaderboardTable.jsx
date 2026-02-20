import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { cn } from '../utils/cn'
import { buildWAUrl } from '../utils/whatsapp'

export default function LeaderboardTable({ students, currentUser, adminMode, maxScore }) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-slate-700/40 mx-4">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800/60 grid grid-cols-[2.5rem_2.5rem_1fr_auto_auto] gap-3 items-center">
        <span className="text-xs font-orbitron text-slate-600 text-center">#</span>
        <span />
        <span className="text-xs font-orbitron text-slate-600 text-right">סוכן</span>
        <span className="text-xs font-orbitron text-slate-600 text-left hidden sm:block">שבוע</span>
        <span className="text-xs font-orbitron text-slate-600 text-left">ניקוד</span>
      </div>

      <div className="divide-y divide-slate-800/40">
        <AnimatePresence initial={false}>
          {students.map((student, i) => {
            const isMe = student.name === currentUser?.name
            const pct = maxScore > 0 ? (student.score / maxScore) * 100 : 0
            const hasPhone = Boolean(student.phone)

            return (
              <motion.div
                key={student.name}
                layout
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, delay: i * 0.025 }}
                className={cn(
                  'px-4 py-3 grid grid-cols-[2.5rem_2.5rem_1fr_auto_auto] gap-3 items-center',
                  'hover:bg-white/2 transition-colors',
                  isMe && 'rank-highlight',
                )}
              >
                {/* Rank */}
                <span className={cn(
                  'text-sm font-orbitron font-bold text-center tabular-nums',
                  isMe ? 'text-cyan-400' : 'text-slate-600',
                )}>
                  #{student.rank}
                </span>

                {/* Emoji */}
                <motion.span
                  className="text-2xl text-center block select-none cursor-default"
                  whileHover={{ scale: 1.4, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {student.emoji}
                </motion.span>

                {/* Name + WA icon + progress + badges */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={cn(
                      'text-sm font-medium truncate',
                      isMe ? 'text-cyan-300' : 'text-slate-300',
                    )}>
                      {adminMode ? student.name : student.animalName}
                    </span>

                    {/* WhatsApp icon — admin only, student must have a phone */}
                    {adminMode && hasPhone && (
                      <motion.a
                        href={buildWAUrl(student.phone, student.name, student.score)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        title={`שלח WhatsApp ל-${student.name} · ${student.phone}`}
                        className="shrink-0 text-emerald-600 hover:text-emerald-400 transition-colors"
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageSquare size={13} />
                      </motion.a>
                    )}

                    {isMe && (
                      <span className="text-xs bg-cyan-500/15 border border-cyan-400/20 text-cyan-400 rounded-full px-1.5 py-0.5 shrink-0">
                        אתה
                      </span>
                    )}

                    {/* Badges */}
                    {student.badges?.map((b, bi) => (
                      <motion.span
                        key={bi}
                        title={b.label}
                        className="text-sm shrink-0 cursor-default"
                        animate={b.icon === '👑' ? { rotate: [0, -8, 8, 0] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
                      >
                        {b.icon}
                      </motion.span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        isMe
                          ? 'bg-gradient-to-l from-cyan-400 to-violet-500'
                          : 'bg-slate-700',
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.025, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Weekly */}
                <span className="text-xs font-mono text-slate-600 text-left hidden sm:block tabular-nums">
                  {student.weeklyScore > 0 ? `+${student.weeklyScore}` : '—'}
                </span>

                {/* Total score */}
                <span className={cn(
                  'font-orbitron font-bold text-sm text-left tabular-nums',
                  isMe ? 'text-cyan-300' : 'text-slate-300',
                )}>
                  {student.score.toLocaleString()}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
