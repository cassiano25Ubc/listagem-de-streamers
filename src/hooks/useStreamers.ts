import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchStreamers } from '../services/streamersApi'
import type { Streamer } from '../types/streamer'

export const STREAMERS_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000

type UseStreamersResult = {
  streamers: Streamer[]
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  refreshError: string | null
  retry: () => Promise<void>
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocorreu um erro inesperado ao carregar os streamers.'
}

export function useStreamers(): UseStreamersResult {
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const hasDataRef = useRef(false)
  const requestIdRef = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)

  const retry = useCallback(async () => {
    controllerRef.current?.abort()

    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    controllerRef.current = controller

    if (hasDataRef.current) {
      setIsRefreshing(true)
      setRefreshError(null)
    } else {
      setIsLoading(true)
      setError(null)
    }

    try {
      const nextStreamers = await fetchStreamers(controller.signal)

      if (requestId !== requestIdRef.current) {
        return
      }

      setStreamers(nextStreamers)
      hasDataRef.current = true
      setError(null)
      setRefreshError(null)
    } catch (requestError) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return
      }

      if (hasDataRef.current) {
        setRefreshError(getErrorMessage(requestError))
      } else {
        setError(getErrorMessage(requestError))
      }
    } finally {
      if (requestId === requestIdRef.current) {
        controllerRef.current = null
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    const initialRequestId = window.setTimeout(() => void retry(), 0)

    const intervalId = window.setInterval(
      () => void retry(),
      STREAMERS_REFRESH_INTERVAL_MS,
    )

    return () => {
      window.clearTimeout(initialRequestId)
      window.clearInterval(intervalId)
      controllerRef.current?.abort()
      requestIdRef.current += 1
    }
  }, [retry])

  return {
    streamers,
    isLoading,
    isRefreshing,
    error,
    refreshError,
    retry,
  }
}
