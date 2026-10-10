import type {
  Decoy,
  CreateDecoyInput,
  DecoyCategory,
  SecurityEvent,
  Incident,
  ContainmentAction,
} from './types.js'

function generateSyntheticValue(type: DecoyCategory, name: string): string {
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : 'canary-seed'
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
  switch (type) {
    case 'credential':
      return `AKIA_${slug.toUpperCase().slice(0, 8)}_${rand}_CANARY_TOKEN`
    case 'api_endpoint':
      return `/api/internal/resource/res-${slug}-${rand.toLowerCase()}`
    case 'database_record':
      return `mongodb+srv://synthetic-${slug}-${rand.toLowerCase()}:mesh-canary@db.internal/${slug}_shadow`
    case 'package_identifier':
      return `@internal-corp/${slug}-telemetry-sdk@0.0.1`
    default:
      return `canary-${slug}-${rand}`
  }
}

export class MemoryStore {
  private decoys = new Map<string, Decoy>()
  private events: SecurityEvent[] = []
  private incidents = new Map<string, Incident>()

  // Decoy operations
  getDecoys(): Decoy[] {
    return Array.from(this.decoys.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  getDecoy(id: string): Decoy | undefined {
    return this.decoys.get(id)
  }

  findDecoyByValueOrResource(identifier: string): Decoy | undefined {
    const cleanId = identifier.trim().toLowerCase()
    for (const decoy of this.decoys.values()) {
      if (decoy.id.toLowerCase() === cleanId) return decoy
      if (decoy.syntheticValue.toLowerCase() === cleanId) return decoy
      if (decoy.syntheticValue.toLowerCase().includes(cleanId)) return decoy
      // match path suffix or prefix
      if (cleanId.includes(decoy.id.toLowerCase())) return decoy
    }
    return undefined
  }

  createDecoy(input: CreateDecoyInput): Decoy {
    const idSuffix = Date.now().toString().slice(-4) + Math.random().toString(36).substring(2, 5)
    const typePrefix = input.type.slice(0, 3)
    const id = `decoy-${typePrefix}-${idSuffix}`
    const syntheticValue = input.syntheticValue?.trim()
      ? input.syntheticValue.trim()
      : generateSyntheticValue(input.type, input.name)

    const newDecoy: Decoy = {
      id,
      name: input.name,
      type: input.type,
      syntheticValue,
      status: 'active',
      createdAt: new Date().toISOString(),
      triggerCount: 0,
      metadata: {
        environment: input.environment || 'staging',
        namingConvention: input.namingConvention,
        description: input.description,
      },
    }

    this.decoys.set(id, newDecoy)
    return newDecoy
  }

  updateDecoy(id: string, updates: Partial<Decoy>): Decoy | undefined {
    const existing = this.decoys.get(id)
    if (!existing) return undefined
    const updated = { ...existing, ...updates }
    this.decoys.set(id, updated)
    return updated
  }

  incrementDecoyTrigger(id: string): Decoy | undefined {
    const existing = this.decoys.get(id)
    if (!existing) return undefined
    const updated: Decoy = {
      ...existing,
      triggerCount: existing.triggerCount + 1,
      lastTriggeredAt: new Date().toISOString(),
      status: 'triggered',
    }
    this.decoys.set(id, updated)
    return updated
  }

  deleteDecoy(id: string): boolean {
    return this.decoys.delete(id)
  }

  // Event operations
  recordEvent(event: SecurityEvent): SecurityEvent {
    this.events.unshift(event)
    return event
  }

  getEvents(): SecurityEvent[] {
    return [...this.events]
  }

  getEventsByDecoy(decoyId: string): SecurityEvent[] {
    return this.events.filter((e) => e.decoyId === decoyId)
  }

  // Incident operations
  getIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  getIncident(id: string): Incident | undefined {
    return this.incidents.get(id)
  }

  getActiveIncident(): Incident | undefined {
    return Array.from(this.incidents.values()).find(
      (i) => i.status === 'open' || i.status === 'investigating'
    )
  }

  saveIncident(incident: Incident): Incident {
    this.incidents.set(incident.id, incident)
    return incident
  }

  updateIncidentStatus(id: string, status: Incident['status']): Incident | undefined {
    const existing = this.incidents.get(id)
    if (!existing) return undefined
    const updated: Incident = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    }
    this.incidents.set(id, updated)
    return updated
  }

  clearAllIncidents(): void {
    this.incidents.clear()
  }

  // Response Action Audit Ledger
  private actions: ContainmentAction[] = []

  recordAction(action: ContainmentAction): ContainmentAction {
    this.actions.unshift(action)
    return action
  }

  getActions(): ContainmentAction[] {
    return [...this.actions]
  }

  clearActions(): void {
    this.actions = []
  }

  reset(): void {
    this.decoys.clear()
    this.events = []
    this.incidents.clear()
    this.actions = []
  }
}

export const store = new MemoryStore()
