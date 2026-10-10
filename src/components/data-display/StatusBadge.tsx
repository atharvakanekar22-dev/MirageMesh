import React from 'react'
import type { DecoyStatus } from '@/types/decoy'
import type { IncidentStatus } from '@/types/incident'
import type { ContainmentStatus } from '@/types/response'
import { cn } from '@/lib/utils'

export type AnyStatus = DecoyStatus | IncidentStatus | ContainmentStatus

export interface StatusBadgeProps {
  status: AnyStatus
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const configs: Record<
    string,
    { label: string; dotClass: string; badgeClass: string }
  > = {
    // Decoy statuses
    draft: {
      label: 'Draft',
      dotClass: 'bg-[#9BA69F]',
      badgeClass: 'bg-[#F3F6F3] text-[#77847C] border-[#E5E9E5]',
    },
    staged: {
      label: 'Staged',
      dotClass: 'bg-[#176B4D]',
      badgeClass: 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4]',
    },
    active: {
      label: 'Active',
      dotClass: 'bg-[#267B58]',
      badgeClass: 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]',
    },
    triggered: {
      label: 'Triggered',
      dotClass: 'bg-[#C74646]',
      badgeClass: 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]',
    },
    retired: {
      label: 'Retired',
      dotClass: 'bg-[#9BA69F]',
      badgeClass: 'bg-[#F3F6F3] text-[#9BA69F] border-[#E5E9E5]',
    },

    // Incident statuses
    open: {
      label: 'Open',
      dotClass: 'bg-[#C74646]',
      badgeClass: 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]',
    },
    investigating: {
      label: 'Investigating',
      dotClass: 'bg-[#C47B24]',
      badgeClass: 'bg-[#FFF8EE] text-[#C47B24] border-[#FCE6C9]',
    },
    contained: {
      label: 'Contained',
      dotClass: 'bg-[#176B4D]',
      badgeClass: 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4]',
    },
    resolved: {
      label: 'Resolved',
      dotClass: 'bg-[#267B58]',
      badgeClass: 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]',
    },
    dismissed: {
      label: 'Dismissed',
      dotClass: 'bg-[#77847C]',
      badgeClass: 'bg-[#F3F6F3] text-[#77847C] border-[#E5E9E5]',
    },

    // Containment statuses
    pending: {
      label: 'Pending',
      dotClass: 'bg-[#C47B24]',
      badgeClass: 'bg-[#FFF8EE] text-[#C47B24] border-[#FCE6C9]',
    },
    executing: {
      label: 'Executing',
      dotClass: 'bg-[#176B4D]',
      badgeClass: 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4]',
    },
    completed: {
      label: 'Completed',
      dotClass: 'bg-[#267B58]',
      badgeClass: 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]',
    },
    failed: {
      label: 'Failed',
      dotClass: 'bg-[#C74646]',
      badgeClass: 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]',
    },
    cancelled: {
      label: 'Cancelled',
      dotClass: 'bg-[#77847C]',
      badgeClass: 'bg-[#F3F6F3] text-[#77847C] border-[#E5E9E5]',
    },
  }

  const config = configs[status] || {
    label: status,
    dotClass: 'bg-[#77847C]',
    badgeClass: 'bg-[#F3F6F3] text-[#77847C] border-[#E5E9E5]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border select-none',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      <span>{config.label}</span>
    </span>
  )
}
