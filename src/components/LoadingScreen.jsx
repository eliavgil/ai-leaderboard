import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex flex-col items-center justify-center gap-6">
      {/* Ambient glows */}
      <div className="fixed top-1/3 left-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-violet-500 glow-cyan" />
        <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
      </motion.div>

      <div className="text-center">
        <motion.p
          className="font-orbitron text-cyan-300 text-sm tracking-[0.35em] uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          טוען נתונים
        </motion.p>
        <p className="text-slate-600 text-xs mt-2">מחבר לגיליון האלקטרוני...</p>
      </div>
    </div>
  )
}
