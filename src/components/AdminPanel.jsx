import { motion, AnimatePresence } from 'framer-motion'

export default function AdminPanel({ adminMode, setAdminMode, onReset }) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAdminMode(v => !v)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron text-xs font-semibold
          transition-all duration-300 border
          ${adminMode
            ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 glow-purple'
            : 'glass border-slate-600/40 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300'
          }
        `}
      >
        <span>{adminMode ? '🔓' : '🔒'}</span>
        <span>{adminMode ? 'Admin ON' : 'Admin'}</span>
      </motion.button>

      <AnimatePresence>
        {adminMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-orbitron text-xs font-semibold glass border border-red-500/40 text-red-400 hover:border-red-400/60"
          >
            <span>↺</span>
            <span>Reset</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
