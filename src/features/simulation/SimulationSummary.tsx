import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { SimulationStatus, SimulationRunSummary } from '@/hooks/useSimulation'
import { formatDate } from '@/lib/utils'

interface SimulationSummaryProps {
  status: SimulationStatus
  startedAt?: string | null
  completedAt?: string | null
  eventCount: number
  summary?: SimulationRunSummary | null
}

function StatusIcon({ status }: { status: SimulationStatus }) {
  if (status === 'completed') return <CheckCircle className="h-4 w-4 text-[#267B58]" />
  if (status === 'failed') return <XCircle className="h-4 w-4 text-[#C74646]" />
  if (status === 'stopped') return <AlertTriangle className="h-4 w-4 text-[#C47B24]" />
  if (status === 'running') return <Clock className="h-4 w-4 text-[#C47B24] animate-spin" />
  return <div className="h-4 w-4 rounded-full border-2 border-[#D1D8D2]" />
}

function statusLabel(status: SimulationStatus): string {
  switch (status) {
    case 'completed': return 'Completed'
    case 'failed': return 'Failed'
    case 'stopped': return 'Stopped'
    case 'running': return 'Running'
    default: return 'Idle'
  }
}

function statusColor(status: SimulationStatus): string {
  switch (status) {
    case 'completed': return 'text-[#267B58]'
    case 'failed': return 'text-[#C74646]'
    case 'stopped': return 'text-[#C47B24]'
    case 'running': return 'text-[#C47B24]'
    default: return 'text-[#77847C]'
  }
}

function scenarioLabel(scenario: string): string {
  switch (scenario) {
    case 'single_trigger': return 'Single Canary Trigger'
    case 'repeated_access': return 'Repeated Access Probe'
    case 'multi_enumeration': return 'Multi-Decoy Enumeration'
    default: return scenario.replace(/_/g, ' ')
  }
}

export const SimulationSummary: React.FC<SimulationSummaryProps> = ({
  status,
  startedAt,
  completedAt,
  eventCount,
  summary,
}) => {
  const navigate = useNavigate()
  const [showDetail, setShowDetail] = useState(false)

  const isPartial = summary && summary.failureCount > 0 && summary.successCount > 0
  const isAllFailed = summary && summary.failureCount === summary.totalSteps && summary.successCount === 0

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3.5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E5]">
        <div>
          <h3 className="text-xs font-semibold text-[#17251F]">Simulation Report</h3>
          <p className="text-[11px] text-[#77847C]">Execution result and detection outcome</p>
        </div>
        {summary?.resultingIncidentId && (
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1 text-xs text-[#176B4D] hover:underline font-semibold focus-ring"
          >
            <span>View Incident</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status overview row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Execution</span>
          <div className={`font-semibold mt-0.5 flex items-center gap-1.5 ${statusColor(status)}`}>
            <StatusIcon status={status} />
            <span>{statusLabel(status)}</span>
          </div>
          {(completedAt || startedAt) && (
            <div className="flex items-center gap-1 text-[10px] text-[#77847C] mt-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span>{formatDate(completedAt || startedAt || '')}</span>
            </div>
          )}
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Steps</span>
          <div className="font-semibold font-mono text-[#17251F] mt-0.5 tabular-nums">
            {summary ? `${summary.successCount} / ${summary.totalSteps} ok` : '— / —'}
          </div>
          {isPartial && (
            <div className="text-[10px] text-[#C47B24] font-medium mt-0.5">Partial</div>
          )}
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Events Generated</span>
          <div className="font-semibold font-mono text-[#176B4D] mt-0.5 tabular-nums">
            {eventCount} logged
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
          <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Risk Score</span>
          <div className="font-bold font-mono text-[#17251F] mt-0.5 tabular-nums">
            {summary?.resultingRiskScore ? (
              <span className="text-[#176B4D]">{summary.resultingRiskScore} / 100</span>
            ) : (
              <span className="text-[#9BA69F]">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Scenario outcome card — only when we have a summary */}
      {summary && (
        <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
          isAllFailed
            ? 'bg-[#FDF2F2] border-[#F7D4D4]'
            : isPartial
            ? 'bg-[#FFFBEB] border-[#FDE68A]'
            : 'bg-[#E8F2EC]/40 border-[#C8DFD4]'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-[#17251F] flex items-center gap-1.5">
              {isAllFailed ? (
                <XCircle className="h-3.5 w-3.5 text-[#C74646]" />
              ) : isPartial ? (
                <AlertTriangle className="h-3.5 w-3.5 text-[#C47B24]" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-[#176B4D]" />
              )}
              {scenarioLabel(summary.scenario)}
            </span>
            {summary.resultingIncidentId && (
              <span className="font-mono text-[11px] text-[#176B4D] font-bold bg-white px-2 py-0.5 rounded-full border border-[#C8DFD4]">
                Incident: {summary.resultingIncidentId}
              </span>
            )}
          </div>

          {/* Semantic distinctions */}
          <div className="space-y-1 text-[11px] text-[#77847C]">
            <div>
              <span className="font-medium text-[#17251F]">Execution status: </span>
              {isAllFailed
                ? 'All probe steps failed — no canary events were recorded.'
                : isPartial
                ? `${summary.successCount} of ${summary.totalSteps} steps completed. ${summary.failureCount} step(s) failed.`
                : `All ${summary.totalSteps} step(s) completed successfully.`
              }
            </div>
            {eventCount > 0 && (
              <div>
                <span className="font-medium text-[#17251F]">Detection outcome: </span>
                {summary.resultingIncidentId
                  ? 'Canary trips were correlated into an incident record by the detection engine.'
                  : `${eventCount} telemetry event(s) generated. No incident was correlated at this risk threshold.`
                }
              </div>
            )}
            <div className="text-[10px] pt-1 border-t border-current/10">
              Note: A successfully executed simulation does not imply a real attack was detected. This is a controlled test against application-owned endpoints only.
            </div>
          </div>

          {/* Expandable duration detail */}
          <button
            type="button"
            onClick={() => setShowDetail(!showDetail)}
            className="flex items-center gap-1 text-[10px] text-[#77847C] hover:text-[#17251F] transition-colors focus-ring"
          >
            {showDetail ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span>{showDetail ? 'Hide' : 'Show'} timing details</span>
          </button>
          {showDetail && (
            <div className="text-[10px] font-mono text-[#77847C] space-y-0.5 pt-1">
              {startedAt && <div>Started: {formatDate(summary.startedAt)}</div>}
              {completedAt && <div>Completed: {formatDate(summary.completedAt)}</div>}
              {summary.affectedDecoyIds.length > 0 && (
                <div>Affected decoys: {summary.affectedDecoyIds.join(', ')}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Idle state */}
      {status === 'idle' && !summary && (
        <div className="text-[11px] text-[#77847C] leading-relaxed pt-1">
          Configure a scenario and click "Run Scenario" to execute a controlled simulation against your staged decoys.
        </div>
      )}
    </div>
  )
}
