import React from 'react'
import { FieldConfig, FieldRenderer } from './FieldRenderer'

type CustomFormProps<T> = {
  data: T
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: {
    [K in keyof T]?: FieldConfig
  }
  onSubmit: () => void
  icon?: React.ReactNode
  submitButtonLabel?: string
  cancelButtonLabel?: string
  onCancel?: () => void
}

export function CustomForm<T extends Record<string, any>>({
  data,
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  onCancel
}: CustomFormProps<T>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="max-w-xl mx-auto p-4 bg-white shadow rounded"
    >
      {icon && <div className="flex justify-center mb-4">{icon}</div>}

      <FieldRenderer data={data} errors={errors} fieldsConfig={fieldsConfig} />

      <div className="flex justify-end gap-4 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-6 py-2 rounded"
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  )
}

type CustomFormArrayProps<T> = {
  arrayData: T[]
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: {
    [K in keyof T]?: FieldConfig
  }
  onSubmit: (e: React.FormEvent) => void
  icon?: React.ReactNode
  submitButtonLabel?: string
  cancelButtonLabel?: string
  addOrRemovelabel: string
  onCancel?: () => void
}

export function CustomArrayForm<T extends Record<string, any>>({
  arrayData,
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  addOrRemovelabel,
  onCancel
}: CustomFormArrayProps<T>) {
  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}

      {arrayData.map((data, index) => (
        <div key={index}>
          <FieldRenderer data={data} errors={errors} fieldsConfig={fieldsConfig} />
          {arrayData.length > 1 && <button type="button">Remove {addOrRemovelabel}</button>}
          <button type="button">Add {addOrRemovelabel}</button>
        </div>
      ))}

      <div className="flex justify-end gap-4 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-6 py-2 rounded"
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
        >
          {submitButtonLabel}
        </button>
      </div>
    </form>
  )
}
