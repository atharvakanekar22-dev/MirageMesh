import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus-ring cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50'

    const variantStyles = {
      primary:
        'bg-[#176B4D] text-white font-medium hover:bg-[#104B37] active:bg-[#0C3829] shadow-sm rounded-lg',
      secondary:
        'bg-white text-[#17251F] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:border-[#D1D8D2] active:bg-[#E8F2EC] shadow-2xs rounded-lg',
      outline:
        'bg-transparent text-[#17251F] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:border-[#D1D8D2] rounded-lg',
      ghost:
        'bg-transparent text-[#77847C] hover:text-[#17251F] hover:bg-[#F3F6F3] active:bg-[#E8F2EC] rounded-lg',
      danger:
        'bg-[#FDF2F2] text-[#C74646] border border-[#F7D4D4] hover:bg-[#FCE6E6] active:bg-[#F7D4D4] rounded-lg',
    }

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-xs px-3.5 py-2 gap-2 h-9',
      lg: 'text-sm px-4.5 py-2.5 gap-2.5 h-10',
      icon: 'h-9 w-9 p-0 rounded-xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
