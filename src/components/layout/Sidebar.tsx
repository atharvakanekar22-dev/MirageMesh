import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Cpu,
  Flame,
  ShieldAlert,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const mainNavItems: NavItem[] = [
  { name: 'Overview', to: '/overview', icon: LayoutDashboard },
  { name: 'AI Decoy Lab', to: '/decoys', icon: Cpu },
  { name: 'Attack Simulation', to: '/simulation', icon: Flame },
  { name: 'Incident Investigation', to: '/incidents', icon: ShieldAlert },
  { name: 'Response Centre', to: '/response', icon: Activity },
]

const generalNavItems: NavItem[] = [
  { name: 'Settings', to: '/settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#17251F]/30 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#263446] bg-[#182230] transition-all duration-200 ease-in-out md:static shrink-0 select-none',
          isCollapsed ? 'w-16' : 'w-56',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Geometric brand mark in forest green */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#176B4D] text-white shadow-xs">
              <svg className="h-4.5 w-4.5" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 5L26 10.8V21.2L16 27L6 21.2V10.8L16 5Z"
                  stroke="#E8F2EC"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 10.5L21.5 13.8V19.8L16 23L10.5 19.8V13.8L16 10.5Z"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-white">
                  MirageMesh
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none">
                  Security workspace
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors focus-ring"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 space-y-4 px-3 py-2 overflow-y-auto">
          {/* MENU section */}
          <div>
            {!isCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Menu
              </div>
            )}
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all focus-ring',
                        isActive
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Reference left green pill indicator */}
                        {isActive && !isCollapsed && (
                          <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-[#176B4D]" />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-200'
                          )}
                        />
                        {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
                        {!isCollapsed && item.badge && (
                          <span
                            className={cn(
                              'text-[10px] font-mono px-1.5 py-0.2 rounded-full tabular-nums',
                              isActive
                                ? 'bg-[#176B4D]/15 text-[#176B4D]'
                                : 'bg-[#E5E9E5]/60 text-[#77847C]'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* GENERAL section */}
          <div>
            {!isCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                General
              </div>
            )}
            <nav className="space-y-1">
              {generalNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all focus-ring',
                        isActive
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !isCollapsed && (
                          <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-[#176B4D]" />
                        )}
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-blue-300' : 'text-slate-500 group-hover:text-slate-200'
                          )}
                        />
                        {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Promoted Canary Card (Inspired by reference bottom app card) */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="relative overflow-hidden rounded-xl bg-[#234779] p-3.5 text-white shadow-xs">
              {/* Subtle background glow */}
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#176B4D]/60 blur-xl pointer-events-none" />

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#E8F2EC] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-[#267B58] animate-pulse" />
                <span>Canary Posture</span>
              </div>

              <div className="mt-1 text-xs font-semibold text-white">
                Staging Cluster Alpha
              </div>
              <p className="mt-0.5 text-[10px] text-white/70 leading-relaxed">
                Synthetic canary perimeter operational
              </p>

              <div className="mt-3">
                <NavLink
                  to="/decoys"
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 transition-colors focus-ring"
                >
                  <span>View Decoys</span>
                  <ArrowRight className="h-3 w-3" />
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
