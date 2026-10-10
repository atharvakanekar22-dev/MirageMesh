import type {
  Decoy,
  SecurityEvent,
  Incident,
  SeverityLevel,
  RiskFactor,
  IncidentAnalysis,
} from './types.js'
import { store } from './store.js'

export function computeRiskScore(
  totalEvents: number,
  distinctDecoyCount: number
): {
  score: number
  severity: SeverityLevel
  baseContribution: number
  repeatContribution: number
  enumerationContribution: number
} {
  const baseContribution = 70

  // Bounded repeat interaction contribution (up to +15 pts, +5 per repeat event)
  const repeatContribution = Math.min(15, Math.max(0, (totalEvents - 1) * 5))

  // Bounded enumeration contribution for accessing multiple distinct decoys (up to +15 pts, +10 per additional decoy)
  const enumerationContribution = Math.min(
    15,
    Math.max(0, (distinctDecoyCount - 1) * 10)
  )

  const rawScore = baseContribution + repeatContribution + enumerationContribution
  const score = Math.min(100, Math.max(0, rawScore))

  let severity: SeverityLevel
  if (score >= 75) {
    severity = 'critical'
  } else if (score >= 50) {
    severity = 'high'
  } else if (score >= 25) {
    severity = 'medium' // Guarded band (25-49)
  } else {
    severity = 'low'
  }

  return {
    score,
    severity,
    baseContribution,
    repeatContribution,
    enumerationContribution,
  }
}

export interface CanaryTriggerParams {
  decoy: Decoy
  method: string
  path: string
  ip: string
  userAgent?: string
  protocol?: string
  tokenReceived?: string
  rawSnippet?: string
}

export function handleCanaryTrigger(params: CanaryTriggerParams): {
  event: SecurityEvent
  incident: Incident
  decoy: Decoy
} {
  const { decoy, method, path, ip, userAgent, protocol = 'HTTP/1.1', tokenReceived, rawSnippet } = params

  // 1. Update decoy trigger count and status
  const updatedDecoy = store.incrementDecoyTrigger(decoy.id) || decoy

  // 2. Create Security Event
  const eventId = `evt-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5)}`
  const event: SecurityEvent = {
    id: eventId,
    eventType: 'decoy_access_attempt',
    timestamp: new Date().toISOString(),
    decoyId: decoy.id,
    sourceIdentifier: ip ? `${ip} (Client Probe)` : 'Unknown Source',
    severity: 'high',
    evidence: {
      protocol,
      method,
      pathOrKey: path,
      userAgent: userAgent || 'Unknown User-Agent',
      sourceIP: ip || '127.0.0.1',
      matchedPattern: tokenReceived || decoy.syntheticValue,
      rawTelemetrySnippet:
        rawSnippet ||
        `${method} ${path} ${protocol}\nHost: canary-ingress\nDecoy-Matched: ${decoy.id} (${decoy.name})`,
    },
    simulation: false,
    correlationTags: ['canary-trip', decoy.type, 'high-confidence-telemetry'],
  }
  store.recordEvent(event)

  // 3. Find active open incident to update, or create a new incident
  const activeIncident = store.getActiveIncident()

  let incident: Incident
  if (activeIncident) {
    // Update existing incident
    const relatedEventIds = Array.from(new Set([...activeIncident.relatedEventIds, eventId]))
    const relatedDecoyIds = Array.from(new Set([...activeIncident.relatedDecoyIds, decoy.id]))

    const {
      score,
      severity,
      baseContribution,
      repeatContribution,
      enumerationContribution,
    } = computeRiskScore(relatedEventIds.length, relatedDecoyIds.length)

    // Update event severity to match evaluated incident severity
    event.severity = severity

    const riskFactors: RiskFactor[] = [
      {
        dimension: 'Confirmed Decoy Interaction',
        scoreWeight: baseContribution,
        justification:
          'Observed HTTP request directly targeted active synthetic canary resource without authorized business function.',
        isObservedFact: true,
      },
      {
        dimension: 'Repeated Interactions',
        scoreWeight: repeatContribution,
        justification: `${relatedEventIds.length} confirmed canary trip event(s) recorded against internal monitoring endpoints.`,
        isObservedFact: true,
      },
      {
        dimension: 'Multi-Decoy Enumeration',
        scoreWeight: enumerationContribution,
        justification: `${relatedDecoyIds.length} distinct synthetic decoy asset(s) probed in telemetry correlation window.`,
        isObservedFact: true,
      },
      {
        dimension: 'High-Confidence Anomaly Signal',
        scoreWeight: 0,
        justification:
          'High-confidence security signal indicating synthetic token discovery or internal route traversal. Zero-production baseline deviation.',
        isObservedFact: false,
      },
    ]

    const analysis: IncidentAnalysis = {
      summary:
        'High-confidence security signal triggered by interaction with zero-privilege synthetic honeytoken. No real production data exposed.',
      threatVector: 'Synthetic Canary Resource Interaction',
      confidenceScore: 98,
      observedFacts: [
        `Direct request received to controlled canary endpoint: ${path}`,
        `Matched active decoy: ${decoy.name} (${decoy.id})`,
        `Telemetry triggers logged: ${relatedEventIds.length}`,
        `Distinct decoy assets touched: ${relatedDecoyIds.length}`,
        `Source IP: ${ip}`,
      ],
      inferredHypotheses: [
        'Potential unauthorized internal enumeration or leaked synthetic credential trial',
        'Source may be scanning application routing paths or verifying harvested tokens',
      ],
      recommendedMitigations: [
        'Throttle or isolate originating client session at API gateway',
        'Retire and re-seed synthetic canary token in staging configurations',
        'Inspect upstream logs for preceding reconnaissance queries',
      ],
    }

    incident = {
      ...activeIncident,
      title: `High-Confidence Canary Trigger: ${decoy.name}${
        relatedDecoyIds.length > 1 ? ` (+${relatedDecoyIds.length - 1} decoys)` : ''
      }`,
      riskScore: score,
      severity,
      relatedEventIds,
      relatedDecoyIds,
      updatedAt: new Date().toISOString(),
      riskFactors,
      analysis,
    }
    store.saveIncident(incident)
  } else {
    // Create new incident
    const relatedEventIds = [eventId]
    const relatedDecoyIds = [decoy.id]

    const {
      score,
      severity,
      baseContribution,
      repeatContribution,
      enumerationContribution,
    } = computeRiskScore(relatedEventIds.length, relatedDecoyIds.length)

    event.severity = severity

    const riskFactors: RiskFactor[] = [
      {
        dimension: 'Confirmed Decoy Interaction',
        scoreWeight: baseContribution,
        justification:
          'Observed HTTP request directly targeted active synthetic canary resource without authorized business function.',
        isObservedFact: true,
      },
      {
        dimension: 'Repeated Interactions',
        scoreWeight: repeatContribution,
        justification: `Initial interaction observed (1 trigger recorded).`,
        isObservedFact: true,
      },
      {
        dimension: 'Multi-Decoy Enumeration',
        scoreWeight: enumerationContribution,
        justification: `Single canary asset interacted with.`,
        isObservedFact: true,
      },
      {
        dimension: 'High-Confidence Anomaly Signal',
        scoreWeight: 0,
        justification:
          'High-confidence security signal indicating synthetic token discovery. Zero-production baseline deviation.',
        isObservedFact: false,
      },
    ]

    const analysis: IncidentAnalysis = {
      summary:
        'High-confidence security signal triggered by interaction with zero-privilege synthetic honeytoken. No real production data exposed.',
      threatVector: 'Synthetic Canary Resource Interaction',
      confidenceScore: 98,
      observedFacts: [
        `Direct request received to controlled canary endpoint: ${path}`,
        `Matched active decoy: ${decoy.name} (${decoy.id})`,
        `Telemetry triggers logged: 1`,
        `Distinct decoy assets touched: 1`,
        `Source IP: ${ip}`,
      ],
      inferredHypotheses: [
        'Potential unauthorized internal enumeration or leaked synthetic credential trial',
      ],
      recommendedMitigations: [
        'Throttle or isolate originating client session at API gateway',
        'Retire and re-seed synthetic canary token in staging configurations',
      ],
    }

    const incidentId = `inc-${Date.now().toString().slice(-4)}`
    incident = {
      id: incidentId,
      title: `High-Confidence Canary Trigger: ${decoy.name}`,
      riskScore: score,
      severity,
      status: 'open',
      relatedEventIds,
      relatedDecoyIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedAnalyst: 'MirageMesh Automated Ingestion',
      riskFactors,
      analysis,
    }
    store.saveIncident(incident)
  }

  return { event, incident, decoy: updatedDecoy }
}
