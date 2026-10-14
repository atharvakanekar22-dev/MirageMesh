import React from 'react'
import { cn } from '@/lib/utils'
import { GlossaryTerm } from '@/components/ui/GlossaryTerm'

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterBarProps {
  options: FilterOption[]
  activeFilter: string
  onChange: (filterId: string) => void
  className?: string
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  activeFilter,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      <span className="mr-1 text-xs text-[#77847C]"><GlossaryTerm term="Filter">A way to show only the items you want to look at, such as incidents with a certain status.</GlossaryTerm></span>
      {options.map((opt) => {
        const isActive = activeFilter === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border select-none cursor-pointer focus-ring shadow-2xs',
              isActive
                ? 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4] font-semibold'
                : 'bg-white text-[#77847C] border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F]'
            )}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full tabular-nums',
                  isActive ? 'bg-[#176B4D]/15 text-[#176B4D]' : 'bg-[#F3F6F3] text-[#77847C]'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
