# MirageMesh Server — Backend Telemetry & Deception Engine

Node.js / Express backend service powering the MirageMesh Active Deception platform.

## Features & Endpoints

- **Health Check**: `GET /api/health`
- **Decoy Registry**:
  - `GET /api/decoys` — List all registered decoys
  - `POST /api/decoys` — Create synthetic credential or internal API endpoint decoy
  - `GET /api/decoys/:id` — Retrieve decoy details
- **Canary Detection & Ingress Traps**:
  - `GET /api/internal/keys` — Token verification trap endpoint
  - `GET /api/internal/resource/:resourceId` — Route traversal trap endpoint
  - `GET /admin/export` / `GET /api/admin/export` — Controlled export honeytoken trap endpoint
  - `POST /api/canary/test-trigger` — Sequential controlled simulation helper endpoint
- **Security Telemetry**:
  - `GET /api/events` — Retrieve ingested security events
  - `GET /api/events/:id` — Retrieve specific event
- **Incident Dossiers & Risk Scoring**:
  - `GET /api/incidents` — Correlated incidents with deterministic risk factors
  - `GET /api/incidents/:id` — Incident details with evidence timeline
  - `PATCH /api/incidents/:id/status` — Operator status update
- **Response Actions & Audit Ledger**:
  - `GET /api/response/actions` — Audit log of operator containment actions
  - `POST /api/response/actions` — Record simulated containment action with operator justification
  - `DELETE /api/response/actions` — Clear audit log

## Security & Architecture Notes

- **In-Memory Volatility**: The store operates in memory for zero-dependency rapid deployment. Server restarts reset state.
- **Rate Limiting**: Protected with an in-memory sliding window rate limiter (300 requests/minute per IP) on all `/api/` endpoints.
- **Request Size Limiting**: Body size capped at 100kb (`express.json({ limit: '100kb' })`).
- **CORS Protection**: Configurable allowed origins via `ALLOWED_ORIGINS` environment variable.
- **Safe Containment**: All response interventions remain strictly simulated.
