import type { SeverityLevel } from './event'

export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'resolved' | 'dismissed'

export interface RiskFactor {
  dimension: string
  scoreWeight: number
  justification: string
  isObservedFact: boolean // Clear separation between observed events vs inferred threats
}

export interface IncidentAnalysis {
  summary: string
  threatVector: string
  confidenceScore: number
  observedFacts: string[]
  inferredHypotheses: string[]
  recommendedMitigations: string[]
  analystNotes?: string
}

export interface Incident {
  id: string
  title: string
  riskScore: number // 0 to 100
  severity: SeverityLevel
  status: IncidentStatus
  relatedEventIds: string[]
  relatedDecoyIds: string[]
  createdAt: string
  updatedAt: string
  assignedAnalyst?: string
  riskFactors?: RiskFactor[]
  analysis?: IncidentAnalysis
}
