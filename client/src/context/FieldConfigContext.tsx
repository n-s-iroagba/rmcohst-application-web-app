'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FieldsConfig
} from '@/types/fields_config'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'

// Define the context value type
type FieldConfigContextValue<T = any> = {
  fieldsConfig: FieldsConfig<T>
  setFieldsConfig: Dispatch<SetStateAction<FieldsConfig<T>>>
}

// Create the context with proper typing
const FieldConfigContext = createContext<FieldConfigContextValue | undefined>(undefined)

export const FieldConfigProvider = <T = any,>({ children }: { children: React.ReactNode }) => {
  const [fieldsConfig, setFieldsConfig] = useState<FieldsConfig<T>>({} as FieldsConfig<T>)




  const value: FieldConfigContextValue<T> = {
    fieldsConfig,
    setFieldsConfig,

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



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { SelectOption } from '@/components/FormFields'
// import {
//   ChangeHandler,
//   FieldConfigInput,
//   FieldGroupConfig,
//   FieldsConfig
// } from '@/types/fields_config'

// interface FieldConfigContextValue<T> {
//   fieldsConfig: FieldsConfig<T>
// }

// class FieldConfigContext<T extends Record<string, any>> {
//   private context: FieldConfigContextValue<T> | null = null

//   setContext(
//     input: FieldConfigInput<T>,
//     handlers?: Partial<ChangeHandler>,
//     options?: Partial<Record<keyof T, SelectOption[]>>,
//     groups?: Partial<Record<keyof T, FieldGroupConfig>>
//   ): void {
//     const config: FieldsConfig<T> = {} as FieldsConfig<T>

//     Object.keys(input).forEach((key) => {
//       const fieldKey = key as keyof T
//       const fieldType = input[fieldKey].type

//       config[fieldKey] = {
//         type: fieldType,
//         onChangeHandler: handlers?.[fieldType],
//         options: options?.[fieldKey],
//         fieldGroup: groups?.[fieldKey]
//       }
//     })

//     this.context = {
//       fieldsConfig: config
//     }
//   }

//   getContext(): FieldConfigContextValue<T> {
//     if (!this.context) {
//       throw new Error('FieldConfigContext has not been initialized. Call setContext() first.')
//     }

//     return this.context
//   }

//   reset(): void {
//     this.context = null
//   }

//   // Helper method to get just the fields config
//   getFieldsConfig(): FieldsConfig<T> {
//     return this.getContext().fieldsConfig
//   }
// }

// // Create a singleton instance
// export const fieldConfigContext = new FieldConfigContext()