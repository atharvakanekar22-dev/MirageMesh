import { useContext } from 'react'
import {
  SettingsContext,
  type SettingsContextValue,
  type WorkspaceSettings,
  type SaveResult,
} from '@/context/settings-context-def'

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used inside <SettingsProvider>')
  }
  return ctx
}

export type { WorkspaceSettings, SaveResult, SettingsContextValue }
