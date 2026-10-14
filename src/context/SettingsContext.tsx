/**
 * SettingsContext — single source of truth for user-configurable workspace preferences.
 *
 * Storage: localStorage (browser-local only). Values are NOT shared across users or devices.
 * Persistence: survives page reloads within the same browser profile.
 */
import React, { useState, useCallback, type ReactNode } from 'react'
import {
  SettingsContext,
  STORAGE_KEY,
  loadSettings,
  type WorkspaceSettings,
  type SaveResult,
} from './settings-context-def'

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WorkspaceSettings>(loadSettings)

  const saveSettings = useCallback((next: WorkspaceSettings): SaveResult => {
    const name = next.workspaceName.trim()
    const handle = next.operatorHandle.trim()

    if (!name) {
      return { ok: false, error: 'Workspace name cannot be empty.' }
    }
    if (!handle) {
      return { ok: false, error: 'Operator handle cannot be empty.' }
    }
    if (name.length > 80) {
      return { ok: false, error: 'Workspace name must be 80 characters or fewer.' }
    }
    if (handle.length > 40) {
      return { ok: false, error: 'Operator handle must be 40 characters or fewer.' }
    }

    const validated: WorkspaceSettings = {
      ...next,
      workspaceName: name,
      operatorHandle: handle,
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))
    } catch {
      return { ok: false, error: 'Could not persist settings: browser storage unavailable.' }
    }

    setSettings(validated)
    return { ok: true }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
