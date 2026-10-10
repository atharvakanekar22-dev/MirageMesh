import React from 'react'
import { Copy, Check, Terminal, Trash2 } from 'lucide-react'
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

  const handleCopy = () => {
    navigator.clipboard.writeText(decoy.syntheticValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestProbe = async () => {
    if (!onTriggerCanary) return
    setIsTriggering(true)
    setTriggerFeedback(null)
    try {
      const res = await onTriggerCanary(decoy.id)
      setTriggerFeedback(`Canary triggered! Security event ${res.event.id} generated.`)
      setTimeout(() => setTriggerFeedback(null), 4000)
    } catch (err: any) {
      setTriggerFeedback(err?.message || 'Trigger failed')
      setTimeout(() => setTriggerFeedback(null), 4000)
    } finally {
      setIsTriggering(false)
    }
  }

  const testCurlCommand =
    decoy.type === 'credential'
      ? `curl -H "Authorization: Bearer ${decoy.syntheticValue}" http://localhost:4000/api/internal/keys`
      : `curl http://localhost:4000/api/internal/resource/${decoy.id}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={decoy.name}
      description={`Decoy ID: ${decoy.id}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => {
              onDelete(decoy.id)
              onClose()
            }}
          >
            Retire Decoy
          </Button>
          <div className="flex items-center gap-2">
            {onTriggerCanary && (
              <Button
                variant="primary"
                size="sm"
                isLoading={isTriggering}
                onClick={handleTestProbe}
              >
                Test Canary Probe
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const nextStatus: Decoy['status'] =
                  decoy.status === 'active' ? 'staged' : 'active'
                onToggleStatus(decoy.id, nextStatus)
              }}
            >
              {decoy.status === 'active' ? 'Move to Staged' : 'Mark as Active'}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {triggerFeedback && (
          <div className="p-3 rounded-xl bg-[#E8F2EC] border border-[#C8DFD4] text-xs font-semibold text-[#176B4D]">
            {triggerFeedback}
          </div>
        )}

        {/* Status and Type Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <div>
            <div className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Resource Type</div>
            <div className="text-xs font-semibold text-[#17251F] capitalize mt-0.5">
              {decoy.type.replace(/_/g, ' ')}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Status</div>
            <div className="mt-0.5">
              <StatusBadge status={decoy.status} />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Triggers Logged</div>
            <div className="text-xs font-bold font-mono text-[#17251F] mt-0.5 tabular-nums">
              {decoy.triggerCount}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Created Date</div>
            <div className="text-[11px] font-mono text-[#77847C] mt-0.5">
              {formatDate(decoy.createdAt)}
            </div>
          </div>
        </div>

        {/* Synthetic Canary Value */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#17251F]">
            Synthetic Honeytoken Value (Zero-Privilege)
          </label>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] font-mono text-xs text-[#176B4D]">
            <span className="truncate pr-2 font-medium">{decoy.syntheticValue}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md text-[#77847C] hover:text-[#17251F] hover:bg-white transition-colors shrink-0 focus-ring shadow-2xs"
              aria-label="Copy synthetic value"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#267B58]" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Controlled Canary Test Command */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#17251F]">
              Controlled Canary Verification Command
            </label>
            <span className="text-[10px] font-mono text-[#176B4D] font-medium bg-[#E8F2EC] px-2 py-0.5 rounded-full">
              Live Gateway Bound
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] font-mono text-xs text-[#17251F] select-all break-all">
            <code>{testCurlCommand}</code>
          </div>
        </div>

        {/* Deployment Context */}
        {decoy.metadata && (
          <div className="rounded-2xl border border-[#E5E9E5] p-3.5 bg-white space-y-2 text-xs">
            <div className="text-xs font-semibold text-[#17251F]">Placement & Deployment Metadata</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#77847C]">Target Environment: </span>
                <span className="font-mono text-[#17251F] font-medium">{decoy.metadata.environment}</span>
              </div>
              {decoy.metadata.namingConvention && (
                <div>
                  <span className="text-[#77847C]">Naming Pattern: </span>
                  <span className="font-mono text-[#17251F] font-medium">{decoy.metadata.namingConvention}</span>
                </div>
              )}
            </div>
            {decoy.metadata.description && (
              <p className="text-[#77847C] text-xs pt-1.5 border-t border-[#E5E9E5]">
                {decoy.metadata.description}
              </p>
            )}
          </div>
        )}

        {/* Backend Note */}
        <div className="p-3 rounded-xl border border-[#C8DFD4] bg-[#E8F2EC] text-[11px] text-[#176B4D] flex items-center gap-2">
          <Terminal className="h-4 w-4 shrink-0" />
          <span>
            Connected to MirageMesh Telemetry Engine. Ingestion active at /api/internal/keys & /api/internal/resource/:id
          </span>
        </div>
      </div>
    </Modal>
  )
}
