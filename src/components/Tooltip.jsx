import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Tooltip({ comments, children }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  if (!comments || comments.length === 0) return <>{children}</>

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMove}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: pos.x + 14,
              top: pos.y - 8,
              minWidth: '200px',
              maxWidth: '280px',
            }}
          >
            <div className="glass rounded-xl p-3 shadow-2xl border border-cyan-400/20">
              <p className="text-xs font-semibold text-cyan-300 mb-2 font-orbitron tracking-wide">
                Notes
              </p>
              {comments.map((c, i) => (
                <div key={i} className="mb-1 last:mb-0">
                  <span className="text-xs text-slate-400 font-medium">{c.task}: </span>
                  <span className="text-xs text-slate-200">{c.note}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
