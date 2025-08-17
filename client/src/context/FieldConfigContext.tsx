'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectOption } from '@/components/FormFields'
import {
  ChangeHandler,

  FieldConfigInput,

  FieldGroupConfig,
  FieldsConfig
} from '@/types/fields_config'
import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react'

// Define the context value type
type FieldConfigContextValue<T = any> = {
  fieldsConfig: FieldsConfig<T>
  setFieldsConfig: Dispatch<SetStateAction<FieldsConfig<T>>>
  createFieldsConfig: (
    input: FieldConfigInput<T>,
    handlers?: Partial<ChangeHandler>,
    options?: Partial<Record<keyof T, SelectOption[]>>,
    groups?: Partial<Record<keyof T, FieldGroupConfig>>
  ) => void
}

// Create the context with proper typing
const FieldConfigContext = createContext<FieldConfigContextValue | undefined>(undefined)

export const FieldConfigProvider = <T = any,>({ children }: { children: React.ReactNode }) => {
  const [fieldsConfig, setFieldsConfig] = useState<FieldsConfig<T>>({} as FieldsConfig<T>)

  // Function to create fields config from input and handlers
  const createFieldsConfig = useCallback(
    (
      input: FieldConfigInput<T>,
      handlers?: Partial<ChangeHandler>,
      options?: Partial<Record<keyof T, SelectOption[]>>,
      groups?: Partial<Record<keyof T, FieldGroupConfig>>
    ) => {
      const config: FieldsConfig<T> = {} as FieldsConfig<T>

      Object.keys(input).forEach((key) => {
        const fieldKey = key as keyof T
        const fieldType = input[fieldKey].type

        config[fieldKey] = {
           type:fieldType,
          onChangeHandler: handlers?.[fieldType],
          options: options?.[fieldKey],
          fieldGroup: groups?.[fieldKey]
        }
      })

      setFieldsConfig(config)
    },
    [] // Keep empty since this function doesn't depend on any external values when called manually
  )



  const value: FieldConfigContextValue<T> = {
    fieldsConfig,
    setFieldsConfig,
    createFieldsConfig
  }

  return <FieldConfigContext.Provider value={value}>{children}</FieldConfigContext.Provider>
}

export const useFieldConfigContext = <T = any,>(): FieldConfigContextValue<T> => {
  const context = useContext(FieldConfigContext)
  if (!context) {
    throw new Error('useFieldConfigContext must be used within FieldConfigProvider')
  }
  return context as FieldConfigContextValue<T>
}
