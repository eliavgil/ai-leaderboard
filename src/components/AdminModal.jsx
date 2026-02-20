import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, Eye } from 'lucide-react'

export default function AdminModal({ isOpen, onClose, onSubmit }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = onSubmit(password)
    if (err) {
      setError(err)
      setPassword('')
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div
              className="glass rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-violet-500/20 pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-violet-400" />
                  <h2 className="font-semibold text-slate-200">כניסת מנהל</h2>
                </div>
                <button onClick={handleClose} className="text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="סיסמת מנהל..."
                    autoFocus
                    className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3
                               text-white placeholder-slate-600 text-sm pr-10
                               focus:outline-none focus:border-violet-400/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                  >
                    <Eye size={14} />
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 3, 0] }}
                      exit={{ opacity: 0 }}
                      className="text-rose-400 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={!password}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold
                             bg-violet-500/20 border border-violet-400/40 text-violet-300
                             hover:bg-violet-500/30 hover:border-violet-400/60
                             disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  כניסה
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
