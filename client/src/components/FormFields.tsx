import React from 'react'
import { FieldConfig } from './FieldRenderer'

export const TextField = ({ name, label, value, onChange, error }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">{label}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const TextareaField = ({ name, label, value, onChange, error }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const SelectField = ({ name, label, value, onChange, options, error }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select {label}</option>
      {options?.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const CheckboxField = ({ name, label, checked, onChange, error }: any) => (
  <div className="mb-4 flex items-center space-x-2">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={checked || false}
      onChange={onChange}
    />
    <label htmlFor={name}>{label}</label>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const FileField = ({ name, label, onChange, error }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">{label}</label>
    <input
      type="file"
      id={name}
      name={name}
      accept="image/*"
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)
type DoubleSelectProps = {
  index: number
  data: any[]
  config: FieldConfig
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void
}

export const DoubleSelectField: React.FC<DoubleSelectProps> = ({ index, data, config, onChange }) => {
  const { fieldGroup } = config

  if (!fieldGroup) {
    throw new Error(`Double-select field "${config.name}" is missing fieldGroup config`)
  }

  const value = data[index]

  return (
    <div className="flex space-x-4">
      <div className="flex flex-col flex-1">
        <label>{fieldGroup.firstField.label}</label>
        <select
          name={fieldGroup.firstField.name}
          value={value[fieldGroup.firstField.name] || ''}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
        >
          <option value="">Select {fieldGroup.firstField.label}</option>
          {fieldGroup.firstField.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col flex-1">
        <label>{fieldGroup.secondField.label}</label>
        <select
          name={fieldGroup.secondField.name}
          value={value[fieldGroup.secondField.name] || ''}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
        >
          <option value="">Select {fieldGroup.secondField.label}</option>
          {fieldGroup.secondField.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
