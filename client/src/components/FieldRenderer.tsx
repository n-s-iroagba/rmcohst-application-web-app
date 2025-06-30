'use client'
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
import { FieldsConfig } from '@/types/fields_config'



type FieldRendererProps<T> = {
  data: T

  fieldsConfig: FieldsConfig<T>
   errors?: Partial<Record<keyof T, string>>
  index?:number
}

export function FieldRenderer<T extends Record<string, any>>({
  data,
  errors = {},
  fieldsConfig,
  index
}: FieldRendererProps<T>) {
  return (
    <>
      {Object.entries(fieldsConfig).map(([key, config]) => {
        if (!(key in data) || !config) return null

        const value = data[key as keyof T]
        const error = errors?.[key as keyof T]
        if(!config?.onChangeHandler && !config.fieldGroup?.onChangeHandler) {
          console.log('no change event handler field renderer config')
          return null
        }
        const onChange = (config?.onChangeHandler as ((e: any, index?: number) => void))|| ( (e:any)=>{})
        if (!config) return null

        switch (config.type) {
          case 'textarea':
            return (
              <TextareaField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e:any)=>onChange(e,index)}
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
                onChange={(e:any)=>onChange(e,index)}
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
                onChange={(e:any)=>onChange(e,index)}
                error={error}
              />
            )

          case 'file':
            return (
              <FileField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                onChange={(e:any)=>onChange(e,index)}
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
         case 'date':
        
            return (
              <TextField
                key={key}
                name={key}
                label={formatCamelCase(key)}
                value={value}
                onChange={(e:any)=>onChange(e,index)}
                error={error}
                type="date"
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
                onChange={(e:any)=>onChange(e,index)}
                error={error}
                type='text'
              />
            )

        
        }
      })}
    </>
  )
}
