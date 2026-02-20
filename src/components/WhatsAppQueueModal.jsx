import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, SkipForward, CheckCircle, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react'
import { buildWAUrl, DEFAULT_TEMPLATE } from '../utils/whatsapp'
import { cn } from '../utils/cn'

/**
 * WhatsApp Queue Modal
 * Shows selected students one at a time.
 * Clicking "Send" opens wa.me in a new tab and advances to the next student.
 */
export default function WhatsAppQueueModal({ isOpen, onClose, students }) {
  const [idx, setIdx]         = useState(0)
  const [sentSet, setSentSet] = useState(new Set())
  const [customMessage, setCustomMessage] = useState('')

  // Reset when modal opens with a new queue
  useEffect(() => {
    if (isOpen) { setIdx(0); setSentSet(new Set()); setCustomMessage('') }
  }, [isOpen])

  if (!isOpen || !students.length) return null

  const current   = students[idx]
  const total     = students.length
  const sentCount = sentSet.size
  const allDone   = sentCount === total

  const markSent = () => setSentSet(prev => new Set([...prev, current.name]))

  const goNext = () => {
    if (idx < total - 1) setIdx(i => i + 1)
  }

  const goPrev = () => {
    if (idx > 0) setIdx(i => i - 1)
  }

  const handleSend = () => {
    const url = buildWAUrl(current.phone, current.name, current.score, customMessage.trim() || undefined)
    window.open(url, '_blank', 'noopener,noreferrer')
    markSent()
    // Auto-advance to next student after a brief moment
    if (idx < total - 1) {
      setTimeout(() => setIdx(i => i + 1), 600)
    }
  }

  const handleSkip = () => {
    goNext()
  }

  const isSent = sentSet.has(current.name)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-md"
              dir="rtl"
              onClick={e => e.stopPropagation()}
            >
              <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-400" />
                    <span className="font-semibold text-slate-200">תור WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-mono">
                      {idx + 1} / {total}
                    </span>
                    <button
                      onClick={onClose}
                      className="text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 px-5 pt-4 pb-2 flex-wrap">
                  {students.map((s, i) => (
                    <button
                      key={s.name}
                      onClick={() => setIdx(i)}
                      title={s.name}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all duration-200',
                        i === idx
                          ? 'w-5 bg-emerald-400'
                          : sentSet.has(s.name)
                            ? 'bg-emerald-600'
                            : 'bg-slate-700 hover:bg-slate-500',
                      )}
                    />
                  ))}
                </div>

                {/* Current student card */}
                <div className="px-5 py-4">
                  {allDone ? (
                    /* ── All done state ── */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="text-5xl mb-3">🎉</div>
                      <p className="font-semibold text-emerald-400 text-lg mb-1">הכל נשלח!</p>
                      <p className="text-slate-500 text-sm">
                        נשלחו {sentCount} הודעות ל-{total} סטודנטים
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Student info */}
                        <div className={cn(
                          'rounded-xl p-4 mb-4 border transition-colors',
                          isSent
                            ? 'bg-emerald-500/8 border-emerald-400/25'
                            : 'bg-slate-800/60 border-slate-700/40',
                        )}>
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{current.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-100">{current.name}</p>
                                {isSent && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                                    <CheckCircle size={12} /> נשלח
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{current.phone}</p>
                              <p className="text-xs text-cyan-400 mt-0.5 font-semibold">
                                ⭐ {(current.score ?? 0).toLocaleString()} נקודות · דירוג #{current.rank}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Custom message input */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Edit3 size={12} className="text-slate-500" />
                            <p className="text-xs text-slate-500">הודעה (השאר ריק להודעה ברירת מחדל)</p>
                          </div>
                          <textarea
                            value={customMessage}
                            onChange={e => setCustomMessage(e.target.value)}
                            placeholder={DEFAULT_TEMPLATE
                              .replace(/\{name\}/g, current.name)
                              .replace(/\{score\}/g, (current.score ?? 0).toLocaleString())}
                            rows={3}
                            className="w-full bg-slate-800/60 border border-slate-700/40 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-400/40 resize-none leading-relaxed"
                          />
                        </div>

                        {/* Message preview */}
                        <div className="bg-slate-800/40 rounded-xl px-4 py-3 mb-4 border border-slate-700/30">
                          <p className="text-xs text-slate-500 mb-1">תצוגה מקדימה</p>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {customMessage.trim()
                              ? customMessage.trim()
                              : DEFAULT_TEMPLATE
                                  .replace(/\{name\}/g, current.name)
                                  .replace(/\{score\}/g, (current.score ?? 0).toLocaleString())}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                          {/* Skip */}
                          <button
                            onClick={handleSkip}
                            disabled={idx === total - 1}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                                       text-slate-500 hover:text-slate-300 hover:bg-white/5
                                       disabled:opacity-30 disabled:cursor-not-allowed
                                       border border-slate-700/40 transition-all"
                          >
                            <SkipForward size={14} />
                            <span>דלג</span>
                          </button>

                          {/* Send — button instead of <a> to avoid new tab */}
                          <button
                            onClick={handleSend}
                            className={cn(
                              'flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl',
                              'text-sm font-semibold text-center transition-all',
                              isSent
                                ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25'
                                : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/60',
                            )}
                          >
                            <MessageSquare size={14} />
                            <span>שלח ל-{current.name}</span>
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer: navigation + sent summary */}
                <div className="px-5 py-3 border-t border-slate-800/60 flex items-center justify-between">
                  {/* Prev / Next navigation */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={goPrev}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                    <button
                      onClick={goNext}
                      disabled={idx === total - 1}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>
                  </div>

                  {/* Sent count */}
                  {sentCount > 0 && (
                    <p className="text-xs text-slate-600">
                      ✓ נשלח:{' '}
                      <span className="text-emerald-500 font-medium">
                        {[...sentSet].join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
