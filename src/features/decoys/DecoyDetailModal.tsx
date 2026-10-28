import React from 'react'
import { Check, Copy, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import type { Decoy } from '@/types/decoy'
import { formatDate } from '@/lib/utils'

interface DecoyDetailModalProps {
  decoy: Decoy | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: Decoy['status']) => void
  onTriggerCanary?: (id: string) => Promise<any>
}

const typeLabels: Record<Decoy['type'], string> = {
  credential: 'Credential',
  database_record: 'Database record',
  api_endpoint: 'API resource',
  package_identifier: 'Package identifier',
}

export const DecoyDetailModal: React.FC<DecoyDetailModalProps> = ({
  decoy,
  isOpen,
  onClose,
  onDelete,
  onToggleStatus,
  onTriggerCanary,
}) => {
  const [copied, setCopied] = React.useState(false)
  const [isTriggering, setIsTriggering] = React.useState(false)
  const [triggerFeedback, setTriggerFeedback] = React.useState<string | null>(null)

  if (!decoy) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decoy.syntheticValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setTriggerFeedback('Could not copy the synthetic value.')
      window.setTimeout(() => setTriggerFeedback(null), 3000)
    }
  }

  const handleTestProbe = async () => {
    if (!onTriggerCanary) return
    setIsTriggering(true)
    setTriggerFeedback(null)
    try {
      const result = await onTriggerCanary(decoy.id)
      setTriggerFeedback(`Test complete. Event ${result.event.id} was recorded.`)
    } catch (error) {
      setTriggerFeedback(error instanceof Error ? error.message : 'Test failed. Please try again.')
    } finally {
      setIsTriggering(false)
      window.setTimeout(() => setTriggerFeedback(null), 4000)
    }
  }

  const nextStatus: Decoy['status'] = decoy.status === 'active' ? 'staged' : 'active'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={decoy.name}
      description="Decoy details"
      maxWidth="md"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => {
              onDelete(decoy.id)
              onClose()
            }}
          >
            Retire
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {onTriggerCanary && (
              <Button variant="primary" size="sm" isLoading={isTriggering} onClick={handleTestProbe}>
                Test decoy
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleStatus(decoy.id, nextStatus)}
            >
              {decoy.status === 'active' ? 'Pause' : 'Activate'}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {triggerFeedback && (
          <p
            role="status"
            className="rounded-md border border-[#c7d5eb] bg-[#f3f6fb] px-3 py-2 text-xs font-medium text-[#315f9f]"
          >
            {triggerFeedback}
          </p>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border border-[#e5e9e5] bg-[#f8fafc] p-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#77847c]">Type</p>
            <p className="mt-1 text-sm font-medium text-[#17251f]">{typeLabels[decoy.type]}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#77847c]">Status</p>
            <div className="mt-1">
              <StatusBadge status={decoy.status} />
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#77847c]">Tests</p>
            <p className="mt-1 text-sm font-medium tabular-nums text-[#17251f]">{decoy.triggerCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#77847c]">Created</p>
            <p className="mt-1 text-xs text-[#667085]">{formatDate(decoy.createdAt)}</p>
          </div>
        </div>

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#17251f]">Synthetic value</h3>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#315f9f] hover:text-[#234779] focus-ring"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="rounded-lg border border-[#e5e9e5] bg-[#f8fafc] p-3 font-mono text-xs leading-relaxed text-[#315f9f] break-all">
            {decoy.syntheticValue}
          </div>
          <p className="text-xs text-[#667085]">Use this made-up value when placing the decoy in a test environment.</p>
        </section>

        {decoy.metadata && (
          <section className="space-y-2 border-t border-[#e5e9e5] pt-4">
            <h3 className="text-sm font-semibold text-[#17251f]">Placement</h3>
            <p className="text-xs text-[#667085]">
              Environment: <span className="font-medium capitalize text-[#17251f]">{decoy.metadata.environment}</span>
            </p>
            {decoy.metadata.description && (
              <p className="text-xs leading-relaxed text-[#667085]">{decoy.metadata.description}</p>
            )}
          </section>
        )}
      </div>
    </Modal>
  )
}
