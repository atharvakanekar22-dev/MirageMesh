import type { Decoy, CreateDecoyInput } from '@/types/decoy'
import type { SecurityEvent } from '@/types/event'
import type { Incident } from '@/types/incident'
import type { ContainmentAction, ContainmentActionType } from '@/types/response'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || ''

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch {
    throw new Error(
      'The MirageMesh API is not running. Start the project with "npm run dev" and try again.'
    )
  }

  if (!response.ok) {
    let errorMsg =
      response.status === 502
        ? 'The MirageMesh API is not running. Start the project with "npm run dev" and try again.'
        : `HTTP ${response.status}`
    try {
      const errorJson = await response.json()
      errorMsg = errorJson.error || errorJson.message || errorMsg
    } catch {
      // ignore
    }
    throw new Error(errorMsg)
  }

  return response.json()
}

export const api = {
  // Decoys
  async getDecoys(): Promise<Decoy[]> {
    const data = await fetchJson<{ decoys: Decoy[] }>('/api/decoys')
    return data.decoys || []
  },

  async createDecoy(input: CreateDecoyInput): Promise<Decoy> {
    const data = await fetchJson<{ decoy: Decoy }>('/api/decoys', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return data.decoy
  },

  async updateDecoyStatus(id: string, status: Decoy['status']): Promise<Decoy> {
    const data = await fetchJson<{ decoy: Decoy }>(`/api/decoys/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return data.decoy
  },

  async deleteDecoy(id: string): Promise<void> {
    await fetchJson<{ success: boolean }>(`/api/decoys/${id}`, {
      method: 'DELETE',
    })
  },

  // Events
  async getEvents(): Promise<SecurityEvent[]> {
    const data = await fetchJson<{ events: SecurityEvent[] }>('/api/events')
    return data.events || []
  },

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    const data = await fetchJson<{ incidents: Incident[] }>('/api/incidents')
    return data.incidents || []
  },

  async updateIncidentStatus(id: string, status: Incident['status']): Promise<Incident> {
    const data = await fetchJson<{ incident: Incident }>(`/api/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return data.incident
  },

  // Controlled Canary Triggering
  async triggerCanaryTest(decoyId: string): Promise<{
    event: SecurityEvent
    incident: Incident
    decoy: Decoy
  }> {
    return fetchJson('/api/canary/test-trigger', {
      method: 'POST',
      body: JSON.stringify({ decoyId }),
    })
  },

  async probeResourceEndpoint(resourceId: string): Promise<any> {
    return fetchJson(`/api/internal/resource/${encodeURIComponent(resourceId)}`)
  },

  async probeKeyEndpoint(token: string): Promise<any> {
    return fetchJson('/api/internal/keys', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  async probeAdminExport(token: string): Promise<any> {
    return fetchJson(`/admin/export?token=${encodeURIComponent(token)}`)
  },

  // Response Centre Actions
  async getResponseActions(): Promise<ContainmentAction[]> {
    const data = await fetchJson<{ actions: ContainmentAction[] }>('/api/response/actions')
    return data.actions || []
  },

  async recordResponseAction(payload: {
    incidentId: string
    actionType: ContainmentActionType
    targetEntity: string
    reason: string
    operator: string
    newIncidentStatus?: Incident['status']
  }): Promise<{ action: ContainmentAction; simulated: boolean; message: string }> {
    return fetchJson('/api/response/actions', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async clearResponseActions(): Promise<void> {
    await fetchJson('/api/response/actions', {
      method: 'DELETE',
    })
  },
}
