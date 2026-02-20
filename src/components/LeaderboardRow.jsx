import { motion } from 'framer-motion'
import Tooltip from './Tooltip'
import Sparkline from './Sparkline'

const RANK_CLASSES = {
  1: 'rank-1',
  2: 'rank-2',
  3: 'rank-3',
}

export default function LeaderboardRow({ student, index, adminMode, onScoreEdit }) {
  const rankClass = RANK_CLASSES[student.rank] || ''

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ scale: 1.005, x: 2 }}
      className={`
        glass ${rankClass} rounded-xl transition-all duration-200
        ${student.isWeeklyChampion ? 'ring-1 ring-yellow-400/40' : ''}
        group cursor-default
      `}
    >
      {/* Rank */}
      <td className="px-4 py-3 text-left w-12">
        <span className="font-orbitron font-bold text-slate-400 text-sm">
          {student.rank <= 3
            ? ['🥇', '🥈', '🥉'][student.rank - 1]
            : `#${student.rank}`}
        </span>
      </td>

      {/* Animal */}
      <td className="px-3 py-3 w-14">
        <Tooltip comments={student.comments}>
          <motion.span
            className="text-2xl cursor-help select-none inline-block"
            whileHover={{ scale: 1.3, rotate: [-5, 5, -5, 0] }}
            transition={{ duration: 0.4 }}
          >
            {student.emoji}
          </motion.span>
        </Tooltip>
      </td>

      {/* Name */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-200 text-sm">
            {adminMode ? student.name : student.codeName}
          </span>
          {student.isWeeklyChampion && (
            <motion.span
              title="Weekly Champion"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className="text-sm"
            >
              👑
            </motion.span>
          )}
          {student.comments.length > 0 && (
            <span className="text-xs text-cyan-400/60">💬</span>
          )}
        </div>
      </td>

      {/* Sparkline */}
      <td className="px-3 py-3 hidden md:table-cell">
        <Sparkline data={student.taskScores} />
      </td>

      {/* Score */}
      <td className="px-4 py-3 text-right w-28">
        {adminMode ? (
          <input
            type="number"
            value={student.score}
            onChange={(e) => onScoreEdit(student.id, parseFloat(e.target.value) || 0)}
            className="w-20 text-right bg-white/5 border border-cyan-400/20 rounded-lg text-sm font-bold font-orbitron text-cyan-300 focus:outline-none focus:border-cyan-400/60 p-1"
          />
        ) : (
          <motion.span
            key={student.score}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className={`font-orbitron font-bold text-sm ${
              student.rank === 1
                ? 'text-yellow-300 neon-gold-text'
                : student.rank <= 3
                  ? 'text-cyan-300'
                  : 'text-slate-300'
            }`}
          >
            {student.score.toLocaleString()}
          </motion.span>
        )}
      </td>

      {/* Weekly score */}
      <td className="px-4 py-3 text-right w-24 hidden sm:table-cell">
        <span className="text-xs text-slate-500 font-mono">
          {student.weeklyScore > 0 ? `+${student.weeklyScore}` : '—'}
        </span>
      </td>
    </motion.tr>
  )
}
