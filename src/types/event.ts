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
