export * from './decoy'
export * from './event'
export * from './incident'
export * from './response'

export interface WorkspaceConfig {
  id: string
  name: string
  environment: 'production' | 'staging' | 'sandbox'
  telemetryEnabled: boolean
  decoyLimit: number
  activeRegion: string
}
