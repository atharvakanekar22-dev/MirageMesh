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
    <div className="min-h-screen bg-[#F1F2EF] p-2 sm:p-4 lg:p-6 flex flex-col justify-center items-center">
      {/* Outer Workspace Container with Rounded Corners (Reference Inspired) */}
      <div className="w-full max-w-[1540px] min-h-[94vh] bg-white rounded-2xl sm:rounded-3xl border border-[#E5E9E5] shadow-xs flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Right Content Workspace */}
        <div className="flex flex-1 flex-col min-w-0 bg-white">
          <Topbar onOpenMobileSidebar={() => setIsMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
