import api from '@/lib/api'
import { FieldType } from '@/types/fields_config'

import { useMutation, UseMutationResult, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { handleError } from '../helpers/handleError'
// Define input types for different handlers
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>
type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>
export type FileChangeEvent = React.ChangeEvent<HTMLInputElement>
/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the change handler types
export type ChangeHandler = {
  [K in FieldType]?: K extends 'textarea'
  ? (e: TextAreaChangeEvent) => void
  : K extends 'select' | 'double-select'
  ? (e: SelectChangeEvent) => void
  : K extends 'file' | 'fileArray'
  ? (e: FileChangeEvent) => void
  : (e: InputChangeEvent) => void
}
type TransformFn = (name: string, value: string) => any

export function usePostBulk<T, U>(
  postResourceUrl: string,
  tempItem: T,
  onCreateFn: () => void,
  transformField?: (name: string, value: any) => any
) {
  const [postResources, setPostResources] = useState<T[]>([tempItem])
  const [postResponse, setPostResponse] = useState<U | null>(null)
  const [apiError, setApiError] = useState<string>('')

  const mutation: UseMutationResult<U, unknown, T[]> = useMutation<U, unknown, T[]>({
    mutationFn: async (payload: T[]) => {
      try {
        const response = await api.post(postResourceUrl, payload)
        return response.data as U
      } catch (error) {
        handleError(error, setApiError)
        throw error // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setPostResponse(data)
      setApiError('')
    },
    onError: (err: unknown) => {
      handleError(err, setApiError)
    }
  })

  const addItem = () => {
    setPostResources((prev) => [...prev, tempItem])
  }

  const removeItem = (index: number) => {
    setPostResources((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  const handleChangeItems = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    const transformedValue = transformField ? transformField(name, value) : value

    setPostResources((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [name]: transformedValue
      },
      ...prev.slice(index + 1)
    ])
  }

  const handleSubmitItems = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await mutation.mutateAsync(postResources)
      onCreateFn()
    } catch (err) {
      // Error is already handled in onError callback
      console.error('Submit failed:', err)
    }
  }

  return {
    items: postResources,
    postResponse,
    loading: mutation.isPending,
    error: apiError,
    addItem,
    removeItem,
    handleChangeItems,
    handleSubmitItems
  }
}

// Alternative approach with separate, type-safe handlers

export const usePost = <T, U>(
  postResourceUrl: string,
  initialData: T,
  transformField?: TransformFn
) => {
  const [postResource, setPostResource] = useState<T>(initialData)

  const [apiError, setApiError] = useState<string>('')

  const mutation = useMutation<U, unknown, T>({
    mutationFn: async (payload: T) => {
      try {
        console.log('payload is', payload)
        const response = await api.post(postResourceUrl, payload)

        console.log('response is ', response.data)

        return response.data
      } catch (error) {
        handleError(error, setApiError)
        throw error
      }
    },
    onError: (err: unknown) => {
      handleError(err, setApiError)
    }
  })

  // Handler for text inputs, textareas, selects, etc.
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    const transformedValue = transformField ? transformField(name, value) : value

    setPostResource((prev) => ({
      ...prev,
      [name]: transformedValue
    }))
  }

  // Handler specifically for checkboxes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    setPostResource((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  // Handler for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    const file = files?.[0] || null

    setPostResource((prev) => ({
      ...prev,
      [name]: file
    }))
  }

  // Generic handler that routes to appropriate specific handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { type } = e.target

    switch (type) {
      case 'checkbox':
        handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)
        break
      case 'file':
        handleFileChange(e as React.ChangeEvent<HTMLInputElement>)
        break
      default:
        handleTextChange(e)
        break
    }
  }

  const handlePost = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    try {
      const data = await mutation.mutateAsync(postResource)
      return data
    } catch (error) {
      console.error('Post failed:', error)
    }
  }

  // Create comprehensive change handlers for different field types
  const changeHandlers: ChangeHandler = {
    text: handleTextChange,
    password: handleTextChange,
    email: handleTextChange,
    textarea: handleTextChange,
    select: handleTextChange,
    checkbox: handleCheckboxChange,
    radio: handleTextChange,
    date: handleTextChange,
    file: handleFileChange,

  }

  return {
    postResource,
    setPostResource,
    posting: mutation.isPending,
    apiError,
    changeHandlers,
    handlePost,
    handleChange,
    handleTextChange,
    handleCheckboxChange,
    handleFileChange
  }
}

export const useGet = <T>(resourceUrl: string | null) => {
  const [apiError, setApiError] = useState('')



  const {
    data: resourceData,
    isLoading,
    isError,

    refetch
  } = useQuery<T, unknown>({
    queryKey: [resourceUrl],
    queryFn: async () => {
      try {
        if (!resourceUrl) {
          return {
            resourceData: undefined,
            loading: false,
            error: '',
            refetch: async () => ({ data: undefined }) as any // noop
          }
        }
        const response = await api.get(resourceUrl)
        return response.data
      } catch (error) {
        handleError(error, setApiError)
        throw error
      }
    },
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any
        if (
          axiosError.code === 'ERR_NETWORK' ||
          (axiosError.response &&
            axiosError.response.status >= 400 &&
            axiosError.response.status < 500)
        ) {
          return false
        }
      }
      return failureCount < 3
    },
    staleTime: 0
  })


  return {
    resourceData,
    loading: isLoading,
    error: apiError || (isError ? 'An error occurred while fetching data' : ''),
    refetch
  }
}

interface UsePutReturn<T, U> {
  putResource: T
  putResponse: U | null
  updating: boolean
  apiError: string
  changeHandlers: ChangeHandler
  handlePut: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const usePut = <T, U = any>(
  putUrl: string | null,
  initialData: T,
  transformField?: (name: string, value: string | boolean | File | null) => any
): UsePutReturn<T, U> => {
  const [putResource, setPutResource] = useState<T>(initialData)
  const [putResponse, setPutResponse] = useState<U | null>(null)
  const [apiError, setApiError] = useState('')

  const mutation = useMutation<U, unknown, T>({
    mutationFn: async (payload: T) => {
      try {
        if (!putUrl) return null
        const response = await api.put(putUrl, payload)
        return response.data
      } catch (error) {
        handleError(error, setApiError)
        throw error // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setPutResponse(data)
      setApiError('')
    },
    onError: (err: unknown) => {
      handleError(err, setApiError)
    }
  })

  // Handle text, email, password, date, number, textarea, select inputs
  const handleTextChange = (e: InputChangeEvent | TextAreaChangeEvent | SelectChangeEvent) => {
    const { name, value } = e.target
    const transformedValue = transformField ? transformField(name, value) : value

    setPutResource((prev) => ({
      ...prev,
      [name]: transformedValue
    } as T))
  }

  // Handle checkbox inputs
  const handleCheckboxChange = (e: InputChangeEvent) => {
    const { name, checked } = e.target
    const transformedValue = transformField ? transformField(name, checked) : checked

    setPutResource((prev) => ({
      ...prev,
      [name]: transformedValue
    } as T))
  }

  // Handle file inputs
  const handleFileChange = (e: FileChangeEvent) => {
    const { name, files } = e.target
    const file = files?.[0] || null

    const transformedValue = transformField ? transformField(name, file) : file

    setPutResource((prev) => ({
      ...prev,
      [name]: transformedValue
    } as T))
  }

  // FIXED: Remove conflicting generic T and use the hook's T
  const handleArrayFileChangeAppend = (e: FileChangeEvent) => {
    const { name, files } = e.target
    const file = files?.[0] || null

    if (!file) return

    const transformedValue = transformField ? transformField(name, file) : file

    setPutResource((prev) => {
      // Type assertion to safely access dynamic properties
      const prevObj = prev as Record<string, any>
      const existingArray = Array.isArray(prevObj[name]) ? prevObj[name] : []
      return {
        ...prev,
        [name]: [...existingArray, transformedValue]
      } as T
    })
  }





  const handlePut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await mutation.mutateAsync(putResource)
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Put failed:', error)
    }
  }

  // Create change handlers object
  const changeHandlers: ChangeHandler = {
    text: handleTextChange,
    password: handleTextChange,
    email: handleTextChange,
    textarea: handleTextChange as (e: TextAreaChangeEvent) => void,
    select: handleTextChange as (e: SelectChangeEvent) => void,
    checkbox: handleCheckboxChange,
    radio: handleTextChange,
    date: handleTextChange,
    file: handleFileChange,
    // Add the array file handler
    fileArray: handleArrayFileChangeAppend
  }

  return {
    putResource,
    putResponse,
    updating: mutation.isPending,
    apiError,
    changeHandlers,
    handlePut,

  }
}

export const useDelete = <U>(resourceUrl: string) => {
  const [deleteResponse, setDeleteResponse] = useState<U | null>(null)
  const [apiError, setApiError] = useState('')

  const mutation = useMutation<U, unknown, void>({
    mutationFn: async () => {
      try {
        const response = await api.delete(resourceUrl)
        return response.data
      } catch (error) {
        handleError(error, setApiError)
        throw error // Re-throw to trigger onError
      }
    },
    onSuccess: (data: U) => {
      setDeleteResponse(data)
      setApiError('')
    },
    onError: (err: unknown) => {
      handleError(err, setApiError)
    }
  })

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync()
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Delete failed:', error)
    }
  }

  return {
    deleteResponse,
    deleting: mutation.isPending,
    apiError,
    handleDelete
  }
}
