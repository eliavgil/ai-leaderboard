import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Link, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'

function isUrl(str) {
  try { return Boolean(new URL(str)) } catch { return false }
}

function timeAgo(date) {
  const diff = (Date.now() - date) / 1000
  if (diff < 60) return 'עכשיו'
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דקות`
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שעות`
  return date.toLocaleDateString('he-IL')
}

const SEED_POSTS = [
  {
    id: 1,
    author: 'Lion',
    emoji: '🦁',
    content: 'מצאתי מאמר מעולה על Prompt Engineering — ממליץ לכולם!',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isLink: false,
  },
  {
    id: 2,
    author: 'Fox',
    emoji: '🦊',
    content: 'https://arxiv.org/abs/2201.11903',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isLink: true,
  },
]

export default function ForumPage({ user }) {
  const [posts, setPosts] = useState(SEED_POSTS)
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handlePost = () => {
    const text = input.trim()
    if (!text) return
    setSubmitting(true)
    setTimeout(() => {
      setPosts(prev => [
        {
          id: Date.now(),
          author: user.animalName,
          emoji: user.emoji,
          content: text,
          timestamp: new Date(),
          isLink: isUrl(text),
        },
        ...prev,
      ])
      setInput('')
      setSubmitting(false)
    }, 300)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>💬</span> פורום הקהילה
        </h1>
        <p className="text-slate-500 text-sm mt-1">שתפו קישורים, שאלות ורעיונות</p>
      </motion.div>

      {/* Compose */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 border border-slate-700/40 mb-6"
      >
        <div className="flex gap-3">
          <span className="text-2xl shrink-0 mt-0.5">{user.emoji}</span>
          <div className="flex-1">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePost() }}
              placeholder="כתוב משהו... (Ctrl+Enter לשליחה)"
              rows={2}
              className="w-full bg-transparent resize-none text-slate-200 placeholder-slate-600 text-sm
                         focus:outline-none border-b border-slate-700/40 pb-2 mb-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">
                {isUrl(input.trim()) && <span className="flex items-center gap-1 text-cyan-500"><Link size={11} /> קישור</span>}
                {!isUrl(input.trim()) && input.trim() && <span className="flex items-center gap-1"><FileText size={11} /> טקסט</span>}
              </span>
              <motion.button
                onClick={handlePost}
                disabled={!input.trim() || submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium
                           bg-cyan-500/20 border border-cyan-400/30 text-cyan-300
                           hover:bg-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all"
              >
                <Send size={13} />
                <span>פרסם</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {posts.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="glass-sm rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/40 transition-colors"
            >
              <div className="flex gap-3">
                <span className="text-xl shrink-0">{post.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-300">{post.author}</span>
                    <span className="text-xs text-slate-600">{timeAgo(post.timestamp)}</span>
                    {post.isLink && (
                      <span className="text-xs bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Link size={10} /> קישור
                      </span>
                    )}
                  </div>

                  {post.isLink ? (
                    <a
                      href={post.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 underline break-all transition-colors"
                    >
                      {post.content}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 text-slate-600">
          <p className="text-3xl mb-3">💬</p>
          <p>אין פוסטים עדיין. היה הראשון!</p>
        </div>
      )}
    </div>
  )
}
