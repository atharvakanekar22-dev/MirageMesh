import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, AlertTriangle, RefreshCw, Search } from 'lucide-react'
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
    error,
    refreshIncidents,
  } = useIncidents()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'contained' | 'resolved' | 'dismissed'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')

  const filteredIncidents = useMemo(() => incidents.filter((incident) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || incident.id.toLowerCase().includes(query) || incident.title.toLowerCase().includes(query)
    return matchesSearch &&
      (statusFilter === 'all' || incident.status === statusFilter) &&
      (severityFilter === 'all' || incident.severity === severityFilter)
  }), [incidents, search, statusFilter, severityFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidents"
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

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-[#f7d4d4] bg-[#fdf2f2] p-4 text-sm text-[#c74646] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">We could not load incidents.</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
          <button type="button" onClick={refreshIncidents} className="self-start rounded-md border border-[#f7d4d4] bg-white px-3 py-1.5 text-xs font-semibold hover:bg-[#fff8f8] focus-ring sm:self-auto">
            Try again
          </button>
        </div>
      )}

      {isLoading && incidents.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-8 text-center text-xs text-[#77847C]">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto text-[#176B4D] mb-2" />
          <span>Loading incidents...</span>
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No incidents"
          description="New incidents will appear here."
          indicatorText="All clear"
          actionLabel="View decoys"
          onAction={() => navigate('/decoys')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Incident Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="space-y-2 rounded-lg border border-[#e5e9e5] bg-white p-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#77847c]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search incidents"
                  aria-label="Search incidents"
                  className="w-full rounded-md border border-[#e5e9e5] bg-[#f8fafc] py-2 pl-9 pr-3 text-xs text-[#17251f] focus-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} aria-label="Filter by status" className="rounded-md border border-[#e5e9e5] bg-white px-2 py-2 text-xs text-[#667085] focus-ring">
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="contained">Contained</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as typeof severityFilter)} aria-label="Filter by severity" className="rounded-md border border-[#e5e9e5] bg-white px-2 py-2 text-xs text-[#667085] focus-ring">
                  <option value="all">All severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pb-1 px-1">
              <span className="text-xs font-semibold text-[#17251F]">
                Incidents ({filteredIncidents.length})
              </span>
              <span className="text-[11px] font-mono text-[#77847C]">Sorted by Risk</span>
            </div>

            <div className="space-y-2.5">
              {filteredIncidents.map((inc) => {
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
                      {filteredIncidents.length === 0 && (
                        <EmptyState title="No matching incidents" description="Try changing your search or filters." />
                      )}
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
                title="Select an incident"
                description="Choose an incident from the list."
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
