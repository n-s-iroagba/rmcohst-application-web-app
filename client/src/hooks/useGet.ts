'use client'

import { get } from '@/utils/apiClient'
import { useState, useEffect } from 'react'

export function useGetList<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Replace with actual API call
        const response = await get<T[]>(endpoint)
        console.log(response)
        setData(response)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}

export function useGetSingle<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await get<T>(endpoint)
        setData(response)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}
