import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { cn } from '../utils/cn'
import { buildWAUrl } from '../utils/whatsapp'

const PODIUM_CONFIG = {
  1: {
    order: 'order-2',
    cardClass: 'glow-gold border-amber-400/50',
    baseH: 'h-24',
    baseBg: 'bg-amber-400/8 border-amber-400/30',
    nameColor: 'text-amber-300 neon-gold-text',
    scoreColor: 'text-amber-200',
    medal: '🥇',
    cardPadding: 'pt-10 pb-6 px-5',
    delay: 0.05,
  },
  2: {
    order: 'order-1',
    cardClass: 'glow-silver border-slate-300/30',
    baseH: 'h-16',
    baseBg: 'bg-slate-400/6 border-slate-400/25',
    nameColor: 'text-slate-300',
    scoreColor: 'text-slate-200',
    medal: '🥈',
    cardPadding: 'pt-8 pb-5 px-5',
    delay: 0.15,
  },
  3: {
    order: 'order-3',
    cardClass: 'glow-bronze border-amber-700/35',
    baseH: 'h-12',
    baseBg: 'bg-amber-800/6 border-amber-700/25',
    nameColor: 'text-amber-600',
    scoreColor: 'text-amber-500',
    medal: '🥉',
    cardPadding: 'pt-8 pb-5 px-5',
    delay: 0.15,
  },
}

export default function PodiumSection({ top3, currentUser, adminMode }) {
  return (
    <div className="mb-12 px-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-xs text-slate-600 font-orbitron tracking-[0.4em] uppercase mb-8"
      >
        — Hall of Fame —
      </motion.p>

      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {top3.map(student => {
          const cfg = PODIUM_CONFIG[student.rank]
          const isCurrentUser = student.name === currentUser?.name

          return (
            <motion.div
              key={student.rank}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: cfg.delay, ease: [0.16, 1, 0.3, 1] }}
              className={cn('flex flex-col items-center', cfg.order)}
            >
              {/* Card */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative glass rounded-2xl text-center w-36 sm:w-40',
                  cfg.cardClass,
                  cfg.cardPadding,
                  isCurrentUser && 'ring-2 ring-cyan-400/50',
                )}
              >
                <div className="absolute -top-3 -left-3 text-xl">{cfg.medal}</div>

                {isCurrentUser && (
                  <div className="absolute -top-3 -right-3 text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-full px-2 py-0.5 font-semibold">
                    אתה
                  </div>
                )}

                {/* Weekly crown */}
                {student.isWeeklyChampion && (
                  <motion.div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    👑
                  </motion.div>
                )}

                {/* Emoji */}
                <motion.div
                  className="text-5xl mb-2 select-none"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5 + student.rank * 0.4, repeat: Infinity }}
                >
                  {student.emoji}
                </motion.div>

                {/* Name + WA icon */}
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <p className={cn('font-semibold text-xs truncate', cfg.nameColor)}>
                    {adminMode ? student.name : student.animalName}
                  </p>
                  {adminMode && student.phone && (
                    <a
                      href={buildWAUrl(student.phone, student.name, student.score)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      title={`WhatsApp ${student.name} · ${student.phone}`}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      <MessageSquare size={11} />
                    </a>
                  )}
                </div>

                {/* Badges row */}
                {student.badges?.length > 0 && (
                  <div className="flex justify-center gap-0.5 mb-1.5">
                    {student.badges.map((b, i) => (
                      <span key={i} title={b.label} className="text-sm">{b.icon}</span>
                    ))}
                  </div>
                )}

                {/* Score */}
                <p className={cn('font-orbitron font-black text-xl', cfg.scoreColor)}>
                  {student.score.toLocaleString()}
                </p>
                <p className="text-slate-600 text-xs">pts</p>
              </motion.div>

              {/* Base */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.45, delay: cfg.delay + 0.3 }}
                style={{ transformOrigin: 'bottom' }}
                className={cn(
                  'w-36 sm:w-40 border-x border-b rounded-b-xl flex items-center justify-center',
                  cfg.baseH, cfg.baseBg,
                )}
              >
                <span className="font-orbitron font-black text-3xl text-white/10">
                  {student.rank}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
