import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  Mail,
  Shield,
  ExternalLink,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useSettings } from '@/hooks/useSettings'

interface TopbarProps {
  onOpenMobileSidebar: () => void
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Derive avatar initials from operator handle (up to 2 chars)
  const initials = settings.operatorHandle
    .split(/[-_\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'OP'

  const searchTargets = [
    { title: 'Overview Dashboard', path: '/overview', desc: 'Security metrics and telemetry distribution' },
    { title: 'AI Decoy Lab', path: '/decoys', desc: 'Generate and manage synthetic canaries' },
    { title: 'Attack Simulation', path: '/simulation', desc: 'Trigger controlled threat scenarios' },
    { title: 'Incident Investigation', path: '/incidents', desc: 'Investigate correlated security events' },
    { title: 'Response Centre', path: '/response', desc: 'Execute controlled containment workflows' },
    { title: 'System Settings', path: '/settings', desc: 'Workspace preferences and node configuration' },
  ]

  const filteredSearch = searchTargets.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <header className="flex h-[64px] w-full items-center justify-between border-b border-[var(--border-default)] bg-white px-4 sm:px-8 shrink-0">
        {/* Left: Mobile trigger & Search bar pill */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#77847C] hover:bg-[#F3F6F3] hover:text-[#17251F] md:hidden focus-ring"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Reference pill search bar */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-full max-w-sm h-9 px-3 rounded-md bg-[#F8FAFC] border border-[#E5E9E5] text-xs text-[#9BA69F] hover:border-[#D1D8D2] hover:bg-white transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#77847C] group-hover:text-[#17251F]" />
              <span className="truncate">Search decoy or incident...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[#F3F6F3] border border-[#E5E9E5] text-[10px] font-mono text-[#77847C]">
              /
            </kbd>
          </div>
        </div>

        {/* Right: Notification controls and User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Messages icon button */}
          <button
            type="button"
            onClick={() => navigate('/response')}
            aria-label="Response workflows"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E5E9E5] bg-white text-[#77847C] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-colors focus-ring"
            title="Containment Queue"
          >
            <Mail className="h-4 w-4" />
          </button>

          {/* Notification Bell with Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="View notifications"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E5E9E5] bg-white text-[#77847C] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-colors focus-ring"
            >
              <Bell className="h-4 w-4" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#E5E9E5] bg-white p-4 shadow-xl z-50 animate-in fade-in-50">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E9E5]">
                  <span className="text-xs font-semibold text-[#17251F]">Workspace Alerts</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#176B4D]">
                    0 unread
                  </span>
                </div>
                <div className="py-6 text-center">
                  <Shield className="h-6 w-6 text-[#176B4D] mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-medium text-[#17251F]">All sensors nominal</p>
                  <p className="text-[11px] text-[#77847C] mt-0.5">
                    No active threat trips detected on staged canaries.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Operator session capsule */}
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-md hover:bg-[#F3F6F3] transition-colors cursor-pointer select-none border border-[#E5E9E5]/60"
            title={`Workspace: ${settings.workspaceName} — Operator: ${settings.operatorHandle}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F2EC] border border-[#C8DFD4] text-[#176B4D] font-bold text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-xs font-semibold text-[#17251F] leading-tight max-w-[120px] truncate">
                {settings.workspaceName}
              </span>
              <span className="text-[10px] text-[#77847C] leading-tight flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#176B4D]" />
                {settings.operatorHandle}
              </span>

            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false)
          setSearchQuery('')
        }}
        title="Search MirageMesh"
        description="Quick navigation across decoys, attack simulations, and incidents."
        maxWidth="md"
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#77847C]" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search views, simulation scenarios, or routes..."
              className="w-full rounded-xl border border-[#E5E9E5] bg-[#FAFBF9] pl-10 pr-3 py-2 text-xs text-[#17251F] placeholder-[#9BA69F] focus-ring focus:border-[#176B4D] focus:bg-white"
            />
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {filteredSearch.map((target) => (
              <button
                key={target.path}
                type="button"
                onClick={() => {
                  navigate(target.path)
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F6F3] text-left transition-colors group focus-ring"
              >
                <div>
                  <div className="text-xs font-semibold text-[#17251F] group-hover:text-[#176B4D]">
                    {target.title}
                  </div>
                  <div className="text-[11px] text-[#77847C]">{target.desc}</div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-[#77847C] group-hover:text-[#176B4D]" />
              </button>
            ))}
            {filteredSearch.length === 0 && (
              <div className="text-center py-6 text-xs text-[#77847C]">
                No matching platform resources found.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
