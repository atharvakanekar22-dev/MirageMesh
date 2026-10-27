import React, { useState } from 'react'
import { Play, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ContainmentActionModal } from './ContainmentActionModal'
import { ResponseAuditTable } from './ResponseAuditTable'
import { useResponseActions } from '@/hooks/useResponseActions'
import { useIncidents } from '@/hooks/useIncidents'

export const ResponseCentrePage: React.FC = () => {
  const { actions, isExecuting, recordAction, clearAuditLog, refreshActions, isLoading: actionsLoading } = useResponseActions()
  const { incidents, refreshIncidents, isLoading: incidentsLoading } = useIncidents()

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents[0]?.id || ''
  )
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)

  const selectedIncident =
    incidents.find((i) => i.id === selectedIncidentId) || (incidents.length > 0 ? incidents[0] : null)

  const handleRefresh = async () => {
    await Promise.all([refreshActions(), refreshIncidents()])
  }

  const handleExecuteAction = async (...args: Parameters<typeof recordAction>) => {
    await recordAction(...args)
    await refreshIncidents()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Response Centre"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={actionsLoading || incidentsLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white text-[#77847C] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-all focus-ring shadow-2xs cursor-pointer"
              title="Refresh response ledger"
            >
              <RefreshCw className={`h-3 w-3 ${actionsLoading || incidentsLoading ? 'animate-spin text-[#176B4D]' : ''}`} />
              <span>{actionsLoading || incidentsLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAuditLog}
              title="Clear local audit log history"
            >
              Clear Audit Log
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play className="h-3.5 w-3.5" />}
              disabled={incidents.length === 0}
              onClick={() => setIsActionModalOpen(true)}
              title={incidents.length === 0 ? 'An active incident is required to stage containment' : undefined}
            >
              Stage Containment Action
            </Button>
          </div>
        }
      />

      {/* Incident Selection & Recommended Response Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Incident Selector Card */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E9E5]">
            <span className="text-xs font-semibold text-[#17251F]">Target Incident</span>
            <span className="text-[11px] font-mono font-medium text-[#176B4D]">
              {selectedIncident ? selectedIncident.id : 'None selected'}
            </span>
          </div>

          {incidents.length > 0 ? (
            <div className="space-y-1.5">
              <label className="text-xs text-[#77847C] font-medium">Select Open Incident</label>
              <select
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="w-full rounded-xl border border-[#E5E9E5] bg-[#FAFBF9] px-3.5 py-2 text-xs text-[#17251F] focus-ring shadow-2xs"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.id} — {inc.title.slice(0, 36)}... (Risk: {inc.riskScore})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-[#77847C] space-y-1">
              <p className="font-medium text-[#17251F]">No incidents in active queue.</p>
              <p className="text-[11px]">Run a simulation to create an incident.</p>
            </div>
          )}

          {selectedIncident && (
            <div className="pt-2 text-xs text-[#77847C] space-y-1.5">
              <div>
                <span>Severity: </span>
                <span className="text-[#17251F] font-semibold capitalize">
                  {selectedIncident.severity}
                </span>
              </div>
              <div>
                <span>Decoy Reference: </span>
                <span className="font-mono text-[#176B4D] font-medium">
                  {selectedIncident.relatedDecoyIds.join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Defense Blueprint */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E5E9E5]">
            <span className="text-xs font-semibold text-[#17251F]">
              Quick actions
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F2EC] text-[#176B4D] border border-[#C8DFD4]">
              Actions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] space-y-1.5">
              <div className="font-semibold text-[#17251F]">1. Rate-Limit / Throttle Source</div>
              <p className="text-[11px] text-[#77847C] leading-relaxed">
                Enforce temporary rate limit on probe IP at gateway without revealing canary identity.
              </p>
              <button
                type="button"
                disabled={incidents.length === 0}
                onClick={() => setIsActionModalOpen(true)}
                className={`text-[11px] font-semibold pt-1 inline-block focus-ring ${
                  incidents.length === 0
                    ? 'text-[#77847C] cursor-not-allowed opacity-60'
                    : 'text-[#176B4D] hover:underline cursor-pointer'
                }`}
              >
                Stage Throttle Action &rarr;
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] space-y-1.5">
              <div className="font-semibold text-[#17251F]">2. Decoy Rotation & Re-seeding</div>
              <p className="text-[11px] text-[#77847C] leading-relaxed">
                Mark current decoy compromised and issue replacement synthetic token in pipeline.
              </p>
              <button
                type="button"
                disabled={incidents.length === 0}
                onClick={() => setIsActionModalOpen(true)}
                className={`text-[11px] font-semibold pt-1 inline-block focus-ring ${
                  incidents.length === 0
                    ? 'text-[#77847C] cursor-not-allowed opacity-60'
                    : 'text-[#176B4D] hover:underline cursor-pointer'
                }`}
              >
                Stage Rotation Action &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Audit Trail Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#17251F]">Containment Audit Ledger</h2>
            <p className="text-xs text-[#77847C]">
              Immutable log of defensive interventions, executing operators, and justification reasons
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#77847C] px-2.5 py-0.5 rounded-full bg-white border border-[#E5E9E5]">
            {actions.length} audit entries
          </span>
        </div>

        <ResponseAuditTable
          actions={actions}
          onOpenStageAction={incidents.length > 0 ? () => setIsActionModalOpen(true) : undefined}
        />
      </div>

      {/* Staged Action Modal */}
      {isActionModalOpen && (
        <ContainmentActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          incidentId={selectedIncident ? selectedIncident.id : 'inc-manual'}
          onExecute={handleExecuteAction}
          isExecuting={isExecuting}
        />
      )}
    </div>
  )
}
