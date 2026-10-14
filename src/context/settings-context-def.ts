import { createContext } from 'react'

export const STORAGE_KEY = 'miragemesh_workspace_settings'

export interface WorkspaceSettings {
  workspaceName: string
  operatorHandle: string
  notifyOnHighSeverity: boolean
  notifyOnDecoyTrip: boolean
}

export const DEFAULTS: WorkspaceSettings = {
  workspaceName: 'Primary SecOps Staging Mesh',
  operatorHandle: 'SecOps-Operator',
  notifyOnHighSeverity: true,
  notifyOnDecoyTrip: true,
}

export function loadSettings(): WorkspaceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<WorkspaceSettings>
    return {
      workspaceName:
        typeof parsed.workspaceName === 'string' && parsed.workspaceName.trim()
          ? parsed.workspaceName
          : DEFAULTS.workspaceName,
      operatorHandle:
        typeof parsed.operatorHandle === 'string' && parsed.operatorHandle.trim()
          ? parsed.operatorHandle
          : DEFAULTS.operatorHandle,
      notifyOnHighSeverity:
        typeof parsed.notifyOnHighSeverity === 'boolean'
          ? parsed.notifyOnHighSeverity
          : DEFAULTS.notifyOnHighSeverity,
      notifyOnDecoyTrip:
        typeof parsed.notifyOnDecoyTrip === 'boolean'
          ? parsed.notifyOnDecoyTrip
          : DEFAULTS.notifyOnDecoyTrip,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export type SaveResult = { ok: true } | { ok: false; error: string }

export interface SettingsContextValue {
  settings: WorkspaceSettings
  saveSettings: (next: WorkspaceSettings) => SaveResult
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
