import React, { useState } from 'react'
import {
  Bell,
  Cpu,
  Check,
  Info,
  Server,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const SettingsPage: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('Primary SecOps Staging Mesh')
  const [operatorId, setOperatorId] = useState('SecOps-Operator')
  const [notifyOnHighSeverity, setNotifyOnHighSeverity] = useState(true)
  const [notifyOnDecoyTrip, setNotifyOnDecoyTrip] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Workspace configuration and platform parameters. Note: Server-side integrations and AI model credentials are managed through backend environment variables in later phases."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={isSaved ? <Check className="h-3.5 w-3.5" /> : undefined}
          >
            {isSaved ? 'Preferences Saved' : 'Save Preferences'}
          </Button>
        }
      />

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
              label="Active Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              helperText="Identifies this deception cluster in notifications"
            />

            <Input
              label="Default Operator Handle"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              helperText="Default attribution handle recorded in containment audit logs"
            />
          </div>
        </div>

        {/* Alert & Notification Preferences */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#E5E9E5]">
            <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
              <Bell className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17251F]">Notification Signals</h2>
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
                <div className="font-semibold">Immediate Canary Trip Alerts</div>
                <div className="text-[11px] text-[#77847C] mt-0.5">
                  Dispatch high-priority notifications whenever a synthetic decoy honeytoken is queried
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
                <div className="font-semibold">Critical Incident Threshold Notifications</div>
                <div className="text-[11px] text-[#77847C] mt-0.5">
                  Notify on composite incident risk score evaluations exceeding threshold of 75/100
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
              <h2 className="text-sm font-semibold text-[#17251F]">
                AI Provider Integration Status
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#E8F2EC] text-[#176B4D] border border-[#C8DFD4] font-medium">
              Server-Side Environment (Phase 4)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-xs text-[#77847C] space-y-2">
            <div className="flex items-center gap-2 text-[#17251F] font-semibold">
              <Info className="h-4 w-4 text-[#176B4D]" />
              <span>Production Security Architecture Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              MirageMesh adheres strictly to enterprise credential isolation. AI model keys (e.g.
              Gemini API keys) are never requested or stored within browser localStorage. In Phase
              4, server-side environment variables (`GEMINI_API_KEY`) manage all authenticated
              reasoning pipelines.
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
              <div className="font-semibold text-[#176B4D] mt-1 font-mono">Staged (Phase 4)</div>
            </div>
          </div>
        </div>

        {/* Platform Information */}
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#E5E9E5]">
            <div className="p-2 rounded-xl bg-[#E8F2EC] text-[#176B4D]">
              <Server className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-[#17251F]">Platform & Build Info</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Release</span>
              <div className="text-[#17251F] font-semibold mt-1">v0.1.0-mesh</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Frontend Engine</span>
              <div className="text-[#17251F] font-semibold mt-1">React 19 + Vite</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Type System</span>
              <div className="text-[#267B58] font-semibold mt-1">Strict TS</div>
            </div>
            <div>
              <span className="text-[10px] text-[#77847C] uppercase font-medium">Design System</span>
              <div className="text-[#176B4D] font-semibold mt-1">Forest Green Light</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
