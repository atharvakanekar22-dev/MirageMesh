import React from 'react'
import { MetricDisplay, type MetricItem } from '@/components/data-display/MetricDisplay'

export interface OverviewMetricsData {
  registeredDecoys: number
  decoyInteractions: number
  openIncidents: number
  criticalIncidents: number
  isLive: boolean
}

interface SecurityMetricsProps {
  data: OverviewMetricsData
}

export const SecurityMetrics: React.FC<SecurityMetricsProps> = ({ data }) => {
  const metricItems: MetricItem[] = [
    {
      id: 'registered-decoys',
      label: 'Registered Decoys',
      value: data.registeredDecoys,
      change: data.registeredDecoys === 0 ? 'No decoys staged' : `${data.registeredDecoys} active in mesh`,
      subtext: 'Synthetic canary inventory',
      isHero: true, // Forest Green Hero Card matching reference
    },
    {
      id: 'decoy-interactions',
      label: 'Decoy Interactions',
      value: data.decoyInteractions,
      change: data.decoyInteractions === 0 ? 'Zero trips recorded' : `${data.decoyInteractions} trips logged`,
      subtext: 'Observed canary probes',
    },
    {
      id: 'open-incidents',
      label: 'Open Incidents',
      value: data.openIncidents,
      change: data.openIncidents === 0 ? 'Zero active cases' : 'Awaiting review',
      subtext: 'Correlated event clusters',
    },
    {
      id: 'critical-incidents',
      label: 'Critical Incidents',
      value: data.criticalIncidents,
      change: data.criticalIncidents === 0 ? 'No critical breaches' : 'Immediate response',
      subtext: 'High-confidence alerts',
    },
  ]

  return <MetricDisplay metrics={metricItems} isLiveTelemetry={data.isLive} />
}
