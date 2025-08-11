import React from 'react'
import { FieldRenderer } from './FieldRenderer'
import { FieldsConfig } from '@/types/fields_config'
import ErrorAlert from './ErrorAlert'
import { testIdContext } from '@/test/utils/testIdContext'

// Define the type for additional actions
interface AdditionalAction {
  label: string
  onClick: () => void
  type: 'button' | 'link'
  className?: string
}

// Generic Custom Form
export function CustomForm<T extends Record<string, any>>({
  data,
  errors = {},
  submitHandler,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  submiting,
  formLabel,
  error,
  onCancel,
  additionalActions = []
}: {
  data: T
  errors?: Partial<Record<keyof T, string>>
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void
  icon?: React.ReactNode
  formLabel: string
  submitButtonLabel?: string
  cancelButtonLabel?: string
  onCancel: () => void
  submiting: boolean
  error: string
  additionalActions?: AdditionalAction[]
}) {
  const { SUBMIT_BUTTON_TEST_ID } = testIdContext.getContext()

  return (
    <form
      onSubmit={submitHandler}
      className="w-full max-w-4xl my-16 mx-auto px-4 py-10 bg-slate-100 shadow-2xl rounded-2xl border border-slate-200"
    >
      {error && <ErrorAlert message={error} />}

      {/* Icon Display */}
      {icon && <div className="flex justify-center mb-6 text-slate-600">{icon}</div>}

      {/* Title */}
      <h2 className="text-2xl font-bold mb-8 text-center text-slate-800 uppercase tracking-wide">
        {formLabel}
      </h2>

      <FieldRenderer data={data} errors={errors} />

      {/* Form Action Buttons */}
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
          data-testid={SUBMIT_BUTTON_TEST_ID}
          disabled={submiting}
        >
          {submiting ? 'Submitting...' : submitButtonLabel}
        </button>
      </div>

      {/* Additional Actions */}
      {additionalActions.length > 0 && (
        <div className="flex flex-col items-center gap-2 mt-6 pt-6 border-t border-slate-300">
          {additionalActions.map((action, index) => (
            <button
              key={index}
              type="button"
              onClick={action.onClick}
              className={
                action.className ||
                (action.type === 'link'
                  ? 'text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium transition-colors'
                  : 'bg-transparent hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded border border-slate-300 transition-colors text-sm')
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

// Custom Array Form
export function CustomArrayForm<T extends Record<string, any>>({
  arrayData = [],
  errors = {},
  fieldsConfig,
  onSubmit,
  icon,
  submitButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  addOrRemovelabel,
  submiting,
  onCancel,
  apiError,
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
  apiError: string
  submiting: boolean
  addFn: () => void
  removeFn: (index: number) => void
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
          <FieldRenderer data={data} errors={errors} index={index} />
          <div className="flex justify-end gap-4 mt-2">
            {arrayData.length > 1 && (
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => removeFn(index)}
              >
                Remove {addOrRemovelabel}
              </button>
            )}
            <button type="button" className="text-sm text-blue-600 hover:underline" onClick={addFn}>
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
