import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { decoyRouter } from './routes/decoys.js'
import { canaryRouter, handleAdminExport } from './routes/canary.js'
import { eventRouter } from './routes/events.js'
import { incidentRouter } from './routes/incidents.js'
import { responseRouter } from './routes/response.js'
import { store } from './store.js'

export const app = express()

// Resolve frontend dist directory (supports running from repository root or server directory)
const serverDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd()
const candidateDistPaths = [
  path.resolve(serverDir, '../../dist'),
  path.resolve(serverDir, '../dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(process.cwd(), '../dist'),
]
const clientDistPath = candidateDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')))

// Configurable CORS policy (no open wildcard)
const rawAllowedOrigins = process.env.ALLOWED_ORIGINS
const allowedOrigins = rawAllowedOrigins
  ? rawAllowedOrigins.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173']

if (process.env.RENDER_EXTERNAL_URL) {
  const renderOrigin = process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '')
  if (!allowedOrigins.includes(renderOrigin)) {
    allowedOrigins.push(renderOrigin)
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, same-origin browser fetches, server-to-server) or localhost dev / Render domains
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true)
      }
      return callback(new Error(`CORS origin '${origin}' not allowed by security policy`), false)
    },
    credentials: true,
  })
)

// Request body size limit to prevent payload flooding (100kb limit)
app.use(express.json({ limit: '100kb' }))

// Lightweight in-memory rate limiting middleware for telemetry & simulation protection
interface RateLimitBucket {
  count: number
  resetTime: number
}
const rateLimitMap = new Map<string, RateLimitBucket>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 300 // Generous ceiling for high-velocity simulation runs

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  // Always permit health checks and non-API frontend asset/page requests without rate limiting
  if (
    req.path.startsWith('/api/health') ||
    (!req.path.startsWith('/api') && !req.path.startsWith('/admin'))
  ) {
    return next()
  }

  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
  const ip = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0].trim()
  const now = Date.now()
  let bucket = rateLimitMap.get(ip)

  if (!bucket || now > bucket.resetTime) {
    bucket = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS }
    rateLimitMap.set(ip, bucket)
  } else {
    bucket.count++
  }

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW)
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - bucket.count))

  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.ceil((bucket.resetTime - now) / 1000)
    res.setHeader('Retry-After', retryAfterSec)
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit threshold reached. Please throttle probe dispatches.',
      retryAfterSeconds: retryAfterSec,
      canaryTriggered: false,
    })
  }

  next()
}

app.use(rateLimitMiddleware)

// Request logger for observability
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now()
  const originalEnd = _res.end
  _res.end = function (...args: any[]) {
    const duration = Date.now() - start
    if (!req.path.startsWith('/api/health')) {
      console.log(`[MirageMesh-Server] ${req.method} ${req.originalUrl} -> ${_res.statusCode} (${duration}ms)`)
    }
    return (originalEnd as any).apply(_res, args)
  }
  next()
})

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MirageMesh Core Telemetry Engine',
    decoysCount: store.getDecoys().length,
    eventsCount: store.getEvents().length,
    incidentsCount: store.getIncidents().length,
  })
})

// Decoy Registry routes
app.use('/api/decoys', decoyRouter)

// Canary Detection routes on /api
app.use('/api', canaryRouter)

// Direct root /admin/export support for canary detection testing
app.get('/admin/export', handleAdminExport)

// Event and Incident Telemetry routes
app.use('/api/events', eventRouter)
app.use('/api/incidents', incidentRouter)

// Containment Response Audit routes
app.use('/api/response', responseRouter)

// 404 Handler for unhandled API and admin requests (must NOT fall through to HTML)
app.all(['/api', '/api/*', '/admin', '/admin/*'], (req: Request, res: Response) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`,
    canaryTriggered: false,
  })
})

// Serve static frontend assets and SPA routes in production / when build output exists
if (clientDistPath) {
  app.use(express.static(clientDistPath))

  // SPA fallback for all remaining GET requests (e.g. /overview, /decoys, /simulation, /incidents, /response, /settings)
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// 404 Handler for any remaining unhandled non-GET requests
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`,
    canaryTriggered: false,
  })
})

// Centralized error handler (no stack trace exposure)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[MirageMesh-Server Error]:', err?.message || err)
  const statusCode =
    typeof err?.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : 'Request error',
    message:
      process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected internal error occurred'
        : err?.message || 'Unexpected failure',
    canaryTriggered: false,
  })
})

const PORT = Number(process.env.PORT) || 4000
const HOST = '0.0.0.0'

const isMainModule = Boolean(
  (typeof require !== 'undefined' && require.main === module) ||
    (process.argv[1] &&
      (process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('index.js')))
)

if (isMainModule) {
  app.listen(PORT, HOST, () => {
    console.log(`[MirageMesh-Server] Telemetry Engine & Canary Registry active on http://${HOST}:${PORT} (port ${PORT})`)
    if (clientDistPath) {
      console.log(`[MirageMesh-Server] Serving full-stack UI from: ${clientDistPath}`)
    }
  })
}
