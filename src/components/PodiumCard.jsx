import { motion } from 'framer-motion'
import Tooltip from './Tooltip'

const RANK_CONFIG = {
  1: {
    height: 'h-48',
    gradient: 'from-yellow-400/20 via-amber-500/10 to-transparent',
    border: 'border-yellow-400/50',
    glow: 'glow-gold',
    text: 'text-yellow-300',
    podiumBg: 'bg-yellow-400/10',
    medal: '🥇',
    scale: 1.05,
    delay: 0.1,
    podiumHeight: 'h-24',
  },
  2: {
    height: 'h-40',
    gradient: 'from-slate-400/15 via-slate-500/8 to-transparent',
    border: 'border-slate-400/40',
    glow: '',
    text: 'text-slate-300',
    podiumBg: 'bg-slate-400/10',
    medal: '🥈',
    scale: 1,
    delay: 0.2,
    podiumHeight: 'h-16',
  },
  3: {
    height: 'h-36',
    gradient: 'from-amber-700/15 via-amber-800/8 to-transparent',
    border: 'border-amber-700/40',
    glow: '',
    text: 'text-amber-500',
    podiumBg: 'bg-amber-700/10',
    medal: '🥉',
    scale: 1,
    delay: 0.3,
    podiumHeight: 'h-12',
  },
}

export default function PodiumCard({ student, adminMode, onScoreEdit }) {
  const cfg = RANK_CONFIG[student.rank] || RANK_CONFIG[3]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: cfg.delay, ease: 'easeOut' }}
      className="flex flex-col items-center"
      style={{ order: student.rank === 1 ? 0 : student.rank === 2 ? -1 : 1 }}
    >
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          relative glass rounded-2xl p-5 w-44 text-center
          bg-gradient-to-b ${cfg.gradient}
          border ${cfg.border}
          ${student.rank === 1 ? cfg.glow : ''}
          ${student.isWeeklyChampion ? 'ring-2 ring-yellow-400/60' : ''}
        `}
      >
        {/* Weekly champion crown */}
        {student.isWeeklyChampion && (
          <motion.div
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            👑
          </motion.div>
        )}

        {/* Rank badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-sm font-bold font-orbitron">
          {cfg.medal}
        </div>

        {/* Animal emoji */}
        <Tooltip comments={student.comments}>
          <motion.div
            className="text-5xl mb-2 cursor-help select-none"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5 + student.rank * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {student.emoji}
          </motion.div>
        </Tooltip>

        {/* Name / Code */}
        <p className={`font-orbitron font-bold text-sm tracking-wide ${cfg.text}`}>
          {adminMode ? student.name : student.codeName}
        </p>

        {/* Score */}
        <div className="mt-2">
          {adminMode ? (
            <input
              type="number"
              value={student.score}
              onChange={(e) => onScoreEdit(student.id, parseFloat(e.target.value) || 0)}
              className="w-20 text-center bg-white/5 border border-cyan-400/20 rounded-lg text-lg font-bold font-orbitron text-cyan-300 focus:outline-none focus:border-cyan-400/60 p-1"
            />
          ) : (
            <motion.p
              key={student.score}
              initial={{ scale: 1.2, color: '#00f5ff' }}
              animate={{ scale: 1, color: '#67e8f9' }}
              className={`text-2xl font-orbitron font-black ${cfg.text}`}
            >
              {student.score.toLocaleString()}
            </motion.p>
          )}
          <p className="text-xs text-slate-500 mt-0.5">points</p>
        </div>

        {/* Comments indicator */}
        {student.comments.length > 0 && (
          <div className="mt-2 flex justify-center gap-1">
            {student.comments.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-cyan-400/60" />
            ))}
          </div>
        )}
      </motion.div>

      {/* Podium base */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: cfg.delay + 0.3 }}
        style={{ transformOrigin: 'bottom' }}
        className={`w-44 ${cfg.podiumHeight} ${cfg.podiumBg} border-x border-b ${cfg.border} rounded-b-xl flex items-end justify-center pb-2`}
      >
        <span className="font-orbitron font-black text-2xl text-white/20">
          #{student.rank}
        </span>
      </motion.div>
    </motion.div>
  )
}
