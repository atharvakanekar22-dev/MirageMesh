import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  ArrowRight,
  Play,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SecurityMetrics } from './SecurityMetrics'
import { RecentActivityTable } from './RecentActivityTable'
import { RiskDistributionChart } from './RiskDistributionChart'
import { RecentIncidentsList } from './RecentIncidentsList'
import { useDecoys } from '@/hooks/useDecoys'
import { useIncidents } from '@/hooks/useIncidents'
import { useEvents } from '@/hooks/useEvents'

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate()
  const { decoys, refreshDecoys, isLoading: decoysLoading } = useDecoys()
  const { incidents, refreshIncidents, isLoading: incidentsLoading } = useIncidents()
  const { events, refreshEvents, isLoading: eventsLoading } = useEvents()

  const handleRefreshAll = () => {
    refreshDecoys()
    refreshIncidents()
    refreshEvents()
  }

  const isRefreshing = decoysLoading || incidentsLoading || eventsLoading
  const registeredDecoysCount = decoys.length
  const decoyInteractionsCount = events.length
  const openIncidentsCount = incidents.filter(
    (i) => i.status === 'open' || i.status === 'investigating'
  ).length
  const criticalIncidentsCount = incidents.filter(
    (i) => i.severity === 'critical'
  ).length

  // Calculate actual canary coverage dynamically
  const coveragePercentage = decoys.length === 0 ? 0 : Math.min(100, decoys.length * 25)
  const remainingPercentage = 100 - coveragePercentage
  const coverageStatus =
    coveragePercentage >= 75
      ? 'Healthy'
      : coveragePercentage > 0
      ? 'Staging'
      : 'Unconfigured'

  const angle = (coveragePercentage / 100) * Math.PI
  const arcX = 50 - 35 * Math.cos(angle)
  const arcY = 50 - 35 * Math.sin(angle)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md bg-white text-[#77847C] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-all focus-ring shadow-2xs cursor-pointer"
              title="Refresh telemetry from backend"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#176B4D]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md bg-white text-[#17251F] border border-[#E5E9E5] hover:bg-[#F3F6F3] transition-all focus-ring shadow-2xs cursor-pointer"
            >
              View Incidents
            </button>

            <button
              type="button"
              onClick={() => navigate('/decoys')}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-md bg-[#315f9f] text-white hover:bg-[#234779] transition-all focus-ring shadow-2xs cursor-pointer"
            >
              <span>+ Create Decoy</span>
            </button>
          </div>
        }
      />

      {/* Primary: Security Metrics */}
      <SecurityMetrics
        data={{
          registeredDecoys: registeredDecoysCount,
          decoyInteractions: decoyInteractionsCount,
          openIncidents: openIncidentsCount,
          criticalIncidents: criticalIncidentsCount,
          isLive: true,
        }}
      />

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Risk chart & Recent Incidents */}
        <div className="lg:col-span-7 space-y-5">
          <RiskDistributionChart incidents={incidents} />

          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-semibold text-[#17251F]">Recent Incidents</h3>
                <p className="text-xs text-[#77847C]">Latest alerts</p>
              </div>
              <button
                onClick={() => navigate('/incidents')}
                className="text-xs text-[#176B4D] hover:underline font-semibold focus-ring"
              >
                View all &rarr;
              </button>
            </div>
            <RecentIncidentsList incidents={incidents} />
          </div>
        </div>

        {/* Right 5 Columns: Coverage gauge, workspace shortcuts, simulation shortcut */}
        <div className="lg:col-span-5 space-y-5">
          {/* Deception Coverage Gauge — primary right panel */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#17251F]">Coverage</h4>
              <span className="text-[10px] font-mono font-medium text-[#176B4D] bg-[#E8F2EC] px-2 py-0.5 rounded-full">
                {coverageStatus}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              {/* SVG Semi-Circle Arch Gauge */}
              <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
                <svg className="w-44 h-44 absolute -top-0" viewBox="0 0 100 100">
                  <path
                    d="M 15 50 A 35 35 0 0 1 85 50"
                    fill="none"
                    stroke="#E5E9E5"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {coveragePercentage > 0 && (
                    <path
                      d={`M 15 50 A 35 35 0 0 1 ${arcX.toFixed(1)} ${arcY.toFixed(1)}`}
                      fill="none"
                      stroke="#176B4D"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <div className="text-center relative -top-1">
                  <span className="text-3xl font-extrabold text-[#17251F] font-mono tabular-nums">
                    {coveragePercentage}%
                  </span>
                  <p className="text-[10px] text-[#77847C] uppercase font-medium">Coverage Index</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#77847C] mt-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#176B4D]" />
                  <span>Staged ({coveragePercentage}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E5E9E5]" />
                  <span>Target ({remainingPercentage}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Platform Workspaces shortcuts */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-semibold text-[#17251F]">Shortcuts</h4>

            <div className="space-y-2">
              <div
                onClick={() => navigate('/decoys')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E9E5] hover:bg-[#FAFBF9] hover:border-[#D1D8D2] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#E8F2EC] text-[#176B4D]">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#17251F]">Decoy Lab</div>
                    <div className="text-[11px] text-[#77847C]">Author synthetic canaries</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#77847C] group-hover:text-[#176B4D] group-hover:translate-x-0.5 transition-all" />
              </div>

              <div
                onClick={() => navigate('/response')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5E9E5] hover:bg-[#FAFBF9] hover:border-[#D1D8D2] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#E8F2EC] text-[#176B4D]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#17251F]">Response Centre</div>
                    <div className="text-[11px] text-[#77847C]">Audited containment actions</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#77847C] group-hover:text-[#176B4D] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>

          {/* Simulation — compact secondary action strip (not a large CTA) */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-[#FAFBF9] p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#77847C] uppercase tracking-wider">
                  Controlled Test
                </span>
                <p className="text-xs font-medium text-[#17251F] mt-0.5">Probe Simulation</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/simulation')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white text-[#176B4D] border border-[#C8DFD4] hover:bg-[#E8F2EC] transition-all focus-ring shadow-2xs cursor-pointer"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Run Simulation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width: Recent Security Activity */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#17251F]">Activity</h3>
            <p className="text-xs text-[#77847C]">Latest events</p>
          </div>
        </div>
        <RecentActivityTable
          events={events}
          onViewSimulation={() => navigate('/simulation')}
        />
      </div>
    </div>
  )
}
