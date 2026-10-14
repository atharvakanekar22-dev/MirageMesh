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
import { GlossaryTerm } from '@/components/ui/GlossaryTerm'

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
      {/* Page Header (Reference Inspired) */}
      <PageHeader
        title="Overview"
        description="Monitor deception resources, investigate security events, and manage incident response."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white text-[#77847C] border border-[#E5E9E5] hover:bg-[#F3F6F3] hover:text-[#17251F] transition-all focus-ring shadow-2xs cursor-pointer"
              title="Refresh telemetry and incidents from backend"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#176B4D]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-full bg-white text-[#17251F] border border-[#E5E9E5] hover:bg-[#F3F6F3] transition-all focus-ring shadow-2xs cursor-pointer"
            >
              View Incidents
            </button>

            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/decoys')}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-full bg-[#176B4D] text-white hover:bg-[#104B37] transition-all focus-ring shadow-2xs cursor-pointer"
              >
                <span>+ Generate Decoy</span>
              </button>
              <span className="text-xs text-[#77847C]">
                <GlossaryTerm term="What’s a decoy?">A fake digital item, like a password or web page, that helps spot someone snooping where they shouldn’t.</GlossaryTerm>
              </span>
            </div>
          </div>
        }
      />

      {/* Security Metrics Strip (Reference Inspired 4-Panel Row with Forest Green Hero) */}
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
        {/* Left 7 Columns: Analytics Chart & Recent Incidents */}
        <div className="lg:col-span-7 space-y-5">
          {/* Risk Distribution Analytics Bar Chart */}
          <RiskDistributionChart incidents={incidents} />

          {/* Recent Threat Incidents Table/List */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-sm font-semibold text-[#17251F]">Recent Threat Incidents</h3>
                <p className="text-xs text-[#77847C]">Correlated suspicious interaction records</p>
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

        {/* Right 5 Columns: Reminders/Quick Actions & Security Posture Gauge */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Simulation Action Card (Inspired by reference 'Meeting / Reminders' card) */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#77847C] uppercase tracking-wider">
                Quick Scenario
              </span>
              <span className="h-2 w-2 rounded-full bg-[#176B4D]" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#17251F]">
                Controlled Probe Simulation
              </h4>
              <p className="text-xs text-[#77847C] mt-1 leading-relaxed">
                Test canary trip sensitivity against staging cluster endpoints without external traffic.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/simulation')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#176B4D] hover:bg-[#104B37] text-white text-xs font-semibold py-2.5 transition-all focus-ring shadow-2xs cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Launch Simulation Workspace</span>
              </button>
            </div>
          </div>

          {/* Deception Posture Gauge (Dynamic coverage based on actual decoys) */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[#17251F]">Mesh Deception Coverage</h4>
              <span className="text-[10px] font-mono font-medium text-[#176B4D] bg-[#E8F2EC] px-2 py-0.5 rounded-full">
                {coverageStatus}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              {/* SVG Semi-Circle Arch Gauge */}
              <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
                <svg className="w-44 h-44 absolute -top-0" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <path
                    d="M 15 50 A 35 35 0 0 1 85 50"
                    fill="none"
                    stroke="#E5E9E5"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Active Arc (Forest Green) */}
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

              {/* Status legend dots */}
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

          {/* Deception Module Shortcuts */}
          <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-semibold text-[#17251F]">Platform Workspaces</h4>

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
                    <div className="text-xs font-semibold text-[#17251F]">AI Decoy Lab</div>
                    <div className="text-[11px] text-[#77847C]">Author synthetic tokens</div>
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
        </div>
      </div>

      {/* Full Width Table: Recent Security Activity */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#17251F]">Recent Security Activity</h3>
            <p className="text-xs text-[#77847C]">
              Raw telemetry events received from decoy detection endpoints
            </p>
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
