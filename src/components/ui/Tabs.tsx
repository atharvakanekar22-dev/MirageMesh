import React from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  count?: number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center gap-1.5 border-b border-[#E5E9E5] pb-px', className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 text-xs font-medium border-b-2 -mb-px transition-colors focus-ring cursor-pointer select-none rounded-t-lg',
              isActive
                ? 'border-[#176B4D] text-[#176B4D] font-semibold'
                : 'border-transparent text-[#77847C] hover:text-[#17251F] hover:border-[#D1D8D2]',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums',
                  isActive
                    ? 'bg-[#E8F2EC] text-[#176B4D]'
                    : 'bg-[#F3F6F3] text-[#77847C] border border-[#E5E9E5]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
