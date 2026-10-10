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
  syntheticValue: string // Resource identifier / synthetic token / canary pattern
  status: DecoyStatus
  createdAt: string
  triggerCount: number
  lastTriggeredAt?: string
  metadata?: DecoyMetadata
}

export interface CreateDecoyInput {
  name: string
  type: DecoyCategory
  syntheticValue: string
  environment: 'development' | 'staging' | 'production-sim'
  namingConvention?: string
  description?: string
}
