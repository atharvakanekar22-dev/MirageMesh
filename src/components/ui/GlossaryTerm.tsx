import React, { useRef, useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface GlossaryTermProps {
  term: string
  children: string
  className?: string
}

/** A brief, plain-language definition shown on hover, focus, or tap. */
export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ term, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = `glossary-${term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setIsOpen(true)
  }
  const hideSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setIsOpen(false), 1800)
  }

  return (
    <span className={`relative inline-flex align-baseline ${className}`} onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-label={`What does ${term} mean?`}
        aria-describedby={isOpen ? tooltipId : undefined}
        onFocus={show}
        onBlur={hideSoon}
        onClick={() => {
          show()
          hideSoon()
        }}
        className="inline-flex items-center gap-1 rounded-sm border-b border-dotted border-current/50 text-inherit cursor-help focus-ring"
      >
        {term}<HelpCircle aria-hidden="true" className="h-3 w-3 opacity-60" />
      </button>
      {isOpen && (
        <span id={tooltipId} role="tooltip" className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#C8DFD4] bg-white px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-[#17251F] shadow-lg">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#176B4D]">{term}</span>
          {children}
        </span>
      )}
    </span>
  )
}
