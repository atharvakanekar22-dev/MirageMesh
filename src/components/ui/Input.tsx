import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[#17251F]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 pointer-events-none text-[#77847C]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border border-[#E5E9E5] bg-white px-3.5 py-2 text-xs text-[#17251F] placeholder-[#9BA69F] transition-all focus-ring shadow-2xs',
              'hover:border-[#D1D8D2] focus:border-[#176B4D]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F3F6F3]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-[#C74646] focus:border-[#C74646]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 pointer-events-none text-[#77847C]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#C74646]">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#77847C]">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
