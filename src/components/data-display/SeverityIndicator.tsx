import React from 'react'
import type { SeverityLevel } from '@/types/event'
import { cn } from '@/lib/utils'

export interface SeverityIndicatorProps {
  severity: SeverityLevel
  showLabel?: boolean
  className?: string
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  showLabel = true,
  className,
}) => {
  const configs: Record<
    SeverityLevel,
    { label: string; dotClass: string; badgeClass: string }
  > = {
    critical: {
      label: 'Critical',
      dotClass: 'bg-[#C74646]',
      badgeClass: 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]',
    },
    high: {
      label: 'High',
      dotClass: 'bg-[#C47B24]',
      badgeClass: 'bg-[#FFF8EE] text-[#C47B24] border-[#FCE6C9]',
    },
    medium: {
      label: 'Medium',
      dotClass: 'bg-[#A8861B]',
      badgeClass: 'bg-[#FEFCE8] text-[#A8861B] border-[#FEF08A]',
    },
    low: {
      label: 'Low',
      dotClass: 'bg-[#176B4D]',
      badgeClass: 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4]',
    },
  }

  const config = configs[severity]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border select-none',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
