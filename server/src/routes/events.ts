import { Router, type Request, type Response } from 'express'
import { store } from '../store.js'

export const eventRouter = Router()

// GET /api/events
eventRouter.get('/', (req: Request, res: Response) => {
  const decoyId = req.query.decoyId as string | undefined
  const events = decoyId ? store.getEventsByDecoy(decoyId) : store.getEvents()
  res.json({ events, count: events.length })
})

// GET /api/events/:id
eventRouter.get('/:id', (req: Request, res: Response) => {
  const event = store.getEvents().find((e) => e.id === req.params.id)
  if (!event) {
    return res.status(404).json({ error: `Event with id '${req.params.id}' not found` })
  }
  return res.json({ event })
})
