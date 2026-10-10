import { useState, useCallback, useEffect } from 'react'
import type { Decoy, CreateDecoyInput } from '@/types/decoy'
import { api } from '@/lib/api'

export function useDecoys() {
  const [decoys, setDecoys] = useState<Decoy[]>([])
  const [selectedDecoyId, setSelectedDecoyId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshDecoys = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getDecoys()
      setDecoys(data)
    } catch (err: any) {
      console.warn('Backend unavailable or error loading decoys:', err)
      setError(err?.message || 'Failed to connect to decoy registry backend')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    api
      .getDecoys()
      .then((data) => {
        if (isMounted) {
          setDecoys(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to connect to decoy registry backend')
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  const createDecoy = useCallback(
    async (input: CreateDecoyInput): Promise<Decoy> => {
      setError(null)
      try {
        const created = await api.createDecoy(input)
        setDecoys((prev) => [created, ...prev])
        return created
      } catch (err: any) {
        setError(err?.message || 'Failed to create decoy')
        throw err
      }
    },
    []
  )

  const deleteDecoy = useCallback(
    async (id: string) => {
      setError(null)
      try {
        await api.deleteDecoy(id)
        setDecoys((prev) => prev.filter((d) => d.id !== id))
        if (selectedDecoyId === id) setSelectedDecoyId(null)
      } catch (err: any) {
        setError(err?.message || 'Failed to delete decoy')
        throw err
      }
    },
    [selectedDecoyId]
  )

  const updateDecoyStatus = useCallback(
    async (id: string, status: Decoy['status']) => {
      setError(null)
      try {
        const updated = await api.updateDecoyStatus(id, status)
        setDecoys((prev) => prev.map((d) => (d.id === id ? updated : d)))
      } catch (err: any) {
        setError(err?.message || 'Failed to update decoy status')
        throw err
      }
    },
    []
  )

  const triggerCanaryTest = useCallback(
    async (id: string) => {
      setError(null)
      try {
        const res = await api.triggerCanaryTest(id)
        setDecoys((prev) => prev.map((d) => (d.id === id ? res.decoy : d)))
        return res
      } catch (err: any) {
        setError(err?.message || 'Failed to trigger canary test')
        throw err
      }
    },
    []
  )

  const selectedDecoy = decoys.find((d) => d.id === selectedDecoyId) || null

  const getDecoyStats = useCallback(() => {
    const total = decoys.length
    const staged = decoys.filter((d) => d.status === 'staged').length
    const active = decoys.filter((d) => d.status === 'active').length
    const triggered = decoys.filter((d) => d.triggerCount > 0).length
    return { total, staged, active, triggered }
  }, [decoys])

  return {
    decoys,
    selectedDecoy,
    selectedDecoyId,
    setSelectedDecoyId,
    isLoading,
    error,
    refreshDecoys,
    createDecoy,
    deleteDecoy,
    updateDecoyStatus,
    triggerCanaryTest,
    getDecoyStats,
  }
}
