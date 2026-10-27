import React from 'react'
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
      />

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
