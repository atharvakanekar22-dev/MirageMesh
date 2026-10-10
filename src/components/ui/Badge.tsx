import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-md border select-none'

  const variantStyles = {
    neutral: 'bg-[#F3F6F3] text-[#77847C] border-[#E5E9E5]',
    accent: 'bg-[#E8F2EC] text-[#176B4D] border-[#C8DFD4]',
    success: 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]',
    warning: 'bg-[#FFF8EE] text-[#C47B24] border-[#FCE6C9]',
    danger: 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]',
    outline: 'bg-transparent text-[#77847C] border-[#E5E9E5]',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 leading-none gap-1',
    md: 'text-xs px-2.5 py-1 leading-normal gap-1.5',
  }

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </span>
  )
}
