import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboardData } from './hooks/useLeaderboardData'
import LoadingScreen from './components/LoadingScreen'
import LoginScreen from './components/LoginScreen'
import Sidebar from './components/Sidebar'
import ParticleBackground from './components/ParticleBackground'
import PersonalDashboard from './components/PersonalDashboard'
import PublicLeaderboard from './components/PublicLeaderboard'
import AdminModal from './components/AdminModal'
import ForumPage from './components/pages/ForumPage'
import LogisticsPage from './components/pages/LogisticsPage'
import MissionsPage from './components/pages/MissionsPage'
import WhatsAppDashboard from './components/pages/WhatsAppDashboard'
import OKRPage from './components/pages/OKRPage'

// ─── constants ────────────────────────────────────────────────────────────────
const ADMIN_CODE     = '7'
const ADMIN_EMAIL    = 'eliavgil@gmail.com'
const ADMIN_PASSWORD = '1234'

const TEACHER_USER = {
  name: 'Teacher',
  emoji: '👨‍🏫',
  animalName: 'Teacher',
  id: '',
  email: ADMIN_EMAIL,
  phone: '',
  score: 0,
  rank: 0,
  weeklyScore: 0,
  isWeeklyChampion: false,
  taskBreakdown: [],
  badges: [],
}

// ─── page transition ───────────────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

// ─── component ────────────────────────────────────────────────────────────────
export default function App() {
  const { students, loading, error, lastUpdated, refetch, authenticate } =
    useLeaderboardData()

  const [user, setUser]               = useState(null)
  const [loginError, setLoginError]   = useState('')
  const [page, setPage]               = useState('dashboard')
  const [adminMode, setAdminMode]     = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  // ── auth ──────────────────────────────────────────────────────────────────
  const handleLogin = (identifier) => {
    const isAdminCode  = identifier.trim() === ADMIN_CODE
    const isAdminEmail =
      identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()

    if (isAdminCode || isAdminEmail) {
      setUser(TEACHER_USER)
      setAdminMode(true)
      setLoginError('')
      return
    }

    const found = authenticate(identifier)

    if (found) {
      setUser(found)
      if (found.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setAdminMode(true)
      }
      setLoginError('')
    } else {
      setLoginError('פרטים שגויים. נסה תעודת זהות או אימייל.')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setPage('dashboard')
    setAdminMode(false)
    setLoginError('')
  }

  // ── admin ─────────────────────────────────────────────────────────────────
  const handleAdminClick = () => {
    if (adminMode) { setAdminMode(false); return }
    setShowAdminModal(true)
  }

  const handleAdminSubmit = (password) => {
    if (password === ADMIN_PASSWORD) {
      setAdminMode(true)
      setShowAdminModal(false)
      return null
    }
    return 'סיסמה שגויה'
  }

  // ── render ────────────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <ParticleBackground />
      <div className="relative glass rounded-2xl p-8 text-center max-w-sm border border-rose-500/20">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-rose-400 font-bold mb-2">שגיאה בטעינת הנתונים</p>
        <p className="text-slate-500 text-sm mb-6">{error}</p>
        <button onClick={refetch} className="btn-primary">נסה שוב</button>
      </div>
    </div>
  )

  if (!user) return (
    <LoginScreen onLogin={handleLogin} error={loginError} />
  )

  return (
    <div className="min-h-screen bg-slate-950" style={{ direction: 'ltr' }}>
      <ParticleBackground />

      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        adminMode={adminMode}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
        onRefresh={refetch}
        lastUpdated={lastUpdated}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />

      {/* Main content — margin tracks sidebar width */}
      <motion.main
        className="min-h-screen overflow-x-hidden relative z-10"
        animate={{ marginLeft: sidebarExpanded ? 220 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {page === 'dashboard'   && (
              <PersonalDashboard user={user} students={students} adminMode={adminMode} />
            )}
            {page === 'leaderboard' && (
              <PublicLeaderboard students={students} currentUser={user} adminMode={adminMode} />
            )}
            {page === 'missions'    && (
              <MissionsPage user={user} students={students} />
            )}
            {page === 'okr'         && (
              <OKRPage adminMode={adminMode} />
            )}
            {page === 'forum'       && (
              <ForumPage user={user} />
            )}
            {page === 'logistics'   && (
              <LogisticsPage adminMode={adminMode} />
            )}
            {page === 'whatsapp'    && (
              <WhatsAppDashboard students={students} adminMode={adminMode} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSubmit={handleAdminSubmit}
      />
    </div>
  )
}
