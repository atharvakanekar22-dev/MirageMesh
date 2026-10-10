import React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  badge?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#17251F]">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-[#77847C] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  )
}
