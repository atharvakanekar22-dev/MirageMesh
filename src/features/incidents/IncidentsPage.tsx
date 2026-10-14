import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/data-display/EmptyState'
import { StatusBadge } from '@/components/data-display/StatusBadge'
import { SeverityIndicator } from '@/components/data-display/SeverityIndicator'
import { IncidentDetailView } from './IncidentDetailView'
import { useIncidents } from '@/hooks/useIncidents'

export const IncidentsPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    incidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    updateIncidentStatus,
    isLoading,
    refreshIncidents,
  } = useIncidents()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Investigation"
        description="Review and investigate security incidents correlated from decoy canary trips."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={refreshIncidents}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white text-[#77847C] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-all focus-ring shadow-2xs cursor-pointer"
              title="Refresh incidents"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-[#176B4D]' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        }
      />

      {isLoading && incidents.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-8 text-center text-xs text-[#77847C]">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto text-[#176B4D] mb-2" />
          <span>Synchronizing incident ledger with MirageMesh engine...</span>
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Incidents to Investigate"
          description="There are currently no security incidents recorded from decoy canary triggers. All synthetic decoy assets remain uncompromised."
          indicatorText="Clean Threat Registry (0 Incidents Recorded)"
          actionLabel="Review Staged Decoys"
          onAction={() => navigate('/decoys')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Incident Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-semibold text-[#17251F]">
                Correlated Incidents ({incidents.length})
              </span>
              <span className="text-[11px] font-mono text-[#77847C]">Sorted by Risk</span>
            </div>

            <div className="space-y-2.5">
              {incidents.map((inc) => {
                const isSelected = selectedIncidentId === inc.id
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer select-none shadow-xs ${
                      isSelected
                        ? 'border-[#176B4D] bg-[#E8F2EC]/30 ring-1 ring-[#176B4D]'
                        : 'border-[#E5E9E5] bg-white hover:bg-[#FAFBF9] hover:border-[#D1D8D2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[#176B4D]">
                        {inc.id}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-[#77847C] text-[10px] font-medium">SCORE</span>
                        <span className="font-bold text-[#17251F] tabular-nums">
                          {inc.riskScore}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xs font-semibold text-[#17251F] line-clamp-1 mt-1.5">
                      {inc.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#E5E9E5]">
                      <SeverityIndicator severity={inc.severity} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Incident Dossier Detail (8 cols) */}
          <div className="lg:col-span-8">
            {selectedIncident ? (
              <IncidentDetailView
                incident={selectedIncident}
                onStatusChange={updateIncidentStatus}
              />
            ) : (
              <EmptyState
                icon={AlertTriangle}
                title="Select an Incident to Inspect"
                description="Choose an incident record from the list on the left to examine correlated timeline telemetry, empirical evidence, and risk factors."
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
