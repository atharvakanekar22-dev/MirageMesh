import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'flat'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-white border border-[#E5E9E5] shadow-[0_1px_2px_rgba(16,24,40,0.04)] rounded-lg',
      secondary: 'bg-[#FAFBF9] border border-[#E5E9E5] rounded-lg',
      flat: 'bg-transparent border border-[#E5E9E5] rounded-lg',
    }

    return (
      <div
        ref={ref}
        className={cn('p-5 transition-colors', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex items-center justify-between pb-3 border-b border-[#E5E9E5] mb-4', className)} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-sm font-semibold text-[#17251F] tracking-tight', className)} {...props}>
    {children}
  </h3>
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-[#77847C]', className)} {...props}>
    {children}
  </p>
)
