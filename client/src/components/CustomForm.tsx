import React from 'react'
import { FieldConfig, FieldRenderer } from './FieldRenderer'

// Generic Custom Form
export function CustomForm<T extends Record<string, any>>({
  data,
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  submiting,
  onCancel
}: {
  data: T
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: { [K in keyof T]?: FieldConfig }
  onSubmit: () => void
  icon?: React.ReactNode
  submitButtonLabel?: string
  cancelButtonLabel?: string
  onCancel?: () => void
  submiting: boolean
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="w-full max-w-4xl my-16 mx-auto px-4 py-10 bg-slate-100 shadow-2xl rounded-2xl border border-slate-200"
    >
      {/* Icon Display */}
      {icon && <div className="flex justify-center mb-6 text-slate-600">{icon}</div>}

      {/* Title if needed */}
      <h2 className="text-2xl font-bold mb-8 text-center text-slate-800 uppercase tracking-wide">
        Application Form
      </h2>

      <FieldRenderer data={data} errors={errors} fieldsConfig={fieldsConfig} />

      <div className="flex justify-end gap-4 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded transition"
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          type="submit"
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-2 rounded transition"
        >
          {submiting ? 'Submitting...' : submitButtonLabel}
        </button>
      </div>
    </form>
  )
}

// Custom Array Form
export function CustomArrayForm<T extends Record<string, any>>({
  arrayData,
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  addOrRemovelabel,
  submiting,
  onCancel
}: {
  arrayData: T[]
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: { [K in keyof T]?: FieldConfig }
  onSubmit: (e: React.FormEvent) => void
  icon?: React.ReactNode
  submitButtonLabel?: string
  cancelButtonLabel?: string
  addOrRemovelabel: string
  onCancel?: () => void
  submiting: boolean
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-4xl mx-auto px-4 py-10 bg-white shadow-2xl rounded-2xl border border-slate-100"
    >
      {icon && <div className="flex justify-center mb-6 text-slate-600">{icon}</div>}

      <h2 className="text-2xl font-bold mb-8 text-center text-slate-800 uppercase tracking-wide">
        Multiple Entries
      </h2>

      {arrayData.map((data, index) => (
        <div key={index} className="mb-10">
          <FieldRenderer data={data} errors={errors} fieldsConfig={fieldsConfig} />
          <div className="flex justify-end gap-4 mt-2">
            {arrayData.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
              >
                Remove {addOrRemovelabel}
              </button>
            )}
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Add {addOrRemovelabel}
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-4 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded transition"
          >
            {cancelButtonLabel}
          </button>
        )}
        <button
          type="submit"
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-2 rounded transition"
        >
          {submiting ? 'Submitting...' : submitButtonLabel}
        </button>
      </div>
    </form>
  )
}
