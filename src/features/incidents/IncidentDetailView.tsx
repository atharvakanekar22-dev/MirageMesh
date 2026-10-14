import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import { SeverityIndicator } from '@/components/data-display/SeverityIndicator'
import { IncidentTimeline } from './IncidentTimeline'
import { RiskBreakdown } from './RiskBreakdown'
import type { Incident } from '@/types/incident'
import { formatDate } from '@/lib/utils'

import { useEvents } from '@/hooks/useEvents'
import type { TimelineEventItem } from './IncidentTimeline'

interface IncidentDetailViewProps {
  incident: Incident
  onStatusChange: (id: string, status: Incident['status']) => void
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incident,
  onStatusChange,
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'timeline' | 'risk' | 'mitigation'>('timeline')
  const { events } = useEvents()

  // Match real security events correlated with this incident
  const matchedEvents = events.filter((e) => incident.relatedEventIds.includes(e.id))
  // Sort chronologically by actual server timestamp
  matchedEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const seenDecoys = new Set<string>()
  const timelineEvents: TimelineEventItem[] =
    matchedEvents.length > 0
      ? matchedEvents.map((evt, idx) => {
          const isFirst = idx === 0
          const isDistinct = idx > 0 && evt.decoyId && !seenDecoys.has(evt.decoyId)
          if (evt.decoyId) seenDecoys.add(evt.decoyId)
          const riskContribution = isFirst ? 70 : isDistinct ? 10 : 5

          return {
            id: evt.id,
            title: `Canary Ingress Trigger: ${evt.eventType.replace(/_/g, ' ')}`,
            description: `Empirical telemetry hit against decoy resource: ${evt.decoyId || 'Unspecified'}. Ground truth sensor trigger.`,
            timestamp: evt.timestamp,
            type: 'canary_access' as const,
            isFact: true,
            decoyId: evt.decoyId,
            method: evt.evidence?.method,
            path: evt.evidence?.pathOrKey,
            sourceIp: evt.evidence?.sourceIP,
            matchedPattern: evt.evidence?.matchedPattern,
            rawSnippet: evt.evidence?.rawTelemetrySnippet,
            riskContribution,
          }
        })
      : incident.relatedEventIds.map((eventId, idx) => ({
          id: eventId,
          title: `Canary Ingress Trigger (${eventId})`,
          description: `Empirical telemetry event recorded against decoy resource: ${
            incident.relatedDecoyIds[idx % incident.relatedDecoyIds.length] || incident.relatedDecoyIds.join(', ')
          }. Zero-production baseline deviation.`,
          timestamp: idx === 0 ? incident.createdAt : incident.updatedAt,
          type: 'canary_access' as const,
          isFact: true,
          decoyId: incident.relatedDecoyIds[idx % incident.relatedDecoyIds.length],
          riskContribution: idx === 0 ? 70 : 5,
        }))

  const analysisTimelineEvent: TimelineEventItem = {
    id: `${incident.id}-analysis`,
    title: 'Deterministic Threat Scoring & Telemetry Correlation',
    description:
      incident.analysis?.summary ||
      'Evaluated confirmed decoy interaction with zero false-positive tolerance.',
    timestamp: incident.updatedAt,
    type: 'analysis' as const,
    isFact: false,
  }

  const computedTimelineEvents =
    timelineEvents.length > 0 ? [...timelineEvents, analysisTimelineEvent] : [analysisTimelineEvent]

  const tabs = [
    { id: 'timeline', label: 'Timeline & Evidence' },
    { id: 'risk', label: 'Risk Decomposition' },
    { id: 'mitigation', label: 'Mitigation Actions' },
  ]

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-5 shadow-xs">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4.5 border-b border-[#E5E9E5] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#176B4D]">
              {incident.id}
            </span>
            <SeverityIndicator severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <h2 className="text-lg font-bold text-[#17251F] mt-1.5">
            {incident.title}
          </h2>
          <div className="flex items-center gap-4 text-[11px] font-mono text-[#77847C] mt-1.5">
            <span>Created: {formatDate(incident.createdAt)}</span>
            <span>Updated: {formatDate(incident.updatedAt)}</span>
            {incident.assignedAnalyst && (
              <span>Analyst: {incident.assignedAnalyst}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const nextStatus = incident.status === 'contained' ? 'investigating' : 'contained'
              onStatusChange(incident.id, nextStatus)
            }}
          >
            {incident.status === 'contained' ? 'Reopen Investigation' : 'Mark Contained'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={() => navigate('/response')}
          >
            Response Centre
          </Button>
        </div>
      </div>

      {/* Associated Decoys Banner */}
      <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-[#176B4D]" />
          <span className="text-[#77847C]">Associated Canary Resources:</span>
          <span className="font-mono font-semibold text-[#17251F]">
            {incident.relatedDecoyIds.join(', ')}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#77847C] px-2 py-0.5 rounded-full bg-white border border-[#E5E9E5]">
          {incident.relatedEventIds.length} telemetry triggers
        </span>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab Panels */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <IncidentTimeline events={computedTimelineEvents} />
        </div>
      )}

      {activeTab === 'risk' && (
        <RiskBreakdown
          score={incident.riskScore}
          factors={incident.riskFactors}
          analysis={incident.analysis}
        />
      )}

      {activeTab === 'mitigation' && (
        <div className="space-y-4 text-xs">
          {incident.analysis?.recommendedMitigations ? (
            <div className="space-y-2.5">
              {incident.analysis.recommendedMitigations.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-[#176B4D] shrink-0" />
                    <span className="text-[#17251F] font-medium">{action}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/response')}
                  >
                    Stage Response
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-[#E5E9E5] text-center text-[#77847C]">
              No mitigations generated for this incident.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
