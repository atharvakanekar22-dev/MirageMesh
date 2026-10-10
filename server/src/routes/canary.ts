import { Router, type Request, type Response } from 'express'
import { store } from '../store.js'
import { handleCanaryTrigger } from '../detection.js'

export const canaryRouter = Router()

function extractClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || req.ip || '127.0.0.1'
}

function extractTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers['authorization']
  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim()
    return authHeader.trim()
  }
  const apiKeyHeader = req.headers['x-api-key'] || req.headers['x-admin-token']
  if (typeof apiKeyHeader === 'string') return apiKeyHeader.trim()

  const queryToken = req.query.token || req.query.key || req.query.decoyId
  if (typeof queryToken === 'string') return queryToken.trim()

  return undefined
}

function getHeader(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0]
  return val
}

// GET /api/internal/keys
canaryRouter.get('/internal/keys', (req: Request, res: Response) => {
  const token = extractTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Missing synthetic canary key or token',
      canaryTriggered: false,
    })
  }

  // Look for registered decoy matching the token or ID
  const decoy = store.findDecoyByValueOrResource(token)
  if (!decoy || decoy.status === 'retired') {
    return res.status(401).json({
      error: 'Unauthorized: Invalid key identifier',
      canaryTriggered: false,
    })
  }

  // Trigger high-confidence security event and deterministic risk scoring
  const ip = extractClientIp(req)
  const userAgent = getHeader(req.headers['user-agent'])
  const result = handleCanaryTrigger({
    decoy,
    method: 'GET',
    path: req.originalUrl,
    ip,
    userAgent,
    protocol: req.protocol.toUpperCase() + '/' + req.httpVersion,
    tokenReceived: token,
  })

  return res.json({
    message: 'Synthetic key verified. Zero-privilege response returned.',
    canaryTriggered: true,
    decoyId: decoy.id,
    decoyName: decoy.name,
    eventId: result.event.id,
    incidentId: result.incident.id,
    riskScore: result.incident.riskScore,
    severity: result.incident.severity,
  })
})

// GET /api/internal/resource/:resourceId
canaryRouter.get('/internal/resource/:resourceId', (req: Request, res: Response) => {
  const rawResourceId = req.params.resourceId
  const resourceId = Array.isArray(rawResourceId) ? rawResourceId[0] : String(rawResourceId)
  const decoy = store.findDecoyByValueOrResource(resourceId)

  // Critical rule: Unknown resource must not be reported as a confirmed decoy hit
  if (!decoy || decoy.status === 'retired') {
    return res.status(404).json({
      error: `Resource '${resourceId}' not found in internal mesh catalogue`,
      canaryTriggered: false,
    })
  }

  const ip = extractClientIp(req)
  const rawUa = req.headers['user-agent']
  const userAgent = Array.isArray(rawUa) ? rawUa[0] : rawUa
  const result = handleCanaryTrigger({
    decoy,
    method: 'GET',
    path: req.originalUrl,
    ip,
    userAgent,
    protocol: req.protocol.toUpperCase() + '/' + req.httpVersion,
    tokenReceived: resourceId,
  })

  return res.json({
    message: 'Synthetic internal resource accessed (zero sensitive data exposed)',
    canaryTriggered: true,
    decoyId: decoy.id,
    decoyName: decoy.name,
    eventId: result.event.id,
    incidentId: result.incident.id,
    riskScore: result.incident.riskScore,
    severity: result.incident.severity,
  })
})

// GET /admin/export (also supports /api/admin/export if mounted on /api)
export function handleAdminExport(req: Request, res: Response) {
  const token = extractTokenFromRequest(req)
  if (!token) {
    return res.status(403).json({
      error: 'Forbidden: Export authorization token required',
      canaryTriggered: false,
    })
  }

  const decoy = store.findDecoyByValueOrResource(token)
  if (!decoy || decoy.status === 'retired') {
    return res.status(403).json({
      error: 'Forbidden: Invalid export authorization token',
      canaryTriggered: false,
    })
  }

  const ip = extractClientIp(req)
  const userAgent = getHeader(req.headers['user-agent'])
  const result = handleCanaryTrigger({
    decoy,
    method: 'GET',
    path: req.originalUrl,
    ip,
    userAgent,
    protocol: req.protocol.toUpperCase() + '/' + req.httpVersion,
    tokenReceived: token,
  })

  return res.json({
    message: 'Simulated admin export stream triggered. Zero real records exported.',
    canaryTriggered: true,
    decoyId: decoy.id,
    decoyName: decoy.name,
    eventId: result.event.id,
    incidentId: result.incident.id,
    riskScore: result.incident.riskScore,
    severity: result.incident.severity,
  })
}

canaryRouter.get('/admin/export', handleAdminExport)

// POST /api/canary/test-trigger (testing helper endpoint)
canaryRouter.post('/canary/test-trigger', (req: Request, res: Response) => {
  const { decoyId } = req.body
  if (!decoyId) {
    return res.status(400).json({ error: 'decoyId is required' })
  }

  const decoy = store.getDecoy(decoyId)
  if (!decoy) {
    return res.status(404).json({ error: `Decoy '${decoyId}' not found`, canaryTriggered: false })
  }

  if (decoy.status === 'retired') {
    return res.status(400).json({
      error: `Decoy '${decoyId}' has been retired and cannot be triggered`,
      canaryTriggered: false,
    })
  }

  const ip = extractClientIp(req)
  const userAgent = getHeader(req.headers['user-agent'])
  const result = handleCanaryTrigger({
    decoy,
    method: 'POST',
    path: `/api/canary/test-trigger (${decoy.name})`,
    ip,
    userAgent,
    protocol: 'HTTP/1.1',
    tokenReceived: decoy.syntheticValue,
  })

  return res.json({
    message: 'Canary test probe executed successfully',
    canaryTriggered: true,
    event: result.event,
    incident: result.incident,
    decoy: result.decoy,
  })
})
