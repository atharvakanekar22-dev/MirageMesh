import React from 'react'
import { Activity } from 'lucide-react'
import type { ContainmentAction } from '@/types/response'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import { EmptyState } from '@/components/data-display/EmptyState'
import { formatDate } from '@/lib/utils'

interface ResponseAuditTableProps {
  actions: ContainmentAction[]
  onOpenStageAction?: () => void
}

export const ResponseAuditTable: React.FC<ResponseAuditTableProps> = ({
  actions,
  onOpenStageAction,
}) => {
  if (actions.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="Zero Containment Actions Executed"
        description="The audit ledger is clean. No containment operations, IP throttles, or credential revocations have been dispatched."
        indicatorText="Audit Trail Verified (No Actions Recorded)"
        actionLabel={onOpenStageAction ? 'Stage First Action' : undefined}
        onAction={onOpenStageAction}
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E9E5] bg-white shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#E5E9E5] bg-[#FAFBF9] text-[#77847C]">
            <th className="py-3 px-4 font-semibold font-mono">Action ID</th>
            <th className="py-3 px-4 font-semibold">Incident</th>
            <th className="py-3 px-4 font-semibold">Action Type</th>
            <th className="py-3 px-4 font-semibold">Target Entity</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Operator</th>
            <th className="py-3 px-4 font-semibold">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9E5] text-[#17251F]">
          {actions.map((act) => (
            <tr key={act.id} className="hover:bg-[#FAFBF9] transition-colors">
              <td className="py-3 px-4 font-mono font-medium text-[#176B4D]">{act.id}</td>
              <td className="py-3 px-4 font-mono text-[#77847C]">{act.incidentId}</td>
              <td className="py-3 px-4 font-medium capitalize">
                {act.actionType.replace(/_/g, ' ')}
              </td>
              <td className="py-3 px-4 font-mono text-[#77847C]">
                {act.auditDetails.targetEntity}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={act.status} />
              </td>
              <td className="py-3 px-4 font-mono text-[#77847C]">
                {act.auditDetails.operator}
              </td>
              <td className="py-3 px-4 font-mono text-[#77847C]">
                {formatDate(act.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
