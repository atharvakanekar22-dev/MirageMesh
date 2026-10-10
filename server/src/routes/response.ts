import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { store } from '../store.js'
import type { ContainmentAction, ContainmentActionType } from '../types.js'

export const responseRouter = Router()

const CreateActionSchema = z.object({
  incidentId: z.string().min(1, 'Incident ID is required'),
  actionType: z.enum([
    'isolate_session',
    'throttle_source',
    'revoke_synthetic_credential',
    'block_network_egress',
    'mark_decoy_compromised',
    'notify_soc_team',
  ]),
  targetEntity: z.string().min(1, 'Target entity is required'),
  reason: z.string().min(10, 'Audit reason must be at least 10 characters long'),
  operator: z.string().min(2, 'Operator identifier is required'),
  newIncidentStatus: z.enum(['open', 'investigating', 'contained', 'resolved', 'dismissed']).optional(),
})

// GET /api/response/actions
responseRouter.get('/actions', (_req: Request, res: Response) => {
  const actions = store.getActions()
  res.json({ actions, count: actions.length })
})

// POST /api/response/actions
responseRouter.post('/actions', (req: Request, res: Response) => {
  const result = CreateActionSchema.safeParse(req.body)
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }))
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  const { incidentId, actionType, targetEntity, reason, operator, newIncidentStatus } = result.data

  const actionId = `act-${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 5)}`
  const newAction: ContainmentAction = {
    id: actionId,
    incidentId,
    actionType: actionType as ContainmentActionType,
    status: 'completed',
    timestamp: new Date().toISOString(),
    auditDetails: {
      operator: operator || 'SOC-Operator',
      reason,
      approvedAt: new Date().toISOString(),
      executionEngine: 'manual_operator',
      targetEntity,
      reversibility: 'reversible',
      notes: 'Simulated defensive intervention recorded to audit ledger. Zero production systems contacted.',
    },
  }

  store.recordAction(newAction)

  // If action implies incident status transition
  if (newIncidentStatus) {
    store.updateIncidentStatus(incidentId, newIncidentStatus)
  } else if (actionType === 'isolate_session' || actionType === 'throttle_source') {
    // default to investigating / contained
    const inc = store.getIncident(incidentId)
    if (inc && inc.status === 'open') {
      store.updateIncidentStatus(incidentId, 'investigating')
    }
  } else if (actionType === 'revoke_synthetic_credential' || actionType === 'mark_decoy_compromised') {
    // If target decoy can be matched, retire the synthetic decoy
    const decoy = store.findDecoyByValueOrResource(targetEntity) || store.getDecoy(targetEntity)
    if (decoy) {
      store.updateDecoy(decoy.id, { status: 'retired' })
    }
  }

  return res.status(201).json({
    action: newAction,
    simulated: true,
    message: 'Simulated containment action successfully recorded to backend audit ledger.',
  })
})

// DELETE /api/response/actions
responseRouter.delete('/actions', (_req: Request, res: Response) => {
  store.clearActions()
  res.json({ success: true, message: 'Response audit log cleared' })
})
