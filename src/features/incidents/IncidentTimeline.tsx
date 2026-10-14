import React, { useState } from 'react'
import { CheckCircle2, HelpCircle, Activity, Globe, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export interface TimelineEventItem {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'canary_access' | 'probe' | 'analysis'
  isFact: boolean
  decoyId?: string
  method?: string
  path?: string
  sourceIp?: string
  matchedPattern?: string
  rawSnippet?: string
  riskContribution?: number
}

interface IncidentTimelineProps {
  events: TimelineEventItem[]
}

function RawSnippetToggle({ rawSnippet }: { rawSnippet: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[10px] text-[#77847C] hover:text-[#17251F] transition-colors focus-ring mt-1"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        <span>{open ? 'Hide' : 'Show'} raw telemetry</span>
      </button>
      {open && (
        <div className="mt-1.5 rounded-lg bg-white p-2.5 border border-[#E5E9E5] font-mono text-[10px] text-[#17251F] overflow-x-auto whitespace-pre">
          {rawSnippet}
        </div>
      )}
    </div>
  )
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-[#E5E9E5] bg-white text-center text-xs text-[#77847C] space-y-1">
        <Activity className="h-5 w-5 mx-auto text-[#9BA69F] mb-1" />
        <div className="font-semibold text-[#17251F]">No Events Recorded</div>
        <p>No telemetry records are associated with this incident.</p>
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E9E5]">
      {events.map((evt) => (
        <div key={evt.id} className="relative group">
          {/* Timeline dot */}
          <div
            className={`absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 ${
              evt.isFact ? 'border-[#176B4D]' : 'border-[#A8861B]'
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                evt.isFact ? 'bg-[#176B4D]' : 'bg-[#A8861B]'
              }`}
            />
          </div>

          <div className="rounded-2xl border border-[#E5E9E5] bg-[#FAFBF9] p-4 text-xs space-y-2.5 shadow-2xs">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1 border-b border-[#E5E9E5]/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#17251F] text-xs">{evt.title}</span>
                {evt.riskContribution !== undefined && (
                  <span className="font-mono text-[10px] px-2 py-0.2 rounded-full bg-[#E8F2EC] text-[#176B4D] font-bold border border-[#C8DFD4]">
                    +{evt.riskContribution} pts
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#77847C]">
                {formatDate(evt.timestamp)}
              </span>
            </div>

            <p className="text-[#17251F] leading-relaxed text-xs">{evt.description}</p>

            {/* Evidence fields — only show fields that have real values */}
            {(evt.decoyId || evt.path || evt.sourceIp || evt.matchedPattern) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono p-2.5 rounded-xl bg-white border border-[#E5E9E5]">
                {evt.decoyId && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Shield className="h-3 w-3 text-[#176B4D] shrink-0" />
                    <span className="text-[#77847C]">Decoy:</span>
                    <span className="font-semibold text-[#17251F] truncate">{evt.decoyId}</span>
                  </div>
                )}
                {evt.path && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="h-3 w-3 text-[#176B4D] shrink-0" />
                    <span className="text-[#77847C]">Path:</span>
                    <span className="text-[#17251F] truncate">
                      {evt.method ? `${evt.method} ` : ''}
                      {evt.path}
                    </span>
                  </div>
                )}
                {evt.sourceIp && (
                  <div>
                    <span className="text-[#77847C]">Source IP: </span>
                    <span className="text-[#17251F]">{evt.sourceIp}</span>
                  </div>
                )}
                {evt.matchedPattern && (
                  <div className="truncate">
                    <span className="text-[#77847C]">Token Pattern: </span>
                    <span className="text-[#176B4D] font-semibold truncate">{evt.matchedPattern}</span>
                  </div>
                )}
              </div>
            )}

            {/* Collapsible raw telemetry — for advanced users */}
            {evt.rawSnippet && <RawSnippetToggle rawSnippet={evt.rawSnippet} />}

            {/* Evidence vs inference badge */}
            <div className="flex items-center justify-between pt-1">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  evt.isFact
                    ? 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]'
                    : 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]'
                }`}
              >
                {evt.isFact ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-[#267B58]" />
                    <span>Observed — Sensor Verified</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-3 w-3 text-[#854D0E]" />
                    <span>Inferred — Risk Evaluation</span>
                  </>
                )}
              </span>
              <span className="font-mono text-[10px] text-[#77847C]">{evt.id}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
