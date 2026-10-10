import { z } from 'zod'

export const DecoyGenerationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(64, 'Name cannot exceed 64 characters'),
  type: z.enum(['credential', 'database_record', 'api_endpoint', 'package_identifier'], {
    error: 'Please select a valid decoy category',
  }),
  environment: z.enum(['development', 'staging', 'production-sim']),
  namingConvention: z.string().max(40, 'Naming convention must be 40 characters or less').optional(),
  description: z.string().max(200, 'Description must be under 200 characters').optional(),
})

export type DecoyGenerationFormData = z.infer<typeof DecoyGenerationSchema>

export const SimulationConfigSchema = z.object({
  targetEnvironment: z.enum(['staging-vpc', 'dev-cluster-alpha', 'sandbox-local']),
  scenarioType: z.enum(['credential_probe', 'api_scan', 'data_exfiltration_ping']),
  intensity: z.enum(['stealth', 'moderate', 'aggressive']),
  simulatedDecoyId: z.string().min(1, 'Target decoy must be selected'),
})

export type SimulationConfigFormData = z.infer<typeof SimulationConfigSchema>

export const ResponseActionSchema = z.object({
  incidentId: z.string().min(1, 'Incident ID is required'),
  actionType: z.enum([
    'isolate_session',
    'throttle_source',
    'revoke_synthetic_credential',
    'block_network_egress',
    'mark_decoy_compromised',
    'notify_soc_team',
  ]),
  reason: z.string().min(10, 'Audit reason must be at least 10 characters'),
  operator: z.string().min(2, 'Operator identifier is required'),
})

export type ResponseActionFormData = z.infer<typeof ResponseActionSchema>
