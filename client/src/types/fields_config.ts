
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectOption } from '@/components/FormFields'
import { FileChangeEvent } from '@/hooks/useApiQuery'
import { ChangeEvent } from 'react'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'double-select'
  | 'radio'
  | 'date'
  | 'password'
  | 'email'
  | 'number'
  | 'fileArray'

export type FieldGroupConfig = {
  // groupKey: string
  fields: {
    name: string
    label: string
    options?: { id: string | number; label: string }[]
  }[]
  addHandler?: () => void
  removeHandler?: (index: number) => void
  onChangeHandler: ((e: ChangeEvent<HTMLSelectElement>, index: number, field: string) => void)|((e: FileChangeEvent)=>void)
}

export type FieldConfig = {
  type: FieldType
  onChangeHandler?:
    | ((e: any, index?: number) => void)
    | ((e: any, index: number) => void)
    | ((e: ChangeEvent<HTMLSelectElement>) => void)
    | ((e: ChangeEvent<HTMLInputElement>) => void)

  /**
   * Used by:
   * - select
   * - radio
   */
  options?: SelectOption[]

  /**
   * Used by double-select or multi-group fields
   */
  fieldGroup?: FieldGroupConfig
}

export type FieldsConfig<T> = {
  [key in keyof T]: FieldConfig
}


export type ChangeHandler = Partial<{
  [type in FieldType]:
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | ((e: React.ChangeEvent<HTMLTextAreaElement>) => void)
    | ((e: React.ChangeEvent<HTMLSelectElement>) => void)
}>

export type FieldConfigInput<T>={
  [k in keyof T]:{
    type:FieldType
  }
}
