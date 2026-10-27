import React from 'react'
import { Play, Square, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { SimulationConfig, SimulationStatus, ScenarioType } from '@/hooks/useSimulation'
import type { Decoy } from '@/types/decoy'

interface SimulationControlPanelProps {
  status: SimulationStatus
  config: SimulationConfig
  onConfigChange: (config: SimulationConfig) => void
  onRunSimulation: () => void
  onStopSimulation: () => void
  onResetSimulation: () => void
  decoys: Decoy[]
  errorMessage?: string | null
}

export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({
  status,
  config,
  onConfigChange,
  onRunSimulation,
  onStopSimulation,
  onResetSimulation,
  decoys,
  errorMessage,
}) => {
  const navigate = useNavigate()
  const isRunning = status === 'running'
  const activeDecoys = decoys.filter(
    (d) => d.status === 'active' || d.status === 'triggered' || d.status === 'staged'
  )

  const scenarioOptions: { value: ScenarioType; label: string; desc: string }[] = [
    {
      value: 'single_trigger',
      label: 'Single trigger',
      desc: 'Send one request to a decoy.',
    },
    {
      value: 'repeated_access',
      label: 'Repeated access',
      desc: 'Send several requests to one decoy.',
    },
    {
      value: 'multi_enumeration',
      label: 'Multiple decoys',
      desc: 'Check several decoys in sequence.',
    },
  ]

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E9E5]">
        <div>
          <h2 className="text-xs font-semibold text-[#17251F]">Choose a test</h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#FAFBF9] border border-[#E5E9E5]">
          <span
            className={`h-2 w-2 rounded-full ${
              status === 'running'
                ? 'bg-[#C47B24] animate-pulse'
                : status === 'completed'
                ? 'bg-[#267B58]'
                : status === 'failed'
                ? 'bg-[#C74646]'
                : 'bg-[#9BA69F]'
            }`}
          />
          <span className="capitalize text-[#17251F] font-medium">{status}</span>
        </div>
      </div>

      {/* No Active Decoys Warning */}
      {activeDecoys.length === 0 ? (
        <div className="p-3.5 rounded-xl bg-[#FFF8EE] border border-[#FCE6C9] text-xs text-[#C47B24] space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>No active decoys.</strong> Create one before running a test.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/decoys')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Create a decoy
          </Button>
        </div>
      ) : null}

      {/* Scenario Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#17251F]">
          Scenario
        </label>
        <div className="space-y-2">
          {scenarioOptions.map((opt) => {
            const isSelected = config.scenario === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isRunning}
                onClick={() => onConfigChange({ ...config, scenario: opt.value })}
                className={`w-full p-3 text-left rounded-xl border transition-all cursor-pointer focus-ring select-none ${
                  isSelected
                    ? 'border-[#176B4D] bg-[#E8F2EC] text-[#17251F]'
                    : 'border-[#E5E9E5] bg-white text-[#77847C] hover:bg-[#FAFBF9]'
                }`}
              >
                <div className="text-xs font-semibold text-[#17251F]">{opt.label}</div>
                <div className="text-[11px] text-[#77847C] mt-0.5 leading-relaxed">{opt.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Target Decoy Selection (for single & repeated scenarios) */}
      {config.scenario !== 'multi_enumeration' && (
        <Select
          label="Target Active Decoy"
          value={config.targetDecoyId}
          disabled={isRunning || activeDecoys.length === 0}
          onChange={(e) => onConfigChange({ ...config, targetDecoyId: e.target.value })}
          options={[
            { value: '', label: '-- Default (First Active Decoy) --' },
            ...activeDecoys.map((d) => ({
              value: d.id,
              label: `${d.name} (${d.type.replace(/_/g, ' ')}) [${d.id}]`,
            })),
          ]}
          helperText="Choose a decoy to test"
        />
      )}

      {/* Repeated Access Iteration Count */}
      {config.scenario === 'repeated_access' && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#17251F]">
            Number of requests
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                disabled={isRunning}
                onClick={() => onConfigChange({ ...config, repeatCount: cnt })}
                className={`py-2 text-xs font-medium rounded-xl border transition-all select-none ${
                  config.repeatCount === cnt
                    ? 'border-[#176B4D] bg-[#E8F2EC] text-[#176B4D] font-bold'
                    : 'border-[#E5E9E5] bg-white text-[#77847C] hover:bg-[#FAFBF9]'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#77847C]">
            Requests are sent one at a time.
          </p>
        </div>
      )}

      {config.scenario === 'multi_enumeration' && (
        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-[11px] text-[#77847C] leading-relaxed">
          <span className="font-semibold text-[#17251F]">Test plan: </span>
          Up to 3 decoys ({activeDecoys.length} available).
          {activeDecoys.length < 2 && (
            <span className="text-[#C47B24] font-medium block mt-1">
              Add another decoy to use this option.
            </span>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F7D4D4] text-xs text-[#C74646]">
          {errorMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#E5E9E5] flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={onResetSimulation}
          disabled={isRunning || status === 'idle'}
        >
          Reset
        </Button>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Square className="h-3.5 w-3.5" />}
              onClick={onStopSimulation}
            >
              Halt Scenario
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play className="h-3.5 w-3.5" />}
              onClick={onRunSimulation}
              disabled={activeDecoys.length === 0}
            >
              Run Scenario
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
