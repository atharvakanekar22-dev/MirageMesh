import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowRight } from 'lucide-react'
import type { Incident } from '@/types/incident'
import { SeverityIndicator } from '@/components/data-display/SeverityIndicator'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import { EmptyState } from '@/components/data-display/EmptyState'
import { formatRelativeTime } from '@/lib/utils'

interface RecentIncidentsListProps {
  incidents: Incident[]
}

export const RecentIncidentsList: React.FC<RecentIncidentsListProps> = ({ incidents }) => {
  const navigate = useNavigate()

  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Zero Active Security Incidents"
        description="No suspicious decoy interactions have triggered correlated threat incidents. Staged decoys remain uncompromised."
        indicatorText="Decoy Integrity Verified"
        actionLabel="Review Staged Decoys"
        onAction={() => navigate('/decoys')}
      />
    )
  }

  return (
    <div className="space-y-2.5">
      {incidents.slice(0, 4).map((inc) => (
        <div
          key={inc.id}
          onClick={() => navigate('/incidents')}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E5E9E5] hover:border-[#D1D8D2] hover:bg-[#FAFBF9] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-[#E8F2EC] border border-[#C8DFD4] shrink-0 font-mono">
              <span className="text-[9px] text-[#176B4D] font-bold">RISK</span>
              <span className="text-xs font-bold text-[#176B4D] tabular-nums">
                {inc.riskScore}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#176B4D]">
                  {inc.id}
                </span>
                <SeverityIndicator severity={inc.severity} />
                <StatusBadge status={inc.status} />
              </div>
              <p className="text-xs text-[#17251F] font-medium truncate mt-1">
                {inc.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-2">
            <span className="text-[11px] font-mono text-[#77847C] hidden sm:inline">
              {formatRelativeTime(inc.updatedAt)}
            </span>
            <div className="h-7 w-7 rounded-full flex items-center justify-center border border-[#E5E9E5] group-hover:bg-[#176B4D] group-hover:text-white group-hover:border-[#176B4D] transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
