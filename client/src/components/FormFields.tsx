import { FieldConfig } from '@/types/fields_config'
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
export const TextField = ({ name, label, value, onChange, error,type }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
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
    <label htmlFor={name} className="block font-medium mb-1">
      {label}
    </label>
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
    <label htmlFor={name} className="block font-medium mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select {label}</option>
      {options?.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const CheckboxField = ({ name, label, checked, onChange, error }: any) => (
  <div className="mb-4 flex items-center space-x-2">
    <input type="checkbox" id={name} name={name} checked={checked || false} onChange={onChange} />
    <label htmlFor={name}>{label}</label>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const FileField = ({ name, label, onChange, error }: any) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium mb-1">
      {label}
    </label>
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

type MultiGroupSelectFieldProps = {
  groupData: any[]
  fieldGroup: NonNullable<FieldConfig['fieldGroup']>
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number, subKey: string) => void
}

export const MultiGroupSelectField: React.FC<MultiGroupSelectFieldProps> = ({
  groupData,
  fieldGroup,
  onChange
}) => {
  return (
    <div className="space-y-2">
      {groupData.map((entry, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          {fieldGroup.fields.map((field) => (
            <select
              key={field.name}
              value={entry[field.name] || ''}
              onChange={(e) => onChange(e, i, field.name)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select {field.label}</option>
              {field.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      ))}
    </div>
  )
}
type RadioFieldProps = {
  name: string
  label: string
  options: { id: string | number; label: string }[] | string[]
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export const RadioField: React.FC<RadioFieldProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error
}) => {
  const normalizedOptions =
    typeof options[0] === 'string'
      ? (options as string[]).map((opt) => ({ id: opt, label: opt }))
      : (options as { id: string | number; label: string }[])

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {normalizedOptions.map((option) => (
          <label key={option.id} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={onChange}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
