# MirageMesh — Active Cyber Deception & Autonomous Honeytoken Ingestion Platform

> **Next-Generation Incident Response & Deception Operations Platform**  
> Built with a high-fidelity forest-green & minimal white design system, zero-production impact guarantees, deterministic threat scoring, and simulated containment workflows.

---
## 🚀 Live Demo

**Live Application:** [MirageMesh — Open Dashboard](https://miragemesh.onrender.com)

MirageMesh is an AI-native, deception-based cyber threat detection platform that simulates attack interactions, correlates security events, and provides explainable incident analysis and simulated response actions.

> **Note:** The live demo may take a little time to wake up after inactivity. Some demonstration data may reset when the server restarts.
## 1. Product Overview & The Problem Addressed

Traditional perimeter defenses, signature-based EDRs, and volumetric SIEM tools suffer from significant alert fatigue and delayed detection of lateral movement. Attackers who obtain internal credentials or enumerate internal API routes can silently traverse enterprise environments without tripping conventional alarms.

**MirageMesh** flips this dynamic by deploying lightweight, low-interaction **synthetic honeytokens** and **canary assets** (zero-privilege credentials, mock API routes, and trap database identifiers) directly into enterprise workflows.

- **High-Confidence Signal**: Legitimate internal operators and services have zero operational justification to access synthetic decoys. A trip on a canary token represents an unambiguous anomaly.
- **Controlled Deception**: All deployed assets carry zero production privileges. Attackers probing these endpoints receive realistic yet synthetic responses while generating instant telemetry.
- **Deterministic Threat Scoring**: A transparent, bounded scoring engine (0–100) weighs empirical canary touches, repeat interactions, and multi-asset enumeration without opaque black-box scoring.
- **Safe Containment & Auditability**: Enables security analysts to practice and record simulated defensive containment workflows with mandatory operator sign-off and backend audit ledger persistence.

---

## 2. Architecture & Major Components

MirageMesh follows a clean decoupled client-server architecture:

```
[ Frontend: React 19 + TypeScript + Vite + Tailwind CSS ]
   │
   │   (Vite Reverse Proxy on /api and /admin in development;
   │    or direct CORS-authenticated requests via VITE_API_BASE_URL)
   ▼
[ Backend: Node.js + Express + TypeScript + Zod ]
   ├── Configurable CORS Policy & In-Memory Rate Limiting (300 req/min)
   ├── Decoy Registry (CRUD for credentials & API endpoints)
   ├── Canary Detection Engine & Webhook Endpoints
   │     ├── /api/internal/keys (Token verification trap)
   │     ├── /api/internal/resource/:resourceId (Route traversal trap)
   │     └── /admin/export (High-privilege honeytoken export trap)
   ├── Deterministic Risk Scoring & Incident Correlation Engine
   └── Response Centre & Audit Ledger (/api/response/actions)
```

## Screenshots Of the Working Web-Application:

<img width="911" height="515" alt="image" src="https://github.com/user-attachments/assets/c3cb312e-c36a-435a-a5d1-4ce6a2087435" />

<img width="383" height="485" alt="image" src="https://github.com/user-attachments/assets/941e8f64-5654-4248-8b3b-6cad8e7ff2cb" />

<img width="932" height="499" alt="image" src="https://github.com/user-attachments/assets/eef76aef-a88c-47b8-89cf-1bbe8353e772" />

<img width="932" height="513" alt="image" src="https://github.com/user-attachments/assets/b5ccaa46-879b-4fdf-a745-a5c0c3a04518" />

<img width="583" height="479" alt="image" src="https://github.com/user-attachments/assets/cf11bd13-9803-4e8b-a992-ae1dbfa148f3" />

<img width="1164" height="963" alt="image" src="https://github.com/user-attachments/assets/1edc999f-5f0d-4139-98d8-3004f058e4de" />





### Major Components

| Component | Technology | Role |
|---|---|---|
| **Decoy Lab** | React UI + REST API | Generates and manages synthetic assets (AWS keys, internal API endpoints) with strict naming conventions. |
| **Canary Detection Engine** | Express + Zod | Ingests real HTTP probe telemetry, verifies honeytokens against active decoys, rejects retired assets, and logs security events. |
| **Attack Simulator** | React + Sequential Probing | Dispatches sequential controlled requests against application canary routes to validate detection pipelines. |
| **Investigation Dossier** | React + Telemetry Visualizer | Chronological event timeline displaying server timestamps, HTTP routes, client IPs, pattern matches, and point contributions. |
| **Explainable Incident Analysis** | Deterministic Heuristics | Transparent 4-part breakdown: Observed Facts, Risk Calculation, Analytical Interpretation & Uncertainty, and Next Steps. |
| **Response Centre** | Audit Ledger Store | Provides operator-confirmed simulated containment actions (session isolation, credential rotation, case resolution). |

---

## 3. Features Actually Implemented

- **Priority 1: Functional Attack Simulator**
  - Three sequential controlled scenarios:
    1. *Single Canary Trigger*: Probes one active synthetic decoy.
    2. *Repeated Access*: Probes the same decoy across multiple sequential iterations.
    3. *Multi-Decoy Enumeration*: Sequentially touches distinct decoys to simulate lateral reconnaissance.
  - Step-by-step progress cards, real event IDs, risk score progression, and navigation jump to the resulting incident dossier.
  - Honest disabled states while scenarios execute and clear empty states if no decoys are staged.
- **Priority 2: Investigation Timeline**
  - Correlated security events sorted chronologically by server timestamp.
  - Displays HTTP method, route path, client IP, pattern match, evidence snippet, and risk points.
  - Clear visual distinction between ground truth observed facts (forest-green badge) and analytical deductions (amber badge).
- **Priority 3: Explainable Incident Analysis**
  - Fully deterministic, explainable risk model separated into four clear sections:
    1. *Observed Empirical Facts*
    2. *Risk Calculation & Contributing Factors*
    3. *Possible Analytical Interpretation & Uncertainty* (explicitly stating attacker identity is unconfirmed)
    4. *Recommended Defensive Next Steps*
- **Priority 4: Simulated Response Centre**
  - Backend audit ledger at `/api/response/actions` recording action type, target entity, operator ID, and timestamp.
  - Mandatory operator confirmation step before containment execution.
  - Automatic incident status progression (`investigating`, `contained`, `resolved`).
  - Automatic retirement of compromised synthetic honeytokens.
  - Strict non-production simulation flags on every audit record.

---

## 4. Prerequisites & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Installation Steps

1. Clone or extract the repository:
   ```bash
   cd MirageMesh
   ```

2. Install root dependencies (Frontend):
   ```bash
   npm install
   ```

3. Install server dependencies (Backend):
   ```bash
   npm --prefix server install
   ```

---

## 5. Environment Configuration

Configuration templates are provided via `.env.example`. Environment files (`.env`, `.env.*`) are ignored by version control to prevent secret leakage.

### Server Environment (`server/.env` or root `.env`)

```ini
# Backend Port
PORT=4000

# Environment Mode
NODE_ENV=development

# Allowed CORS Origins (comma-separated, no wildcards in production)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173

# Optional: Frontend API Base URL (leave blank for local Vite proxy development)
VITE_API_BASE_URL=
```

---

## 6. Exact Startup Commands

Run the backend and frontend in two separate terminal windows:

### Terminal 1: Backend Daemon
```bash
npm --prefix server run dev
```
*Starts the Express Telemetry Engine with live TypeScript reload on `http://localhost:4000`.*

### Terminal 2: Frontend Client
```bash
npm run dev
# or: npx vite --port 5173
```
*Starts the Vite development server with proxy routing on `http://localhost:5173`.*

---

## 7. Test, Lint & Production Build Commands

| Target | Command | Description |
|---|---|---|
| **Full-Stack Production Build** | `npm run build` | Compiles frontend to `dist/` and backend TypeScript to `server/dist/`. |
| **Full-Stack Production Run** | `npm start` | Runs Express server in production, serving API and static SPA on `PORT`. |
| **Full-Stack Production Suite** | `npm run test:prod` | Validates health, SPA fallback routing, static assets, API 404 guard, and telemetry endpoints. |
| **Backend Unit & Canary Tests** | `npm --prefix server run test` | Validates input validation, decoy generation, canary detection, repeat scoring, and export routes. |
| **Backend TypeScript Build** | `npm --prefix server run build` | Compiles server TypeScript to `server/dist/`. |
| **Frontend Linter** | `npm run lint` | Runs `oxlint` across all frontend React/TypeScript source files (0 errors, 0 warnings). |
| **Frontend Production Build** | `npm run build:client` | Runs `tsc -b && vite build` to generate optimized client bundle in `dist/`. |
| **Development Integration Test** | `node test-phase3-e2e.mjs` | Executes full proxy validation through Vite dev proxy on `localhost:5173`. |

---

## 8. End-to-End Demonstration Steps

Follow these exact steps to demonstrate the complete workflow:

1. **Step 1: Stage Synthetic Decoys (Decoy Lab)**
   - Open browser to `http://localhost:5173/decoys`.
   - Click **Deploy/Add New Decoy**.
   - Create a synthetic credential (`AWS_PROD_DEPLOYMENT_KEY`, environment: `production-sim`).
   - Create a second decoy of type internal API endpoint (`INTERNAL_METRICS_TELEMETRY`, environment: `staging`).
2. **Step 2: Run Controlled Attack Simulator (`/simulation`)**
   - Navigate to `/simulation`.
   - **Scenario 1 (Single Canary Trigger)**: Select the credential decoy, click **Execute Scenario**. Observe the real request hit `/api/canary/test-trigger`. The event feed logs the event ID and initial risk score (70).
   - **Scenario 2 (Repeated Access)**: Select Repeated Access with 2 iterations and click **Execute Scenario**. Telemetry records repeat interactions, escalating the risk score to 80.
   - **Scenario 3 (Multi-Decoy Enumeration)**: Select Multi-Decoy Enumeration and click **Execute Scenario**. Both decoys are probed sequentially, escalating the score to 90–95.
3. **Step 3: Investigate Correlated Incident Dossier (`/incidents`)**
   - Click **View Incident Dossier** or navigate to `/incidents`.
   - Open the generated incident (`inc-xxxx`).
   - In **Correlated Telemetry Timeline**, inspect each event showing real server timestamps, HTTP method, route path, client IP, pattern match, and risk points.
   - In **Explainable Incident Analysis**, observe the 4 structured panels:
     - *Observed Facts*: Confirmed decoy interaction, repeat hits, multi-decoy access.
     - *Risk Calculation*: Deterministic point weights (+70, +15, +10).
     - *Analytical Interpretation*: High confidence signal; explicitly highlights that external attacker identity remains unverified.
     - *Recommended Next Steps*: Containment recommendations.
4. **Step 4: Execute Operator-Confirmed Simulated Response (`/response`)**
   - Navigate to `/response`.
   - Click **Execute Containment Action**.
   - Select the target incident, choose **Simulate Session Isolation**, enter an operator justification note, check **Operator Confirmation**, and click **Execute 
---
Mirage-Mesh Security --
## 9. Security Boundaries & Current Limitations

MirageMesh is designed with strict application security controls:

1. **In-Memory Storage Volatility**: The backend telemetry store and audit ledger currently reside in process memory. Restarting the backend service resets decoys, events, incidents, and audit logs.
2. **Strictly Simulated Containment**: All response actions (session isolation, credential revocation) remain strictly synthetic and within application test boundaries. They do **not** invoke cloud IAM APIs, WAFs, or firewalls.
3. **Deterministic Scoring Thresholds**: Risk scoring uses deterministic heuristic bounds (capped at 100), rather than external threat intelligence feeds or AI APIs.
4. **No Artificial Attribution**: The platform does not fabricate external threat actor names, MITRE ATT&CK tactic mappings, or geographic origin data without verified empirical telemetry.
5. **Rate Limiting & Body Limits**: Public-facing endpoints are protected with a 100kb request body limit and an in-memory sliding window rate limiter (300 requests/minute per IP) to prevent denial-of-service.

---

## 10. Deployment Readiness & Render Deployment Instructions

MirageMesh is fully configured for deployment on **Render** as **ONE full-stack Web Service** serving both the compiled React SPA and the Node.js/Express telemetry engine under **one single public URL**.

### Render Web Service Configuration (Dashboard Settings)

When creating a new Web Service on [Render](https://dashboard.render.com/):

| Setting Field | Value | Notes |
|---|---|---|
| **Service Type** | **Web Service** | Single unified full-stack service. |
| **Runtime** | **Node** | Node.js v18+ runtime. |
| **Branch** | `main` | Or your primary deployment branch. |
| **Root Directory** | *(leave blank)* | Builds from the repository root. |
| **Build Command** | `npm install --include=dev && npm run build` *(or `npm run render-build`)* | Installs root dependencies with `--include=dev`, automatically triggers server installation via `postinstall`, builds client to `dist/`, and compiles server to `server/dist/`. |
| **Start Command** | `node server/dist/index.js` *(or `npm start`)* | Starts the Express server which binds to `0.0.0.0:$PORT` and serves the frontend. |
| **Health Check Path** | `/api/health` | Verified endpoint returning HTTP 200 with JSON health status. |

### Environment Variables on Render

Configure the following under **Environment** in the Render Dashboard:

| Variable | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | **Required**. Enables production logging, secure error handling, and frontend static asset caching. |
| `PORT` | *(auto-assigned by Render)* | **Do not override**. Render injects `$PORT` (e.g. `10000`). Express automatically reads `process.env.PORT` and binds to `0.0.0.0`. |
| `ALLOWED_ORIGINS` | *(optional)* | Render services automatically allow their own `*.onrender.com` domain. If you attach a custom domain (e.g. `https://miragemesh.example.com`), provide it here as a comma-separated list. |
| `VITE_API_BASE_URL` | *(leave empty / unset)* | **Leave empty**. In unified deployment, frontend uses relative same-origin `/api/...` calls. Do not point to an external URL. |

---

### Alternative: One-Click Render Blueprint (`render.yaml`)

This repository includes a [`render.yaml`](./render.yaml) specification file. To deploy via Blueprint:
1. Push your changes to GitHub.
2. In the Render Dashboard, click **New +** -> **Blueprint**.
3. Select your `MirageMesh` repository.
4. Render will automatically parse `render.yaml` and configure the Web Service, build command, start command, and health check path.

---

### Post-Deployment Verification Checklist

Once your service status turns **Available** on Render:
1. **Health Check**: Visit `https://<your-service>.onrender.com/api/health` to confirm `{ "status": "healthy" }`.
2. **Frontend Entry Point**: Visit `https://<your-service>.onrender.com` to confirm automatic redirection to `/overview` and the forest-green dashboard.
3. **Deep Links**: Refresh on `/decoys`, `/simulation`, `/incidents`, `/response`, or `/settings` to verify that client-side SPA routing resolves without 404s.
4. **API Isolation**: Verify that `https://<your-service>.onrender.com/api/invalid-route` returns a 404 JSON response instead of the frontend HTML.
5. **Decoy Simulation**: Create a synthetic credential in **Decoy Lab**, run a controlled attack scenario in **Simulation**, and verify the correlated incident in **Incidents**.

---

*MirageMesh — Verified, Tested, and Submission-Ready.*
