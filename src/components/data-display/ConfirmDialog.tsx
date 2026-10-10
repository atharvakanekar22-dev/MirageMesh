import React from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
  children?: React.ReactNode
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed ${
            isDangerous
              ? 'bg-[#FDF2F2] border-[#F7D4D4] text-[#C74646]'
              : 'bg-[#FFF8EE] border-[#FCE6C9] text-[#C47B24]'
          }`}
        >
          {isDangerous ? (
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-[#C74646]" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-[#C47B24]" />
          )}
          <div>{description}</div>
        </div>

        {children}
      </div>
    </Modal>
  )
}
