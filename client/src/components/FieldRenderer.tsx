import { formatCamelCase } from '@/utils/formatCamelCase'
import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  FileField,
  MultiGroupSelectField,
  RadioField
} from './FormFields'
import { ChangeEvent } from 'react'

type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'double-select' | 'radio'

export type FieldConfig = {
  onChangeHandler?:
    | ((e: any, index: number, subFieldKey: string) => void)
    | ((e: ChangeEvent<HTMLSelectElement>) => void)
    | ((e: ChangeEvent<HTMLInputElement>) => void)

  type: FieldType

  /**
   * Used by:
   * - select
   * - radio
   */
  options?: string[] | { id: string | number; label: string }[]

  /**
   * Used by double-select or multi-group fields
   */
  fieldGroup?: {
    groupKey: string
    fields: {
      name: string
      label: string
      options: { id: string | number; label: string }[]
    }[]
    addHandler: () => void
    removeHandler: (index: number) => void
    onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void
  }
}

type FieldRendererProps<T> = {
  data: T
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: {
    [K in keyof T]?: FieldConfig
  }
}

export function FieldRenderer<T extends Record<string, any>>({
  data,
  errors = {},
  fieldsConfig
}: FieldRendererProps<T>) {
  return (
    <>
      {Object.entries(fieldsConfig).map(([key, config]) => {
        if (!(key in data) || !config) return null

        const value = data[key as keyof T]
        const error = errors?.[key as keyof T]
        const onChange = config.onChangeHandler

        if (!config) return null

        switch (config.type) {
          case 'textarea':
            return (
              <TextareaField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={onChange}
                error={error}
              />
            )

          case 'select':
            return (
              <SelectField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                options={config.options}
                onChange={onChange}
                error={error}
              />
            )
          case 'double-select':
            if (!config.fieldGroup) {
              console.error('no field group')
              return null
            }
            return (
              <MultiGroupSelectField
                groupData={data[key]}
                fieldGroup={config.fieldGroup}
                onChange={config.fieldGroup.onChangeHandler}
              />
            )
          case 'checkbox':
            return (
              <CheckboxField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                checked={value}
                onChange={onChange}
                error={error}
              />
            )

          case 'file':
            return (
              <FileField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                onChange={onChange}
                error={error}
              />
            )
          case 'radio':
            return (
              <RadioField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                options={config.options || []}
                onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
                error={error}
              />
            )

          case 'text':
          default:
            return (
              <TextField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={onChange}
                error={error}
              />
            )
        }
      })}
    </>
  )
}
