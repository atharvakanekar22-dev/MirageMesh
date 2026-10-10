import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { store } from '../store.js'

export const decoyRouter = Router()

const CreateDecoySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(64, 'Name cannot exceed 64 characters'),
  type: z.enum(['credential', 'database_record', 'api_endpoint', 'package_identifier'], {
    errorMap: () => ({ message: 'Please select a valid decoy category' }),
  }),
  environment: z.enum(['development', 'staging', 'production-sim']).optional(),
  namingConvention: z.string().max(40).optional(),
  description: z.string().max(200).optional(),
  syntheticValue: z.string().optional(),
})

const UpdateStatusSchema = z.object({
  status: z.enum(['draft', 'staged', 'active', 'triggered', 'retired']),
})

// GET /api/decoys
decoyRouter.get('/', (_req: Request, res: Response) => {
  const decoys = store.getDecoys()
  res.json({ decoys, count: decoys.length })
})

// POST /api/decoys
decoyRouter.post('/', (req: Request, res: Response) => {
  const result = CreateDecoySchema.safeParse(req.body)
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }))
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    })
  }

  const decoy = store.createDecoy(result.data)
  return res.status(201).json({ decoy })
})

function getParam(val: unknown): string {
  if (Array.isArray(val)) return String(val[0] ?? '')
  return String(val ?? '')
}

// GET /api/decoys/:id
decoyRouter.get('/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id)
  const decoy = store.getDecoy(id)
  if (!decoy) {
    return res.status(404).json({ error: `Decoy with id '${id}' not found` })
  }
  return res.json({ decoy })
})

// PATCH /api/decoys/:id/status
decoyRouter.patch('/:id/status', (req: Request, res: Response) => {
  const result = UpdateStatusSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const id = getParam(req.params.id)
  const updated = store.updateDecoy(id, { status: result.data.status })
  if (!updated) {
    return res.status(404).json({ error: `Decoy with id '${id}' not found` })
  }
  return res.json({ decoy: updated })
})

// DELETE /api/decoys/:id
decoyRouter.delete('/:id', (req: Request, res: Response) => {
  const id = getParam(req.params.id)
  const deleted = store.deleteDecoy(id)
  if (!deleted) {
    return res.status(404).json({ error: `Decoy with id '${id}' not found` })
  }
  return res.json({ success: true, message: `Decoy '${id}' deleted` })
})

