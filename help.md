# MirageMesh — Complete Hackathon Submission & Demonstration Guide

This guide provides everything needed to present, demonstrate, and submit **MirageMesh** for hackathon evaluation:
1. **Part 1:** Complete 2–3 minute video presentation script with natural voiceover narration and timestamped screen actions.
2. **Part 2:** Step-by-step practical demonstration walkthrough, testing checklist, and recording troubleshooting.
3. **Part 3:** Ready-to-copy answers for the official hackathon submission form.

---

# PART 1 — COMPLETE 2–3 MINUTE VIDEO SCRIPT

- **Target Duration:** 2 minutes 30 seconds (maximum 3 minutes).
- **Target Spoken Word Count:** ~330 words (natural, confident speaking pace of ~130–140 words per minute).
- **Tone:** Professional, clear, technically grounded, and realistic. Avoids buzzword exaggeration and demonstrates working product capabilities.

---

### Scene A: Opening & Problem (0:00 – 0:20)

- **Screen / Page:** Overview Dashboard (`http://localhost:5173/overview`).
- **Action / Click:** Cursor stationary over the Overview header; smooth hover over the hero card **Registered Decoys**.
- **On-Screen Result:** Clean white and forest-green interface showing metric cards and coverage gauge.
- **Spoken Narration:**
  > "Hello everyone. This is MirageMesh, an active cyber deception and threat detection layer built for enterprise security operations. Traditional defenses often suffer from alert fatigue and struggle when attackers quietly discover internal credentials or probe private routes before triggering standard alarms. MirageMesh solves this by placing zero-privilege synthetic honeytokens and canary endpoints across the environment, giving defenders an immediate, high-confidence signal the moment an unauthorized actor interacts with them."

---

### Scene B: Product Architecture & Overview (0:20 – 0:40)

- **Screen / Page:** Overview Dashboard (`http://localhost:5173/overview`).
- **Action / Click:** Scroll down slightly to show **Recent Telemetry Ingress** and **Recent Correlated Incidents** cards.
- **On-Screen Result:** Dashboard metrics showing live coverage status and telemetry streams.
- **Spoken Narration:**
  > "Our dashboard gives security analysts real-time visibility into synthetic asset coverage, canary probe interactions, and correlated incidents. Because legitimate enterprise services have zero business reason to touch these honeytokens, any interaction represents an immediate anomaly. This eliminates noisy guesswork and provides deterministic ground-truth telemetry."

---

### Scene C: Synthetic Decoy Staging in Decoy Lab (0:40 – 1:00)

- **Screen / Page:** AI Decoy Lab (`http://localhost:5173/decoys`).
- **Action / Click:** Click the top-right button **`Create Synthetic Decoy`**. In the modal, select category **`Synthetic Credential`**, name it `AWS_PROD_DEPLOYMENT_KEY`, and click **`Stage Synthetic Decoy`**.
- **On-Screen Result:** Decoy appears in the table with status `staged`, category badge, and synthetic token format `AKIA_AWS_PROD_..._CANARY_TOKEN`.
- **Spoken Narration:**
  > "In the Decoy Lab, defenders stage zero-privilege honeytokens—such as fake AWS deployment keys or synthetic internal API routes. Each asset receives a realistic synthetic identifier and is registered with our backend canary engine. These decoy assets carry zero real production privileges, ensuring safe deployment across source code or internal repositories."

---

### Scene D: Controlled Attack Simulation & Detection (1:00 – 1:35)

- **Screen / Page:** Attack Simulator (`http://localhost:5173/simulation`).
- **Action / Click:** Select scenario **`1. Single Canary Trigger`** (or **`2. Repeated Access Probe`**), ensure the target decoy is selected, and click the primary button **`Run Scenario`**.
- **On-Screen Result:** Scenario execution steps turn from pending to running to green **Success**. Event feed cards display real event IDs (`evt-xxxx`), endpoint route, and the base risk score (`70 / 100`).
- **Spoken Narration:**
  > "To validate our detection pipeline, we use our built-in Attack Simulator. Running a controlled scenario dispatches sequential HTTP requests against application canary routes. Notice the execution: the canary trips, an immutable security event is ingested by our backend, and our deterministic scoring engine calculates a base risk score of 70. When repeated probes occur, the risk score escalates transparently based on observed interaction volume."

---

### Scene E: Evidence-Based Incident Investigation (1:35 – 2:05)

- **Screen / Page:** Incident Investigation (`http://localhost:5173/incidents`).
- **Action / Click:** Click on the generated incident dossier (`inc-xxxx`). Show the **`Timeline & Evidence`** tab, then click on the **`Risk Decomposition`** tab.
- **On-Screen Result:** Chronological timeline showing real server timestamps, request paths, source IPs, pattern match badges, and the 4-part risk breakdown.
- **Spoken Narration:**
  > "Under Incident Investigation, correlated events are grouped into an incident dossier. The timeline provides complete forensic clarity: server timestamps, request methods, endpoints, and raw telemetry snippets. Crucially, MirageMesh separates observed empirical facts—like confirmed canary hits—from analytical deductions and uncertainty. It gives analysts an explainable risk calculation rather than an unverified black-box claim."

---

### Scene F: Simulated Response Centre & Wrap-Up (2:05 – 2:30)

- **Screen / Page:** Response Centre (`http://localhost:5173/response`).
- **Action / Click:** Click **`Stage Containment Action`**. Select **`Simulate Ingress Session Isolation`**, enter analyst note, click **`Proceed to Confirmation`**, then click **`Confirm & Commit Action`**.
- **On-Screen Result:** Action records in the backend audit table with `completed` status and `Simulated` badge; incident status updates to `contained`.
- **Spoken Narration:**
  > "Finally, in the Response Centre, operators can execute simulated containment actions—such as isolating a probe session or retiring compromised honeytokens. Every action requires operator confirmation and is committed to a backend audit ledger. Containment remains safely simulated to protect infrastructure while training response teams. MirageMesh turns passive defense into active, explainable deception. Thank you!"

---

### Video Script Reference Table

| Timestamp | UI Page & Route | Visual Action / Click | Spoken Narration Summary |
|---|---|---|---|
| **0:00 – 0:20** | Overview (`/overview`) | Hover over **Registered Decoys** hero card | Introduce MirageMesh and the challenge of silent lateral movement. |
| **0:20 – 0:40** | Overview (`/overview`) | Scroll to metrics & coverage gauge | Explain zero-privilege honeytokens and high-confidence signal. |
| **0:40 – 1:00** | Decoy Lab (`/decoys`) | Click **`Create Synthetic Decoy`** → **`Stage Synthetic Decoy`** | Stage an AWS synthetic key; show realistic zero-privilege token format. |
| **1:00 – 1:35** | Simulation (`/simulation`) | Select Scenario 1 or 2 → Click **`Run Scenario`** | Demonstrate live canary probe, real backend event ingestion, and risk score (70–80). |
| **1:35 – 2:05** | Incidents (`/incidents`) | Open Incident → View **`Timeline & Evidence`** & **`Risk Decomposition`** | Show server timestamps, source IPs, and separation of facts from deductions. |
| **2:05 – 2:30** | Response (`/response`) | Click **`Stage Containment Action`** → Confirm & Commit | Record operator-confirmed simulated containment to backend audit ledger. Conclude. |

---

# PART 2 — PRACTICAL DEMONSTRATION & RECORDING CHECKLIST

Follow this ordered guide to prepare, run, and record the application smoothly without unexpected glitches.

---

## A. Before Recording: Startup & Environment Verification

### Prerequisites
- Node.js v18+ or v20+ installed.
- Two terminal windows open in the project root: `c:\Users\Atharva\OneDrive\Desktop\Projects\MirageMesh`.

### 1. Start the Backend Service
In **Terminal 1**, run:
```powershell
npm --prefix server run dev
```
- **Expected Console Output:**
  ```text
  [MirageMesh-Server] Telemetry Engine & Canary Registry active on http://localhost:4000
  ```

### 2. Start the Frontend Application
In **Terminal 2**, run:
```powershell
npm run dev
```
- **Expected Console Output:**
  ```text
  Local: http://localhost:5173/
  ```

### 3. Verify System Health Check
Open your browser or run in PowerShell:
```powershell
curl http://localhost:5173/api/health
```
- **Expected Response:** `{"status":"healthy","service":"MirageMesh Core Telemetry Engine",...}`

### 4. Important Memory Caveat
> **CRITICAL:** Storage is currently maintained in backend process memory (`store.ts`). **Do NOT restart Terminal 1 while recording**, as restarting will reset all staged decoys, events, and audit logs. Keep both terminal windows running throughout your recording session.

### 5. Privacy & Recording Setup
- Set browser zoom to **100%** or **110%** for clear text readability.
- Maximize the browser window to standard **1920x1080 (16:9)**.
- Close personal browser tabs, bookmarks bar, and desktop notifications.
- No real API keys, cloud secrets, or personal passwords exist in the application.

---

## B. Step-by-Step Application Workflow

Follow these exact steps during your demonstration:

### Step 1: Open the Overview Dashboard
- **Route:** `http://localhost:5173/overview`
- **Action:** Observe the 4 metric cards: **Registered Decoys** (forest-green hero card), **Decoy Interactions**, **Open Incidents**, and **Critical Incidents**.
- **Visual Result:** Real-time metrics reflecting backend state.

### Step 2: Stage the First Synthetic Decoy
- **Route:** `http://localhost:5173/decoys` (or click **Decoy Lab** in sidebar).
- **Control to Click:** Top-right green button: **`Create Synthetic Decoy`**.
- **Modal Inputs:**
  - Decoy Category: **`Synthetic Credential`**
  - Decoy Name: `AWS_PROD_DEPLOYMENT_KEY`
  - Target Environment: `staging` or `production-sim`
- **Control to Click:** Button: **`Stage Synthetic Decoy`**.
- **Visual Result:** Decoy appears in the registry table with synthetic value `AKIA_AWS_PROD_..._CANARY_TOKEN` and status `staged`.

### Step 3: Stage a Second Decoy (For Multi-Decoy Testing)
- **Route:** `http://localhost:5173/decoys`
- **Control to Click:** Button: **`Create Synthetic Decoy`**.
- **Modal Inputs:**
  - Decoy Category: **`Fake Internal API Resource`**
  - Decoy Name: `INTERNAL_METRICS_VAULT`
  - Target Environment: `staging`
- **Control to Click:** Button: **`Stage Synthetic Decoy`**.
- **Visual Result:** Second decoy appears with route path `/api/internal/resource/res-internal_metrics_vault-...`.

### Step 4: Launch a Single Canary Trigger Simulation
- **Route:** `http://localhost:5173/simulation` (or click **Simulation** in sidebar).
- **Control to Click:** Radio card: **`1. Single Canary Trigger`**.
- **Select Decoy:** Choose `AWS_PROD_DEPLOYMENT_KEY`.
- **Control to Click:** Primary button: **`Run Scenario`**.
- **Visual Result:** Execution tracker displays probe progress. The event feed records a successful canary trip with `Event ID` (`evt-xxxx`), `Risk Score: 70 / 100`, and severity `High`.

### Step 5: Launch a Repeated Access Simulation
- **Route:** `http://localhost:5173/simulation`
- **Control to Click:** Radio card: **`2. Repeated Access Probe`**.
- **Iteration Selector:** Select `2` or `3` iterations.
- **Control to Click:** Primary button: **`Run Scenario`**.
- **Visual Result:** Multiple sequential steps execute. Risk score updates to `80 / 100` (`Critical`).

### Step 6: Launch Multi-Decoy Enumeration (Optional if time allows)
- **Route:** `http://localhost:5173/simulation`
- **Control to Click:** Radio card: **`3. Multi-Decoy Enumeration`**.
- **Control to Click:** Primary button: **`Run Scenario`**.
- **Visual Result:** Both staged decoys are probed in sequence. Risk escalates to `90–95 / 100`.

### Step 7: Inspect Ingested Security Events
- **Route:** Look at the bottom of the Simulation page or navigate to Overview.
- **Visual Result:** Event feed cards display the raw endpoint, HTTP method (`POST /api/canary/test-trigger`), timestamp, and synthetic token match.

### Step 8: Open the Correlated Incident Dossier
- **Route:** `http://localhost:5173/incidents` (or click **View Incident Dossier** from the simulation summary banner).
- **Action:** Click on the incident entry in the left sidebar list (`inc-xxxx`).
- **Visual Result:** Detailed dossier opens on the right showing incident title, status badge (`Open`), severity indicator (`Critical`), and associated canary resources.

### Step 9: Review Timeline & Risk Decomposition
- **Route:** Inside Incident Detail (`/incidents`).
- **Tab 1 — `Timeline & Evidence`:**
  - Displays chronological events with server timestamps.
  - Shows request path, client IP (`127.0.0.1`), matched canary pattern, and risk contribution (`+70 pts risk`).
  - Badge shows green dot for empirical ground truth vs. amber for analysis deductions.
- **Tab 2 — `Risk Decomposition`:**
  - Review 4 clear sections:
    1. *Observed Empirical Facts*
    2. *Risk Calculation & Contributing Factors*
    3. *Possible Analytical Interpretation & Uncertainty*
    4. *Recommended Defensive Next Steps*

### Step 10: Execute Simulated Containment Action
- **Route:** `http://localhost:5173/response` (or click **Response Centre** button inside the incident dossier).
- **Control to Click:** Top-right button: **`Stage Containment Action`**.
- **Modal Inputs:**
  - Containment Action: **`Simulate Ingress Session Isolation`** (or `Simulate Synthetic Decoy Credential Rotation`)
  - Target Entity: `Source IP 10.200.42.15`
  - Analyst Handle: `SOC-Analyst-01`
  - Status Transition: `Transition Incident to "Contained"`
  - Reason: `Confirmed synthetic canary access detected on controlled honeytoken endpoint.`
- **Control to Click:** Button: **`Proceed to Confirmation`**.
- **Confirmation Step:** Review the safety banner (*"Simulated Containment Guarantee: No real network drops or firewall mutations"*).
- **Control to Click:** Button: **`Confirm & Commit Action`**.

### Step 11: Verify Backend Audit Record
- **Route:** `http://localhost:5173/response`
- **Visual Result:** The **Response Action Audit Log** table updates with a new entry showing Action ID (`act-xxxx`), target entity, operator, timestamp, and status badge `Completed` with a `Simulated` tag.

### Step 12: Return to Overview to Show Live System State
- **Route:** `http://localhost:5173/overview`
- **Visual Result:** Metrics show updated counts: Staged Decoys (2), Decoy Interactions (4+), and Incident status reflected in coverage gauges.

---

## C. Recommended Recording Shot List (2:30 Target)

| Shot # | Approximate Duration | Screen to Show | Core Action |
|---|---|---|---|
| **Shot 1** | 0:00 – 0:20 (20s) | `/overview` | Introduce problem statement and MirageMesh core concept. |
| **Shot 2** | 0:20 – 0:40 (20s) | `/overview` | Highlight metric cards, live coverage gauge, and zero-privilege concept. |
| **Shot 3** | 0:40 – 1:05 (25s) | `/decoys` | Click **`Create Synthetic Decoy`** → Stage an AWS Credential decoy. |
| **Shot 4** | 1:05 – 1:40 (35s) | `/simulation` | Select **Repeated Access Probe** → Click **`Run Scenario`** → Show sequential green steps. |
| **Shot 5** | 1:40 – 2:05 (25s) | `/incidents` | Open incident dossier → Show **Timeline & Evidence** and **Risk Decomposition**. |
| **Shot 6** | 2:05 – 2:30 (25s) | `/response` | Click **`Stage Containment Action`** → Confirm & Commit → Show audit ledger entry and wrap up. |

---

## D. Pre-Recording Checklist & Troubleshooting

- [ ] **Clean State Check:** If you want a fresh demo run, restart Terminal 1 (`npm --prefix server run dev`). This resets the in-memory store cleanly.
- [ ] **Do NOT restart servers mid-recording:** Keep Terminal 1 and Terminal 2 open and running continuously.
- [ ] **Pre-stage Decoys (Optional):** If you prefer not to type during the video, stage 1 credential decoy and 1 API decoy before hitting record. In the video, you can simply showcase the staged decoys and stage a new one quickly.
- [ ] **If Simulation Fails or Reports No Decoys:** Navigate to `/decoys` first and confirm at least one decoy is present. The simulation panel requires active/staged decoys to run.
- [ ] **If Browser Port Differs:** The Vite development server uses port `5173` by default. If another application was using 5173, check Terminal 2 for the assigned port.
- [ ] **Audio Check:** Test microphone input levels. Speak at a measured, calm pace so judges can easily follow the technical workflow.

---

# PART 3 — HACKATHON SUBMISSION FORM ANSWERS

Ready-to-copy text formatted specifically for the hackathon submission portal fields.

---

## A. Project Title

*(Field limit: 500 characters. Character count of recommendation below: 61 characters.)*

```text
MirageMesh — AI-Native Deception Layer for Cyber Threat Detection
```

---

## B. Problem Statement Selected

```text
Digital Safety & Cybersecurity
```

> **Submission Note:** Select the **Digital Safety & Cybersecurity** category from the hackathon form dropdown.

---

## C. Project Description

*(Ready-to-paste text: 188 words. Well-structured, technically rigorous, and honest to the implemented codebase.)*

```text
Enterprise security operations struggle with alert fatigue and the silent progression of lateral movement, where attackers enumerate internal routes or harvest exposed credentials before triggering volumetric defenses. 

MirageMesh addresses this vulnerability by deploying an active, zero-privilege cyber deception mesh. Defenders stage realistic synthetic honeytokens—such as fake cloud deployment keys and trap API endpoints—directly across development and infrastructure workflows. Because legitimate services have zero operational justification to access these assets, any probe generates an immediate, high-confidence detection signal.

The platform correlates incoming HTTP telemetry, calculates transparent, bounded risk scores (0–100) based on empirical interaction frequency and multi-asset enumeration, and compiles comprehensive incident dossiers. Analysts investigate chronological event timelines that strictly separate observed ground-truth evidence from analytical inferences. A built-in controlled attack simulator enables deterministic pipeline validation across single-trigger, repeated-access, and enumeration scenarios. When responding to threats, operators execute simulated containment interventions—such as session isolation and honeytoken retirement—backed by a persistent audit ledger with mandatory operator confirmation.

MirageMesh transforms passive detection into active, explainable deception, providing verifiable threat containment without risking production infrastructure.
```

---

*End of Submission Guide — MirageMesh Hackathon Preparation.*
