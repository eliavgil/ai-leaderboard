import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PodiumSection from './PodiumSection'
import LeaderboardTable from './LeaderboardTable'

export default function PublicLeaderboard({ students, currentUser, adminMode }) {
  const [search, setSearch] = useState('')

  const top3 = students.slice(0, 3)
  const rest = students.slice(3)
  const maxScore = students[0]?.score || 1

  const filtered = rest.filter(s => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      s.name.toLowerCase().includes(q) ||
      s.animalName.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-3xl mx-auto py-8" dir="rtl">

      {/* Podium */}
      {top3.length > 0 && (
        <PodiumSection top3={top3} currentUser={currentUser} adminMode={adminMode} />
      )}

      {/* Search */}
      {rest.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 mb-3"
        >
          <div className="relative">
            <Search
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={adminMode ? 'חיפוש לפי שם...' : 'חיפוש לפי שם קוד...'}
              className="w-full bg-slate-900/60 border border-slate-700/40 rounded-xl
                         pr-9 pl-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
                         focus:outline-none focus:border-cyan-400/40 transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-xs font-orbitron tracking-[0.3em] uppercase text-slate-600 px-5 mb-3">
            דירוגים
          </p>
          <LeaderboardTable
            students={filtered}
            currentUser={currentUser}
            adminMode={adminMode}
            maxScore={maxScore}
          />
        </motion.div>
      )}

      {/* Empty state */}
      {search && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-600 text-sm">
          לא נמצאו סוכנים עבור "{search}"
        </div>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-slate-700 text-xs font-mono mt-8 px-4"
      >
        {students.length} סוכנים · נתונים מתרעננים כל 5 דקות
        {adminMode && ' · מצב מנהל פעיל'}
      </motion.p>
    </div>
  )
}
