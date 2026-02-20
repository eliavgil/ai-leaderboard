import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, AlertCircle } from 'lucide-react'

export default function LoginScreen({ onLogin, error }) {
  const [value, setValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() || submitting) return
    setSubmitting(true)
    onLogin(value)
    // Reset submitting after a tick (parent may set error)
    setTimeout(() => setSubmitting(false), 400)
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed top-1/4 right-1/3 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-96 h-96 bg-violet-500/7 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl border border-slate-700/50">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.img
              src="/Logo_promptheus.png"
              alt="PromPtheus.Ai"
              className="h-20 w-auto object-contain mx-auto mb-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="text-slate-400 text-sm font-medium">
              לוח תוצאות מתקדם
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-700" />
            <span className="text-slate-600 text-xs">כניסה למערכת</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                תעודת זהות או אימייל
              </label>
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="הכנס ת.ז. או כתובת אימייל..."
                autoFocus
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3
                           text-white placeholder-slate-600 text-sm
                           focus:outline-none focus:border-cyan-400/50 focus:bg-slate-800/80
                           transition-all duration-200"
              />
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={!value.trim() || submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
                         bg-cyan-500/20 border border-cyan-400/40 text-cyan-300
                         hover:bg-cyan-500/30 hover:border-cyan-400/60
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 glow-cyan"
            >
              {submitting ? (
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-cyan-300/30 border-t-cyan-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <LogIn size={15} />
                  <span>כניסה</span>
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            בעיית כניסה? פנה למרצה
          </p>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-slate-700 text-xs mt-4 font-mono">
          AI Arena v2.0 · Powered by Anthropic Claude
        </p>
      </motion.div>
    </div>
  )
}
