import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'
import type { SimulationStatus, SimulationRunSummary } from '@/hooks/useSimulation'
import { formatDate } from '@/lib/utils'

interface SimulationSummaryProps {
  status: SimulationStatus
  startedAt?: string | null
  completedAt?: string | null
  eventCount: number
  summary?: SimulationRunSummary | null
}

export const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  status,
  startedAt,
  completedAt,
  eventCount,
  summary,
}) => {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E5]">
        <div>
          <h3 className="text-xs font-semibold text-[#17251F]">Scenario Run Summary</h3>
          <p className="text-[11px] text-[#77847C]">Deterministic execution ledger metrics</p>
        </div>
        {summary && summary.resultingIncidentId && (
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1 text-xs text-[#176B4D] hover:underline font-semibold focus-ring"
          >
            <span>View Incident Dossier</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Status</span>
          <div className="font-semibold text-[#17251F] capitalize mt-0.5">{status}</div>
          {(completedAt || startedAt) && (
            <div className="flex items-center gap-1 text-[10px] text-[#77847C] mt-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span>{formatDate(completedAt || startedAt || '')}</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Canary Trips</span>
          <div className="font-semibold font-mono text-[#176B4D] mt-0.5 tabular-nums">
            {eventCount} logged
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Success Rate</span>
          <div className="font-semibold font-mono text-[#17251F] mt-0.5 tabular-nums">
            {summary ? `${summary.successCount} / ${summary.totalSteps}` : '0 / 0'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Risk Score</span>
          <div className="font-bold font-mono text-[#17251F] mt-0.5 tabular-nums">
            {summary?.resultingRiskScore ? (
              <span className="text-[#176B4D]">{summary.resultingRiskScore} / 100</span>
            ) : (
              'Baseline'
            )}
          </div>
        </div>
      </div>

      {summary && (
        <div className="p-3.5 rounded-xl bg-[#E8F2EC]/40 border border-[#C8DFD4] text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#17251F] flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-[#176B4D]" />
              Scenario Completed: {summary.scenario.replace(/_/g, ' ')}
            </span>
            {summary.resultingIncidentId && (
              <span className="font-mono text-[11px] text-[#176B4D] font-bold">
                Incident: {summary.resultingIncidentId}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#77847C] leading-relaxed">
            All requests were dispatched sequentially against application-owned canary routes. Real telemetry records were ingested and correlated into incident risk evaluation.
          </div>
        </div>
      )}

      <div className="text-[11px] text-[#77847C] leading-relaxed pt-1">
        Controlled sandbox simulations verify that deception assets are correctly structured to trip canary triggers. No external network traffic is dispatched.
      </div>
    </div>
  )
}
