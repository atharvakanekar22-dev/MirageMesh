import React, { useState } from 'react'
import {
  Bell,
  Cpu,
  Check,
  Info,
  Server,
  Layers,
  AlertCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSettings } from '@/hooks/useSettings'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export const SettingsPage: React.FC = () => {
  const { settings, saveSettings } = useSettings()

  // Local draft state — only committed on explicit save
  const [workspaceName, setWorkspaceName] = useState(settings.workspaceName)
  const [operatorHandle, setOperatorHandle] = useState(settings.operatorHandle)
  const [notifyOnHighSeverity, setNotifyOnHighSeverity] = useState(settings.notifyOnHighSeverity)
  const [notifyOnDecoyTrip, setNotifyOnDecoyTrip] = useState(settings.notifyOnDecoyTrip)

  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveState('saving')
    setSaveError(null)

    const result = saveSettings({
      workspaceName,
      operatorHandle,
      notifyOnHighSeverity,
      notifyOnDecoyTrip,
    })

    if (result.ok) {
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    } else {
      setSaveState('error')
      setSaveError(result.error)
    }
  }

  const isSaved = saveState === 'saved'
  const isError = saveState === 'error'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={isSaved ? <Check className="h-3.5 w-3.5" /> : undefined}
          >
            {isSaved ? 'Saved' : 'Save Preferences'}
          </Button>
        }
      />


      {/* Error banner */}
      {isError && saveError && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#FDF2F2] border border-[#F7D4D4] text-xs text-[#C74646]">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Workspace Identity */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#E5E9E5]">
            <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17251F]">Workspace Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Workspace name"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value)
                if (saveState !== 'idle') setSaveState('idle')
              }}
              helperText="Shown in the header."
              maxLength={80}
            />

            <Input
              label="Operator name"
              value={operatorHandle}
              onChange={(e) => {
                setOperatorHandle(e.target.value)
                if (saveState !== 'idle') setSaveState('idle')
              }}
              helperText="Shown in activity records."
              maxLength={40}
            />
          </div>
        </div>

        {/* Alert & Notification Preferences */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#E5E9E5]">
            <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17251F]">Notification Preferences</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] cursor-pointer hover:bg-[#F3F6F3] transition-colors">
              <input
                type="checkbox"
                checked={notifyOnDecoyTrip}
                onChange={(e) => setNotifyOnDecoyTrip(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5E9E5] text-[#176B4D] focus:ring-[#176B4D]"
              />
              <div className="text-[#17251F]">
                <div className="font-semibold">Canary Trip Alerts</div>
                <div className="text-[11px] text-[#77847C] mt-0.5">
                  Notify when a synthetic decoy is accessed
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] cursor-pointer hover:bg-[#F3F6F3] transition-colors">
              <input
                type="checkbox"
                checked={notifyOnHighSeverity}
                onChange={(e) => setNotifyOnHighSeverity(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5E9E5] text-[#176B4D] focus:ring-[#176B4D]"
              />
              <div className="text-[#17251F]">
                <div className="font-semibold">High-Severity Incident Alerts</div>
                <div className="text-[11px] text-[#77847C] mt-0.5">
                  Notify when incident risk score exceeds 75/100
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* AI Provider Configuration Status */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E9E5]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
                <Cpu className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-[#17251F]">AI Provider Status</h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#E8F2EC] text-[#176B4D] border border-[#C8DFD4] font-medium">
              Server-Managed
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-xs text-[#77847C] space-y-2">
            <div className="flex items-center gap-2 text-[#17251F] font-semibold">
              <Info className="h-4 w-4 text-[#176B4D]" />
              <span>Credential Isolation Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              AI model credentials (e.g. API keys) are managed exclusively through backend environment variables. No secrets are stored or exposed in the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
              <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Provider</span>
              <div className="font-semibold text-[#17251F] mt-1">Google Gemini API</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
              <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Channel</span>
              <div className="font-semibold text-[#77847C] mt-1">Server Proxy</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5]">
              <span className="text-[10px] text-[#77847C] uppercase font-mono font-medium">Status</span>
              <div className="font-semibold text-[#176B4D] mt-1 font-mono">Staged</div>
            </div>
          </div>
        </div>

        {/* Platform Information */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#E5E9E5]">
            <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
              <Server className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17251F]">Platform Info</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Release</span>
              <div className="text-[#17251F] font-semibold mt-1">v0.1.0-mesh</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Frontend</span>
              <div className="text-[#17251F] font-semibold mt-1">React 19 + Vite</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Type System</span>
              <div className="text-[#267B58] font-semibold mt-1">Strict TS</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Design</span>
              <div className="text-[#176B4D] font-semibold mt-1">Forest Green</div>
            </div>
          </div>
        </div>

        {/* Bottom Save (duplicate for long-page UX) */}
        <div className="flex justify-end gap-3 pt-2">
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#267B58]">
              <Check className="h-3.5 w-3.5" />
              Preferences saved locally
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            type="submit"
            leftIcon={isSaved ? <Check className="h-3.5 w-3.5" /> : undefined}
          >
            {isSaved ? 'Saved' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  )
}
