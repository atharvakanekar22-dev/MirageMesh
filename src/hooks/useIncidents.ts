import { useState, useCallback, useEffect } from 'react'
import type { Incident } from '@/types/incident'
import { api } from '@/lib/api'

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshIncidents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getIncidents()
      setIncidents(data)
      if (data.length > 0 && !selectedIncidentId) {
        setSelectedIncidentId(data[0].id)
      }
    } catch (err: any) {
      console.warn('Backend unavailable or error loading incidents:', err)
      setError(err?.message || 'Failed to connect to incidents backend')
    } finally {
      setIsLoading(false)
    }
  }, [selectedIncidentId])

  useEffect(() => {
    let isMounted = true
    api
      .getIncidents()
      .then((data) => {
        if (isMounted) {
          setIncidents(data)
          if (data.length > 0) {
            setSelectedIncidentId((prev) => prev || data[0].id)
          }
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to connect to incidents backend')
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  const selectedIncident =
    incidents.find((i) => i.id === selectedIncidentId) || (incidents.length > 0 ? incidents[0] : null)

  const updateIncidentStatus = useCallback(
    async (id: string, status: Incident['status']) => {
      setError(null)
      try {
        const updated = await api.updateIncidentStatus(id, status)
        setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)))
      } catch (err: any) {
        setError(err?.message || 'Failed to update incident status')
      }
    },
    []
  )

  const clearAllIncidents = useCallback(async () => {
    setIncidents([])
    setSelectedIncidentId(null)
  }, [])

  return {
    incidents,
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    isLoading,
    error,
    refreshIncidents,
    updateIncidentStatus,
    clearAllIncidents,
  }
}
