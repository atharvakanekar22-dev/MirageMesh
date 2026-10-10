import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ContainmentActionType } from '@/types/response'
import type { Incident } from '@/types/incident'

interface ContainmentActionModalProps {
  isOpen: boolean
  onClose: () => void
  incidentId: string
  onExecute: (
    incidentId: string,
    actionType: ContainmentActionType,
    targetEntity: string,
    reason: string,
    operator: string,
    newIncidentStatus?: Incident['status']
  ) => Promise<any>
  isExecuting: boolean
}

export const ContainmentActionModal: React.FC<ContainmentActionModalProps> = ({
  isOpen,
  onClose,
  incidentId,
  onExecute,
  isExecuting,
}) => {
  const [actionType, setActionType] = useState<ContainmentActionType>('isolate_session')
  const [targetEntity, setTargetEntity] = useState('')
  const [reason, setReason] = useState('')
  const [operator, setOperator] = useState('SecOps-Operator')
  const [incidentStatusTransition, setIncidentStatusTransition] = useState<string>('investigating')
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')

  const actionOptions: { value: ContainmentActionType; label: string }[] = [
    { value: 'isolate_session', label: 'Simulate Ingress Session Isolation' },
    { value: 'revoke_synthetic_credential', label: 'Simulate Synthetic Decoy Credential Rotation' },
    { value: 'mark_decoy_compromised', label: 'Retire Tripped Synthetic Canary Decoy' },
    { value: 'throttle_source', label: 'Simulate Source IP Gateway Rate-Limiting' },
    { value: 'notify_soc_team', label: 'Notify & Escalate to SOC Incident Commander' },
  ]

  const statusOptions = [
    { value: 'none', label: 'Do Not Change Incident Status' },
    { value: 'investigating', label: 'Transition Incident to "Under Investigation"' },
    { value: 'contained', label: 'Transition Incident to "Contained"' },
    { value: 'resolved', label: 'Resolve Incident (Post-Investigation Close)' },
  ]

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetEntity.trim()) {
      setError('Target entity is required (e.g. source IP, session token, or decoy ID).')
      return
    }
    if (!operator.trim()) {
      setError('Operator identifier is required.')
      return
    }
    if (!reason || reason.trim().length < 10) {
      setError('Audit reason must be at least 10 characters long.')
      return
    }
    setError('')
    setIsConfirming(true)
  }

  const handleFinalConfirm = async () => {
    setError('')
    try {
      const statusToApply =
        incidentStatusTransition !== 'none'
          ? (incidentStatusTransition as Incident['status'])
          : undefined

      await onExecute(
        incidentId,
        actionType,
        targetEntity,
        reason,
        operator,
        statusToApply
      )
      setIsConfirming(false)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to record containment action')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsConfirming(false)
        onClose()
      }}
      title={isConfirming ? 'Operator Confirmation Required' : 'Stage Controlled Containment Action'}
      description={`Defensive response workflow for incident ${incidentId}.`}
      maxWidth="md"
    >
      {isConfirming ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#176B4D] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Review Defensive Intervention Parameters</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-[#77847C]">Action Type: </span>
                <span className="font-semibold text-[#17251F] capitalize">{actionType.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[#77847C]">Target Asset: </span>
                <span className="font-mono text-[#17251F]">{targetEntity}</span>
              </div>
              <div>
                <span className="text-[#77847C]">Operator: </span>
                <span className="font-mono text-[#17251F]">{operator}</span>
              </div>
              <div>
                <span className="text-[#77847C]">Status Transition: </span>
                <span className="font-semibold text-[#176B4D]">{incidentStatusTransition}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E9E5]">
              <span className="text-[#77847C]">Justification: </span>
              <p className="text-[#17251F] italic mt-0.5">{reason}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-[#FCE6C9] text-xs text-[#C47B24] flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Simulated Containment Guarantee: </strong>
              This action will be committed to the backend audit ledger. No real network drops,
              firewall mutations, or production credential modifications will occur.
            </span>
          </div>

          {error && <p className="text-xs text-[#C74646] font-medium">{error}</p>}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E9E5]">
            <Button
              variant="outline"
              size="sm"
              disabled={isExecuting}
              onClick={() => setIsConfirming(false)}
            >
              Back to Edit
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isExecuting}
              leftIcon={<CheckCircle className="h-3.5 w-3.5" />}
              onClick={handleFinalConfirm}
            >
              Confirm & Commit Action
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStageSubmit} className="space-y-4">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#E8F2EC] border border-[#C8DFD4] text-xs text-[#176B4D]">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold">Simulated Response Protocol: </span>
              Mitigations are recorded into the persistent backend containment audit ledger with zero production impact.
            </div>
          </div>

          <Select
            label="Containment Action Type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value as ContainmentActionType)}
            options={actionOptions}
          />

          <Select
            label="Incident Status Transition"
            value={incidentStatusTransition}
            onChange={(e) => setIncidentStatusTransition(e.target.value)}
            options={statusOptions}
            helperText="Optionally update the lifecycle state of the incident upon containment execution"
          />

          <Input
            label="Target Entity / Asset"
            value={targetEntity}
            onChange={(e) => setTargetEntity(e.target.value)}
            placeholder="e.g. Session Token, Probe IP, or Decoy ID"
            helperText="The specific synthetic credential or network session object being contained"
          />

          <Input
            label="Operator / Analyst Handle"
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            placeholder="e.g. SecOps-Analyst-01"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#17251F]">
              Audit Justification & Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-[#E5E9E5] bg-white p-3 text-xs text-[#17251F] placeholder-[#9BA69F] focus-ring focus:border-[#176B4D] shadow-2xs"
              placeholder="Explain why this containment action is required..."
            />
            {error && <p className="text-xs text-[#C74646]">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E5E9E5]">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Proceed to Confirmation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
