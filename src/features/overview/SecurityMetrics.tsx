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
      label: 'Active decoys',
      value: data.registeredDecoys,
      change: data.registeredDecoys === 0 ? 'Create your first decoy' : `${data.registeredDecoys} ready to monitor`,
      subtext: 'Synthetic resources being watched',
      isHero: true, // Forest Green Hero Card matching reference
    },
    {
      id: 'decoy-interactions',
      label: 'Decoy activity',
      value: data.decoyInteractions,
      change: data.decoyInteractions === 0 ? 'No activity yet' : `${data.decoyInteractions} events recorded`,
      subtext: 'Unauthorized access attempts',
    },
    {
      id: 'open-incidents',
      label: 'Open incidents',
      value: data.openIncidents,
      change: data.openIncidents === 0 ? 'Nothing needs attention' : 'Review required',
      subtext: 'Events grouped for review',
    },
    {
      id: 'critical-incidents',
      label: 'Critical alerts',
      value: data.criticalIncidents,
      change: data.criticalIncidents === 0 ? 'No urgent alerts' : 'Immediate response',
      subtext: 'Highest-priority incidents',
    },
  ]

  return <MetricDisplay metrics={metricItems} isLiveTelemetry={data.isLive} />
}
