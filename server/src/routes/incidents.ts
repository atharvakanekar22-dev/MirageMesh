import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { store } from '../store.js'

export const incidentRouter = Router()

const UpdateIncidentStatusSchema = z.object({
  status: z.enum(['open', 'investigating', 'contained', 'resolved', 'dismissed']),
})

// GET /api/incidents
incidentRouter.get('/', (_req: Request, res: Response) => {
  const incidents = store.getIncidents()
  res.json({ incidents, count: incidents.length })
})

function getParam(val: unknown): string {
  if (Array.isArray(val)) return String(val[0] ?? '')
  return String(val ?? '')
}

// GET /api/incidents/:id
incidentRouter.get('/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id)
  const incident = store.getIncident(id)
  if (!incident) {
    return res.status(404).json({ error: `Incident with id '${id}' not found` })
  }
  return res.json({ incident })
})

// PATCH /api/incidents/:id/status
incidentRouter.patch('/:id/status', (req: Request, res: Response) => {
  const result = UpdateIncidentStatusSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid incident status' })
  }

  const id = getParam(req.params.id)
  const updated = store.updateIncidentStatus(id, result.data.status)
  if (!updated) {
    return res.status(404).json({ error: `Incident with id '${id}' not found` })
  }
  return res.json({ incident: updated })
})

// DELETE /api/incidents
incidentRouter.delete('/', (_req: Request, res: Response) => {
  store.clearAllIncidents()
  res.json({ success: true, message: 'All incidents cleared' })
})
