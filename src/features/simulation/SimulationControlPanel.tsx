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
      label: '1. Single Canary Trigger',
      desc: 'Dispatches one request to an active decoy endpoint (establishes base risk score of 70).',
    },
    {
      value: 'repeated_access',
      label: '2. Repeated Access Probe',
      desc: 'Repeats requests against the same decoy to verify bounded repeat interaction scoring (75–85).',
    },
    {
      value: 'multi_enumeration',
      label: '3. Multi-Decoy Enumeration',
      desc: 'Sequentially accesses multiple distinct registered decoys to test environment scanning scoring (85–100).',
    },
  ]

  return (
    <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E9E5]">
        <div>
          <h2 className="text-xs font-semibold text-[#17251F]">Controlled Scenario Controls</h2>
          <p className="text-[11px] text-[#77847C]">
            Execute safe synthetic canary tests against registered application endpoints
          </p>
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
              <strong>No Active Decoys Found:</strong> Simulations require at least one staged or active decoy to trigger controlled canary routes.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/decoys')}
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Go to Decoy Lab to Stage Decoy
          </Button>
        </div>
      ) : null}

      {/* Scenario Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[#17251F]">
          Select Attack Simulation Scenario
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
          helperText="Select which active canary resource will receive controlled test traffic"
        />
      )}

      {/* Repeated Access Iteration Count */}
      {config.scenario === 'repeated_access' && (
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#17251F]">
            Sequential Probe Iterations
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
                {cnt} Probes
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#77847C]">
            Dispatches sequential requests with 650ms intervals to test repeat interaction bounds.
          </p>
        </div>
      )}

      {config.scenario === 'multi_enumeration' && (
        <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-[11px] text-[#77847C] leading-relaxed">
          <span className="font-semibold text-[#17251F]">Enumeration Target Plan: </span>
          Will sequentially probe up to 3 distinct active registered decoys (currently {activeDecoys.length} active in mesh).
          {activeDecoys.length < 2 && (
            <span className="text-[#C47B24] font-medium block mt-1">
              Note: Multi-decoy enumeration requires at least 2 decoys. Please create another in Decoy Lab.
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
          Reset View
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
