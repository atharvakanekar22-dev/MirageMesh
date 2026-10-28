import React, { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext, type ToastTone } from './toast-context-def'

interface Toast {
  id: number
  message: string
  tone: ToastTone
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4000)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? XCircle : Info
          const styles = toast.tone === 'success'
            ? 'border-[#c5e3d5] bg-[#eaf5f0] text-[#28785d]'
            : toast.tone === 'error'
              ? 'border-[#f7d4d4] bg-[#fdf2f2] text-[#c74646]'
              : 'border-[#c7d5eb] bg-[#f3f6fb] text-[#315f9f]'

          return (
            <div key={toast.id} role="status" className={`pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium shadow-lg ${styles}`}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="opacity-70 hover:opacity-100 focus-ring"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
