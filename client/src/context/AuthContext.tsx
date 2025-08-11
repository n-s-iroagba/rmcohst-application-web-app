'use client'

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef
} from 'react'

import { API_ROUTES } from '@/config/routes'
import { User } from '@/types/auth.types'
import { getAccessToken, api, registerTokenUpdateCallback } from '@/lib/apiUtils'
import { useGet } from '@/hooks/useApiQuery'

const AuthContext = createContext<{
  user: User
  loading: boolean
  error: string
  setUser: Dispatch<SetStateAction<User | null>>
  fetchUser: () => Promise<void>
} | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [manualLoading, setManualLoading] = useState(false)
  const [manualError, setManualError] = useState<string>('')
  const unregisterCallbackRef = useRef<(() => void) | null>(null)
  const isInitialMount = useRef(true)

  const {
    resourceData: fetchedUser,
    loading: hookLoading,
    error: hookError
  } = useGet<User>(API_ROUTES.AUTH.ME)

  // Combine loading states
  const loading = hookLoading || manualLoading
  const error = hookError || manualError

  // Fetch user function
  const fetchUser = useCallback(async (token?: string) => {
    const currentToken = token || getAccessToken()

    if (!currentToken) {
      console.log('No access token available, clearing user')
      setUser(null)
      return
    }

    try {
      setManualLoading(true)
      setManualError('')
      console.log('Fetching user data with token:', currentToken ? 'present' : 'missing')

      const response = await api.get<User>(API_ROUTES.AUTH.ME)
      console.log('User data fetched successfully:', response.data)
      setUser(response.data)
    } catch (error: any) {
      console.error('Failed to fetch user:', error)
      setManualError(error?.response?.data?.message || 'Failed to fetch user')

      // If it's a 401, clear the user
      if (error?.response?.status === 401) {
        console.log('401 error, clearing user')
        setUser(null)
      }
    } finally {
      setManualLoading(false)
    }
  }, [])

  // Register callback for token updates
  useEffect(() => {
    console.log('Registering token update callback')

    const handleTokenUpdate = async (newToken: string | null, oldToken: string | null) => {
      console.log('Token update callback triggered:', {
        newToken: !!newToken,
        oldToken: !!oldToken,
        isInitialMount: isInitialMount.current
      })

      // Skip initial mount callback if we already have user data from useGet
      if (isInitialMount.current && fetchedUser) {
        console.log('Skipping initial token callback, user already fetched via useGet')
        isInitialMount.current = false
        return
      }

      isInitialMount.current = false

      if (!newToken) {
        // Token was cleared, clear user
        console.log('Token cleared, clearing user')
        setUser(null)
        setManualError('')
        return
      }

      // New token received or token changed, fetch user
      console.log('Token updated, fetching user...')
      await fetchUser(newToken)
    }

    // Register the callback
    unregisterCallbackRef.current = registerTokenUpdateCallback(handleTokenUpdate)

    // Cleanup function
    return () => {
      console.log('Unregistering token update callback')
      if (unregisterCallbackRef.current) {
        unregisterCallbackRef.current()
      }
    }
  }, [fetchUser, fetchedUser])

  // Handle initial user fetch from useGet hook
  useEffect(() => {
    if (fetchedUser && !user) {
      console.log('Setting user from useGet hook:', fetchedUser)
      setUser(fetchedUser)
      isInitialMount.current = false
    }
  }, [fetchedUser, user])

  const defaultUser: User = {
    id: '',
    email: '',
    username: '',
    role: 'applicant'
  }

  const contextValue = {
    user: user || defaultUser,
    setUser,
    loading,
    error,
    fetchUser
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
