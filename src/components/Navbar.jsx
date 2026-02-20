import { motion } from 'framer-motion'
import { LayoutDashboard, Trophy, Shield, LogOut, RefreshCw } from 'lucide-react'
import { cn } from '../utils/cn'

export default function Navbar({ user, tab, setTab, adminMode, onAdminClick, onLogout, onRefresh, lastUpdated }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60"
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🤖</span>
          <span className="font-orbitron font-black text-base text-cyan-400 neon-text hidden sm:block">
            AI Arena
          </span>
          {adminMode && (
            <span className="text-xs bg-violet-500/20 border border-violet-400/30 text-violet-300 rounded-full px-2 py-0.5 font-semibold">
              Admin
            </span>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 glass-sm rounded-xl p-1 shrink-0">
          <TabBtn
            active={tab === 'dashboard'}
            onClick={() => setTab('dashboard')}
            icon={<LayoutDashboard size={13} />}
            label="לוח אישי"
          />
          <TabBtn
            active={tab === 'leaderboard'}
            onClick={() => setTab('leaderboard')}
            icon={<Trophy size={13} />}
            label="דירוג"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Live indicator */}
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">{lastUpdated.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          <button onClick={onRefresh} title="רענן" className="btn-ghost p-2">
            <RefreshCw size={14} />
          </button>

          <button
            onClick={onAdminClick}
            title={adminMode ? 'כבה מצב מנהל' : 'מצב מנהל'}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              adminMode
                ? 'text-violet-400 bg-violet-500/15 border border-violet-400/25'
                : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
            )}
          >
            <Shield size={14} />
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 glass-sm rounded-xl mr-1">
            <span className="text-lg leading-none">{user.emoji}</span>
            <span className="text-xs text-slate-400 hidden sm:block font-medium">
              {adminMode ? user.name : user.animalName}
            </span>
          </div>

          <button onClick={onLogout} title="התנתק" className="p-2 rounded-lg text-slate-600 hover:text-rose-400 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
        active
          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
