import { useState, useCallback, useEffect } from 'react'
import type { ContainmentAction, ContainmentActionType } from '@/types/response'
import type { Incident } from '@/types/incident'
import { api } from '@/lib/api'

export function useResponseActions() {
  const [actions, setActions] = useState<ContainmentAction[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshActions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getResponseActions()
      setActions(data)
    } catch (err: any) {
      console.warn('Error loading response actions:', err)
      setError(err?.message || 'Failed to fetch containment audit actions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    api
      .getResponseActions()
      .then((data) => {
        if (isMounted) {
          setActions(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch response actions')
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  const recordAction = useCallback(
    async (
      incidentId: string,
      actionType: ContainmentActionType,
      targetEntity: string,
      reason: string,
      operator: string,
      newIncidentStatus?: Incident['status']
    ): Promise<ContainmentAction> => {
      setIsExecuting(true)
      setError(null)
      try {
        const res = await api.recordResponseAction({
          incidentId,
          actionType,
          targetEntity,
          reason,
          operator,
          newIncidentStatus,
        })
        setActions((prev) => [res.action, ...prev])
        return res.action
      } catch (err: any) {
        setError(err?.message || 'Failed to record containment action')
        throw err
      } finally {
        setIsExecuting(false)
      }
    },
    []
  )

  const clearAuditLog = useCallback(async () => {
    try {
      await api.clearResponseActions()
      setActions([])
    } catch (err: any) {
      setError(err?.message || 'Failed to clear audit ledger')
    }
  }, [])

  return {
    actions,
    isExecuting,
    isLoading,
    error,
    refreshActions,
    recordAction,
    clearAuditLog,
  }
}
