import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SimulationControlPanel } from './SimulationControlPanel'
import { EventFeed } from './EventFeed'
import { SimulationSummary } from './SimulationSummary'
import { useSimulation } from '@/hooks/useSimulation'
import { useDecoys } from '@/hooks/useDecoys'
import { useIncidents } from '@/hooks/useIncidents'
import { useEvents } from '@/hooks/useEvents'

export const SimulationPage: React.FC = () => {
  const {
    status,
    config,
    setConfig,
    events,
    steps,
    summary,
    startedAt,
    completedAt,
    error,
    runSimulation,
    stopSimulation,
    resetSimulation,
  } = useSimulation()

  const { decoys, refreshDecoys } = useDecoys()
  const { refreshIncidents } = useIncidents()
  const { refreshEvents } = useEvents()

  const handleRun = async () => {
    await runSimulation(decoys, async () => {
      await Promise.all([refreshDecoys(), refreshIncidents(), refreshEvents()])
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attack Simulation"
        description="Run controlled canary probes against registered decoys to validate detection and risk scoring."
      />

      {/* Controlled simulation disclaimer */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#E8F2EC] border border-[#C8DFD4] text-xs text-[#176B4D]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#176B4D]" />
        <span className="leading-relaxed">
          <strong className="font-semibold text-[#104B37]">Controlled Scenario Environment: </strong>
          Probes execute only against application-owned canary endpoints using real registered decoy IDs. All events, trigger counts, and risk scores are live.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Operator Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <SimulationControlPanel
            status={status}
            config={config}
            onConfigChange={setConfig}
            onRunSimulation={handleRun}
            onStopSimulation={stopSimulation}
            onResetSimulation={resetSimulation}
            decoys={decoys}
            errorMessage={error}
          />
        </div>

        {/* Right Column: Event Stream & Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <SimulationSummary
            status={status}
            startedAt={startedAt}
            completedAt={completedAt}
            eventCount={events.length}
            summary={summary}
          />

          <EventFeed
            events={events}
            steps={steps}
            isExecuting={status === 'running'}
          />
        </div>
      </div>
    </div>
  )
}
