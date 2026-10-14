import React from 'react'
import { Radio, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react'
import type { SecurityEvent } from '@/types/event'
import type { SimulationStepRecord } from '@/hooks/useSimulation'
import { SeverityIndicator } from '@/components/data-display/SeverityIndicator'
import { EmptyState } from '@/components/data-display/EmptyState'
import { formatDate } from '@/lib/utils'

interface EventFeedProps {
  events: SecurityEvent[]
  steps?: SimulationStepRecord[]
  isExecuting: boolean
}

export const EventFeed: React.FC<EventFeedProps> = ({ events, steps = [], isExecuting }) => {
  if (events.length === 0 && steps.length === 0 && !isExecuting) {
    return (
      <EmptyState
        icon={Radio}
        title="Simulation Stream Idle"
        description="Select a controlled scenario and click 'Run Scenario' to dispatch real probes to application-owned canary routes."
        indicatorText="Controlled Test Harness Ready"
      />
    )
  }

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E9E5]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#17251F]">
            Controlled Scenario Execution Feed
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#176B4D] border border-[#C8DFD4]">
            {steps.length > 0 ? `${steps.filter((s) => s.status === 'success').length}/${steps.length} Steps Complete` : 'Ready'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#77847C]">
          Application-Owned Ingress
        </span>
      </div>

      {/* Sequential Steps Progress Card */}
      {steps.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-[#77847C] uppercase tracking-wider">
            Sequential Probe Execution Plan
          </div>
          <div className="space-y-2">
            {steps.map((st) => (
              <div
                key={st.stepIndex}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  st.status === 'running'
                    ? 'border-[#176B4D] bg-[#E8F2EC]/40 ring-1 ring-[#176B4D]'
                    : st.status === 'success'
                    ? 'border-[#C8DFD4] bg-[#FAFBF9]'
                    : st.status === 'failed'
                    ? 'border-[#F7D4D4] bg-[#FDF2F2]'
                    : 'border-[#E5E9E5] bg-white text-[#9BA69F]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {st.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-[#267B58] shrink-0" />
                    ) : st.status === 'failed' ? (
                      <XCircle className="h-4 w-4 text-[#C74646] shrink-0" />
                    ) : st.status === 'running' ? (
                      <Clock className="h-4 w-4 text-[#C47B24] animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-[#D1D8D2] shrink-0" />
                    )}
                    <span className="font-semibold text-[#17251F]">
                      Step {st.stepIndex}: {st.decoyName}
                    </span>
                    <span className="font-mono text-[11px] text-[#77847C]">({st.endpoint})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {st.riskScore !== undefined && (
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#E5E9E5] font-semibold text-[#176B4D]">
                        Risk: {st.riskScore}
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase text-[#77847C]">{st.status}</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#77847C] mt-1 pl-6">{st.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Events Stream */}
      {events.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#E5E9E5]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#77847C] uppercase tracking-wider">
              Backend Telemetry Records Generated ({events.length})
            </span>
            <span className="text-[10px] text-[#176B4D] font-mono">Live Ingestion Verified</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="rounded-xl border border-[#E5E9E5] bg-[#FAFBF9] p-3 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#176B4D]" />
                    <span className="font-mono font-semibold text-[#176B4D]">{evt.id}</span>
                    <span className="text-[#E5E9E5]">|</span>
                    <span className="text-[#17251F] font-medium capitalize">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-[#E8F2EC] text-[#176B4D] font-mono">
                      controlled-sim
                    </span>
                  </div>
                  <SeverityIndicator severity={evt.severity} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#77847C]">
                  <div>
                    <span>Target Decoy: </span>
                    <span className="text-[#17251F] font-semibold">{evt.decoyId || 'None'}</span>
                  </div>
                  <div>
                    <span>Source IP: </span>
                    <span className="text-[#17251F]">{evt.evidence?.sourceIP || '127.0.0.1'}</span>
                  </div>
                  <div>
                    <span>Path: </span>
                    <span className="text-[#17251F]">{evt.evidence?.pathOrKey || '/api/...'}</span>
                  </div>
                  <div>
                    <span>Time: </span>
                    <span>{formatDate(evt.timestamp)}</span>
                  </div>
                </div>

                {evt.evidence?.rawTelemetrySnippet && (
                  <details className="mt-1 group">
                    <summary className="text-[10px] text-[#77847C] hover:text-[#17251F] cursor-pointer font-medium focus-ring select-none">
                      Raw Event Details
                    </summary>
                    <div className="mt-1.5 rounded-lg bg-white p-2.5 border border-[#E5E9E5] font-mono text-[10px] text-[#17251F] overflow-x-auto whitespace-pre">
                      {evt.evidence.rawTelemetrySnippet}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
