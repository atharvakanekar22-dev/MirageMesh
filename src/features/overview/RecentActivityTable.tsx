import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Radio } from 'lucide-react'
import type { SecurityEvent } from '@/types/event'
import { SeverityIndicator } from '@/components/data-display/SeverityIndicator'
import { EmptyState } from '@/components/data-display/EmptyState'
import { formatDate } from '@/lib/utils'

interface RecentActivityTableProps {
  events: SecurityEvent[]
  onViewSimulation?: () => void
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  events,
  onViewSimulation,
}) => {
  const navigate = useNavigate()

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title="No activity yet"
        description="Run a simulation or place a decoy to start seeing activity here."
        indicatorText="Monitoring is ready"
        actionLabel="Run a simulation"
        onAction={() => {
          if (onViewSimulation) onViewSimulation()
          else navigate('/simulation')
        }}
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E5E9E5] bg-white shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#E5E9E5] bg-[#FAFBF9] text-[#77847C]">
            <th className="py-3 px-4 font-semibold font-mono">Event ID</th>
            <th className="py-3 px-4 font-semibold">Event Type</th>
            <th className="py-3 px-4 font-semibold">Decoy Resource</th>
            <th className="py-3 px-4 font-semibold">Severity</th>
            <th className="py-3 px-4 font-semibold">Timestamp</th>
            <th className="py-3 px-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E9E5] text-[#17251F]">
          {events.map((evt) => (
            <tr key={evt.id} className="hover:bg-[#FAFBF9] transition-colors">
              <td className="py-3 px-4 font-mono font-medium text-[#176B4D]">{evt.id}</td>
              <td className="py-3 px-4">
                <span className="capitalize font-medium">{evt.eventType.replace(/_/g, ' ')}</span>
                {evt.simulation && (
                  <span className="ml-2 px-1.5 py-0.2 rounded-md text-[10px] bg-[#E8F2EC] text-[#176B4D] font-mono">
                    sim
                  </span>
                )}
              </td>
              <td className="py-3 px-4 font-mono text-[#77847C]">
                {evt.decoyId || 'Unassociated probe'}
              </td>
              <td className="py-3 px-4">
                <SeverityIndicator severity={evt.severity} />
              </td>
              <td className="py-3 px-4 font-mono text-[#77847C]">
                {formatDate(evt.timestamp)}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  type="button"
                  onClick={() => navigate('/incidents')}
                  className="inline-flex items-center gap-1 text-xs text-[#176B4D] hover:text-[#104B37] font-semibold transition-colors focus-ring"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
