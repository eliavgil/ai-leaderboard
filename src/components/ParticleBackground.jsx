import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      color: i % 4 === 0 ? '#8b5cf6' : '#22d3ee', // mix cyan + violet
    })),
  [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Radial gradient center glow */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 0.55, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-cyan-400/8 rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-violet-400/8 rounded-tl-full" />
    </div>
  )
}
