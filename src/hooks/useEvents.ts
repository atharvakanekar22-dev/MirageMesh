import { useState, useCallback, useEffect } from 'react'
import type { SecurityEvent } from '@/types/event'
import { api } from '@/lib/api'

export function useEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshEvents = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getEvents()
      setEvents(data)
    } catch (err: any) {
      console.warn('Backend unavailable or error loading events:', err)
      setError(err?.message || 'Failed to connect to events backend')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    api
      .getEvents()
      .then((data) => {
        if (isMounted) {
          setEvents(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to connect to events backend')
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  return {
    events,
    isLoading,
    error,
    refreshEvents,
  }
}
