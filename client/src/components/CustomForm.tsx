import React from 'react'
import { FieldRenderer } from './FieldRenderer'
import { FieldsConfig } from '@/types/fields_config'
import ErrorAlert from './ErrorAlert'


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
  formLabel,
  error,
  onCancel,

}: {
  data: T
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: FieldsConfig<T>
  onSubmit: () => void
  icon?: React.ReactNode
  formLabel:string
  submitButtonLabel?: string
  cancelButtonLabel?: string
  onCancel: () => void
  submiting: boolean
  error:string

  
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="w-full max-w-4xl my-16 mx-auto px-4 py-10 bg-slate-100 shadow-2xl rounded-2xl border border-slate-200"
    > {error&&<ErrorAlert message={error} />}
      {/* Icon Display */}
      {icon && <div className="flex justify-center mb-6 text-slate-600">{icon}</div>}

      {/* Title if needed */}
      <h2 className="text-2xl font-bold mb-8 text-center text-slate-800 uppercase tracking-wide">
       {formLabel}
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
  arrayData=[],
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  addOrRemovelabel,
  submiting,
  onCancel,
    addFn,
  removeFn
}: {
  arrayData: T[]
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: FieldsConfig<T>
  onSubmit: (e: React.FormEvent) => void
  icon?: React.ReactNode
  submitButtonLabel?: string
  cancelButtonLabel?: string
  addOrRemovelabel: string
  onCancel?: () => void
  submiting: boolean
    addFn:()=>void
  removeFn: (index:number)=>void
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
          <FieldRenderer data={data} errors={errors} fieldsConfig={fieldsConfig} index={index} />
          <div className="flex justify-end gap-4 mt-2">
            {arrayData.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={()=>removeFn(index)}
              >
                Remove {addOrRemovelabel}
              </button>
            )}
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={addFn}
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
