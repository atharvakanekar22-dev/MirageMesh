import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
  shortcut?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search task or decoy...',
  className,
  id = 'global-search',
  shortcut = '⌘F',
}) => {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#77847C] pointer-events-none" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-12 bg-[#FAFBF9] border border-[#E5E9E5] rounded-full text-xs text-[#17251F] placeholder-[#9BA69F] focus-ring focus:border-[#176B4D] focus:bg-white transition-all shadow-2xs"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 text-[#77847C] hover:text-[#17251F] rounded-full p-0.5 focus-ring"
          aria-label="Clear search input"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : shortcut ? (
        <div className="absolute right-3 pointer-events-none px-1.5 py-0.5 rounded-md bg-[#F3F6F3] border border-[#E5E9E5] text-[10px] font-mono text-[#77847C]">
          {shortcut}
        </div>
      ) : null}
    </div>
  )
}
