import React, { useRef, useState } from 'react'

interface HoverTooltipProps {
  content: string
  children: React.ReactNode
}

/** Shows a compact hint on hover, then fades it out after a few seconds. */
export const HoverTooltip: React.FC<HoverTooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = React.useId()

  const show = () => {
    if (timer.current) clearTimeout(timer.current)
    setIsVisible(true)
    timer.current = setTimeout(() => setIsVisible(false), 3600)
  }

  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    setIsVisible(false)
  }

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <span aria-describedby={isVisible ? tooltipId : undefined}>{children}</span>
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#C8DFD4] bg-white px-3 py-2 text-left text-xs leading-relaxed text-[#17251F] shadow-lg animate-[hintFade_3.6s_ease-out_forwards]"
        >
          {content}
        </span>
      )}
      <style>{`@keyframes hintFade { 0%, 72% { opacity: 1; } 100% { opacity: 0; } }`}</style>
    </span>
  )
}
