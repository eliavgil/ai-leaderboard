import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Trophy, Target, MessageCircle,
  Calendar, MessageSquare, LogOut, Shield, RefreshCw,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '../utils/cn'

const NAV = [
  { id: 'dashboard',  label: 'לוח אישי',          icon: LayoutDashboard },
  { id: 'leaderboard',label: 'טבלת ניקוד',         icon: Trophy          },
  { id: 'missions',   label: 'משימות',              icon: Target          },
  { id: 'forum',      label: 'פורום',               icon: MessageCircle   },
  { id: 'logistics',  label: 'לו"ז ולוגיסטיקה',    icon: Calendar        },
]

const ADMIN_NAV = { id: 'whatsapp', label: 'WhatsApp Bulk', icon: MessageSquare }

export default function Sidebar({
  page, setPage, user, adminMode, onAdminClick, onLogout, onRefresh, lastUpdated,
  expanded, setExpanded,
}) {
  const W = expanded ? 220 : 64

  const items = adminMode ? [...NAV, ADMIN_NAV] : NAV

  return (
    <motion.aside
      animate={{ width: W }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed top-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden"
      style={{
        direction: 'ltr',
        background: 'rgba(2,6,23,0.9)',
        borderRight: '1px solid rgba(51,65,85,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <span className="text-2xl shrink-0">🤖</span>
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="font-orbitron font-black text-sm text-cyan-400 neon-text whitespace-nowrap"
            >
              AI Arena
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="ml-auto text-slate-600 hover:text-slate-300 transition-colors shrink-0"
        >
          {expanded ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 flex flex-col gap-1 px-2 overflow-y-auto">
        {items.map(item => {
          const active = page === item.id
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              title={!expanded ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group relative',
                active
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/25'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5',
                item.id === 'whatsapp' && 'text-emerald-500 hover:text-emerald-300',
                active && item.id === 'whatsapp' && 'bg-emerald-500/10 border-emerald-400/25 text-emerald-300',
              )}
            >
              <item.icon size={16} className="shrink-0" />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap"
                    style={{ direction: 'rtl' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active pill */}
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-full"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-800/60 p-2 space-y-1">
        {/* Live indicator */}
        {lastUpdated && expanded && (
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs text-slate-600 font-mono">
              {lastUpdated.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {/* Refresh */}
        <SideBtn icon={RefreshCw} label="רענן" expanded={expanded} onClick={onRefresh} />

        {/* Admin toggle */}
        <SideBtn
          icon={Shield}
          label={adminMode ? 'כבה Admin' : 'מצב Admin'}
          expanded={expanded}
          onClick={onAdminClick}
          className={adminMode
            ? 'text-violet-400 bg-violet-500/10 border border-violet-400/20'
            : ''}
        />

        {/* User + logout */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          expanded ? 'justify-between' : 'justify-center',
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0">{user.emoji}</span>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-slate-400 truncate font-medium"
                  style={{ direction: 'rtl' }}
                >
                  {adminMode ? user.name : user.animalName}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={onLogout}
            title="התנתק"
            className="text-slate-600 hover:text-rose-400 transition-colors shrink-0"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

function SideBtn({ icon: Icon, label, expanded, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all',
        className,
      )}
    >
      <Icon size={15} className="shrink-0" />
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap text-xs"
            style={{ direction: 'rtl' }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
