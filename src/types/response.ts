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
