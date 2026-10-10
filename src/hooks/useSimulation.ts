import { useState, useCallback, useRef } from 'react'
import type { SecurityEvent } from '@/types/event'
import type { Decoy } from '@/types/decoy'
import { api } from '@/lib/api'

export type ScenarioType = 'single_trigger' | 'repeated_access' | 'multi_enumeration'
export type SimulationStatus = 'idle' | 'running' | 'completed' | 'stopped' | 'failed'

export interface SimulationConfig {
  scenario: ScenarioType
  targetDecoyId: string
  repeatCount: number
}

export interface SimulationStepRecord {
  stepIndex: number
  decoyId: string
  decoyName: string
  endpoint: string
  status: 'pending' | 'running' | 'success' | 'failed'
  eventId?: string
  riskScore?: number
  message: string
  timestamp: string
}

export interface SimulationRunSummary {
  scenario: ScenarioType
  totalSteps: number
  successCount: number
  failureCount: number
  affectedDecoyIds: string[]
  resultingIncidentId?: string
  resultingRiskScore?: number
  startedAt: string
  completedAt: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useSimulation() {
  const [status, setStatus] = useState<SimulationStatus>('idle')
  const [config, setConfig] = useState<SimulationConfig>({
    scenario: 'single_trigger',
    targetDecoyId: '',
    repeatCount: 3,
  })
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [steps, setSteps] = useState<SimulationStepRecord[]>([])
  const [summary, setSummary] = useState<SimulationRunSummary | null>(null)
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [completedAt, setCompletedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isCancelledRef = useRef(false)

  const stopSimulation = useCallback(() => {
    isCancelledRef.current = true
    setStatus('stopped')
    setCompletedAt(new Date().toISOString())
  }, [])

  const resetSimulation = useCallback(() => {
    setStatus('idle')
    setEvents([])
    setSteps([])
    setSummary(null)
    setStartedAt(null)
    setCompletedAt(null)
    setError(null)
    isCancelledRef.current = false
  }, [])

  const runSimulation = useCallback(
    async (
      availableDecoys: Decoy[],
      onRefresh?: () => Promise<void>
    ) => {
      // 1. Validation
      setError(null)
      isCancelledRef.current = false

      // Filter active registered decoys (active or triggered)
      const activeDecoys = availableDecoys.filter(
        (d) => d.status === 'active' || d.status === 'triggered' || d.status === 'staged'
      )

      if (activeDecoys.length === 0) {
        setError('No active decoys found. Please stage or activate a synthetic decoy in Decoy Lab before running a simulation.')
        return
      }

      // Determine targets based on scenario
      let plan: { decoy: Decoy; endpoint: string; label: string }[] = []

      if (config.scenario === 'single_trigger') {
        const target =
          activeDecoys.find((d) => d.id === config.targetDecoyId) || activeDecoys[0]
        plan = [
          {
            decoy: target,
            endpoint: target.type === 'credential' ? '/api/internal/keys' : `/api/internal/resource/${target.id}`,
            label: `Single Canary Probe against ${target.name}`,
          },
        ]
      } else if (config.scenario === 'repeated_access') {
        const target =
          activeDecoys.find((d) => d.id === config.targetDecoyId) || activeDecoys[0]
        const count = Math.max(2, Math.min(5, config.repeatCount || 3))
        plan = Array.from({ length: count }, (_, i) => ({
          decoy: target,
          endpoint: target.type === 'credential' ? '/api/internal/keys' : `/api/internal/resource/${target.id}`,
          label: `Repeated Probe iteration ${i + 1} of ${count}`,
        }))
      } else if (config.scenario === 'multi_enumeration') {
        // Multi-decoy: access distinct active decoys sequentially
        const targets = activeDecoys.slice(0, 3)
        if (targets.length < 2) {
          setError('Multi-decoy enumeration requires at least 2 registered decoys. Please create another decoy in Decoy Lab.')
          return
        }
        plan = targets.map((t, idx) => ({
          decoy: t,
          endpoint: t.type === 'credential' ? '/api/internal/keys' : `/api/internal/resource/${t.id}`,
          label: `Multi-decoy enumeration probe #${idx + 1} (${t.name})`,
        }))
      }

      setStatus('running')
      const startTime = new Date().toISOString()
      setStartedAt(startTime)
      setCompletedAt(null)
      setSteps(
        plan.map((p, idx) => ({
          stepIndex: idx + 1,
          decoyId: p.decoy.id,
          decoyName: p.decoy.name,
          endpoint: p.endpoint,
          status: 'pending',
          message: 'Waiting for execution queue...',
          timestamp: new Date().toISOString(),
        }))
      )

      const executedEvents: SecurityEvent[] = []
      const affectedDecoyIds = new Set<string>()
      let successCount = 0
      let failureCount = 0
      let lastIncidentId: string | undefined
      let lastRiskScore: number | undefined

      for (let i = 0; i < plan.length; i++) {
        if (isCancelledRef.current) {
          break
        }

        const item = plan[i]
        const stepNum = i + 1

        // Mark step as running
        setSteps((prev) =>
          prev.map((s) =>
            s.stepIndex === stepNum
              ? { ...s, status: 'running', message: `Dispatching controlled probe to ${item.endpoint}...` }
              : s
          )
        )

        try {
          // Perform real canary test trigger through backend API
          const response = await api.triggerCanaryTest(item.decoy.id)

          if (response && response.event) {
            successCount++
            executedEvents.unshift(response.event)
            affectedDecoyIds.add(item.decoy.id)
            lastIncidentId = response.incident?.id
            lastRiskScore = response.incident?.riskScore

            setEvents((prev) => [response.event, ...prev])

            setSteps((prev) =>
              prev.map((s) =>
                s.stepIndex === stepNum
                  ? {
                      ...s,
                      status: 'success',
                      eventId: response.event.id,
                      riskScore: response.incident?.riskScore,
                      message: `Confirmed canary trip. Event ${response.event.id} recorded. Risk score updated to ${response.incident?.riskScore || 70}.`,
                      timestamp: new Date().toISOString(),
                    }
                  : s
              )
            )
          } else {
            throw new Error('Canary endpoint returned unexpected response format')
          }
        } catch (err: any) {
          failureCount++
          setSteps((prev) =>
            prev.map((s) =>
              s.stepIndex === stepNum
                ? {
                    ...s,
                    status: 'failed',
                    message: `Controlled probe failed: ${err?.message || 'Network error'}. Zero attack indicators claimed.`,
                    timestamp: new Date().toISOString(),
                  }
                : s
            )
          )
        }

        // Brief delay between sequential probe steps to guarantee predictable ordering
        if (i < plan.length - 1 && !isCancelledRef.current) {
          await sleep(650)
        }
      }

      const endTime = new Date().toISOString()
      setCompletedAt(endTime)
      setStatus(isCancelledRef.current ? 'stopped' : failureCount === plan.length ? 'failed' : 'completed')

      setSummary({
        scenario: config.scenario,
        totalSteps: plan.length,
        successCount,
        failureCount,
        affectedDecoyIds: Array.from(affectedDecoyIds),
        resultingIncidentId: lastIncidentId,
        resultingRiskScore: lastRiskScore,
        startedAt: startTime,
        completedAt: endTime,
      })

      // Trigger telemetry refresh so Overview and Incidents immediately reflect new events
      if (onRefresh) {
        try {
          await onRefresh()
        } catch {
          // ignore
        }
      }
    },
    [config]
  )

  return {
    status,
    config,
    setConfig,
    events,
    steps,
    summary,
    startedAt,
    completedAt,
    error,
    runSimulation,
    stopSimulation,
    resetSimulation,
  }
}
