import React from 'react'
import { formatCamelCase } from '@/utils/formatCamelCase'

type DynamicFormTextFieldsProps<T> = {
  data: T
  errors: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  excludeKeys?: (keyof T)[]
}

function DynamicFormTextFields<T extends Record<string, any>>({
  data,
  errors,
  onChange,
  excludeKeys = []
}: DynamicFormTextFieldsProps<T>) {
  return (
    <>
      {Object.keys(data).map((key) => {
        const typedKey = key as keyof T
        if (excludeKeys.includes(typedKey)) return null

        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label htmlFor={key}>{formatCamelCase(key)}</label>
            <input
              id={key}
              name={key}
              type={
                key.toLowerCase().includes('password') ? 'password' :
                key.toLowerCase().includes('email') ? 'email' : 'text'
              }
              value={data[typedKey] ?? ''}
              onChange={onChange}
            />
            {errors[typedKey] && (
              <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors[typedKey]}</p>
            )}
          </div>
        )
      })}
    </>
  )
}

export default DynamicFormTextFields
