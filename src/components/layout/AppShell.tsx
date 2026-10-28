import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export const AppShell: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('miragemesh_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('miragemesh_sidebar_collapsed', String(isCollapsed))
    } catch {
      // storage unavailable
    }
  }, [isCollapsed])

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="min-h-screen flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Right Content Workspace */}
        <div className="flex flex-1 flex-col min-w-0 bg-[var(--bg-canvas)]">
          <Topbar onOpenMobileSidebar={() => setIsMobileOpen(true)} />

          <main className="flex-1 px-4 py-7 sm:px-8 lg:px-12 overflow-y-auto bg-[var(--bg-canvas)]">
            <div className="mx-auto max-w-[1320px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
