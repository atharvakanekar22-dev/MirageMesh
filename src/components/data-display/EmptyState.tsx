import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  indicatorText?: string
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  indicatorText,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-[#E5E9E5] rounded-2xl bg-[#FAFBF9]',
        className
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C8DFD4] bg-[#E8F2EC] text-[#176B4D] mb-4 shadow-2xs">
          <Icon className="h-6 w-6 stroke-[1.75]" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#17251F] tracking-tight">{title}</h3>
      <p className="mt-1.5 text-xs text-[#77847C] max-w-md leading-relaxed">{description}</p>

      {indicatorText && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-[#77847C] bg-white px-3 py-1 rounded-full border border-[#E5E9E5] shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#176B4D]" />
          <span>{indicatorText}</span>
        </div>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex items-center gap-2.5">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl bg-[#176B4D] text-white hover:bg-[#104B37] transition-all focus-ring cursor-pointer shadow-2xs"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl bg-white text-[#17251F] border border-[#E5E9E5] hover:bg-[#F3F6F3] transition-all focus-ring cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
