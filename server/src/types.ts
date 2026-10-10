export type DecoyCategory =
  | 'credential'
  | 'database_record'
  | 'api_endpoint'
  | 'package_identifier'

export type DecoyStatus =
  | 'draft'
  | 'staged'
  | 'active'
  | 'triggered'
  | 'retired'

export interface DecoyMetadata {
  description?: string
  environment: 'development' | 'staging' | 'production-sim'
  namingConvention?: string
  serviceScope?: string
  author?: string
}

export interface Decoy {
  id: string
  name: string
  type: DecoyCategory
  syntheticValue: string
  status: DecoyStatus
  createdAt: string
  triggerCount: number
  lastTriggeredAt?: string
  metadata?: DecoyMetadata
}

export interface CreateDecoyInput {
  name: string
  type: DecoyCategory
  syntheticValue?: string
  environment?: 'development' | 'staging' | 'production-sim'
  namingConvention?: string
  description?: string
}

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export type SecurityEventType =
  | 'decoy_access_attempt'
  | 'canary_token_leak'
  | 'unauthorized_api_probe'
  | 'credential_harvest_detected'
  | 'lateral_movement_ping'
  | 'synthetic_db_query'

export interface EventEvidence {
  protocol?: string
  method?: string
  pathOrKey?: string
  userAgent?: string
  sourceIP?: string
  networkRegion?: string
  fingerprintHash?: string
  matchedPattern?: string
  rawTelemetrySnippet?: string
}

export interface SecurityEvent {
  id: string
  eventType: SecurityEventType
  timestamp: string
  decoyId?: string
  sourceIdentifier?: string
  severity: SeverityLevel
  evidence: EventEvidence
  simulation: boolean
  correlationTags?: string[]
}

export type IncidentStatus = 'open' | 'investigating' | 'contained' | 'resolved' | 'dismissed'

export interface RiskFactor {
  dimension: string
  scoreWeight: number
  justification: string
  isObservedFact: boolean
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
  riskScore: number
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

export type ContainmentActionType =
  | 'isolate_session'
  | 'throttle_source'
  | 'revoke_synthetic_credential'
  | 'block_network_egress'
  | 'mark_decoy_compromised'
  | 'notify_soc_team'

export type ContainmentStatus = 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled'

export interface AuditDetails {
  operator: string
  reason: string
  approvedAt?: string
  executionEngine: 'manual_operator' | 'automated_policy'
  targetEntity: string
  reversibility: 'reversible' | 'irreversible'
  notes?: string
}

export interface ContainmentAction {
  id: string
  incidentId: string
  actionType: ContainmentActionType
  status: ContainmentStatus
  timestamp: string
  auditDetails: AuditDetails
}

