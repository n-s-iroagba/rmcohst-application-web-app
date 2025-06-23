import React from 'react'
import { formatCamelCase } from '@/utils/formatCamelCase'

type CommonProps<T> = {
  name: keyof T
  label?: string
  error?: string
}

type TextFieldProps<T> = CommonProps<T> & {
  value: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function TextField<T>({ name, value, onChange, label, error }: TextFieldProps<T>) {
  return (
    <div className="mb-4">
      <label htmlFor={String(name)} className="block font-medium text-gray-700 mb-1">
        {label || formatCamelCase(String(name))}
      </label>
      <input
        id={String(name)}
        name={String(name)}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

type TextAreaFieldProps<T> = CommonProps<T> & {
  value: any
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function TextAreaField<T>({ name, value, onChange, label, error }: TextAreaFieldProps<T>) {
  return (
    <div className="mb-4">
      <label htmlFor={String(name)} className="block font-medium text-gray-700 mb-1">
        {label || formatCamelCase(String(name))}
      </label>
      <textarea
        id={String(name)}
        name={String(name)}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

type FileFieldProps<T> = CommonProps<T> & {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FileField<T>({ name, onChange, label, error }: FileFieldProps<T>) {
  return (
    <div className="mb-4">
      <label htmlFor={String(name)} className="block font-medium text-gray-700 mb-1">
        {label || formatCamelCase(String(name))}
      </label>
      <input
        id={String(name)}
        name={String(name)}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

type EnumSelectFieldProps<T> = CommonProps<T> & {
  value: any
  options: string[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function EnumSelectField<T>({
  name,
  value,
  options,
  onChange,
  label,
  error
}: EnumSelectFieldProps<T>) {
  return (
    <div className="mb-4">
      <label htmlFor={String(name)} className="block font-medium text-gray-700 mb-1">
        {label || formatCamelCase(String(name))}
      </label>
      <select
        id={String(name)}
        name={String(name)}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select {label || formatCamelCase(String(name))}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatCamelCase(opt)}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

type DoubleSelectFieldProps<T, U, W> = {
  firstSelectionData: T[]
  secondSelectionData: U[]
  onChange:
    | ((e: React.ChangeEvent<HTMLSelectElement>, parentIndex: number, childIndex: number) => void)
    | ((e: React.ChangeEvent<HTMLSelectElement>, index: number) => void)
  parentIndex?: number
  childIndex?: number
  index?: number
  valueData?: W[]
  firstSelectionKey: keyof T
  secondSelectionKey: keyof U
  firstSelectionLabel: string
  secondSelectionLabel: string
  firstNestedKey?: keyof W
  secondNestedKey?: keyof W
  isUpdate?: boolean
}

export function DoubleSelectField<
  T extends { id: string | number },
  U extends { id: string | number },
  W extends Record<string, any> = any
>({
  isUpdate = false,
  valueData,
  firstSelectionData,
  secondSelectionData,
  onChange,
  parentIndex,
  childIndex,
  index,
  firstSelectionKey,
  secondSelectionKey,
  firstSelectionLabel,
  secondSelectionLabel,
  firstNestedKey,
  secondNestedKey
}: DoubleSelectFieldProps<T, U, W>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isUpdate && typeof index === 'number') {
      (onChange as (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void)(e, index)
    } else if (!isUpdate && typeof parentIndex === 'number' && typeof childIndex === 'number') {
      (onChange as (
        e: React.ChangeEvent<HTMLSelectElement>,
        parentIndex: number,
        childIndex: number
      ))(e, parentIndex, childIndex)
    }
  }

  const getValue = (key: keyof W | undefined) =>
    isUpdate && valueData && typeof index === 'number' && key
      ? String(valueData[index]?.[key])
      : ''

  return (
    <div className="flex space-x-4 items-center mb-4">
      <div className="flex flex-col">
        <label className="mb-1">{firstSelectionLabel}</label>
        <select
          onChange={handleChange}
          className="border p-2 rounded"
          name={String(firstNestedKey ?? firstSelectionKey)}
          value={getValue(firstNestedKey)}
        >
          <option value="">{firstSelectionLabel}</option>
          {firstSelectionData.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {String(item[firstSelectionKey])}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1">{secondSelectionLabel}</label>
        <select
          onChange={handleChange}
          className="border p-2 rounded"
          name={String(secondNestedKey ?? secondSelectionKey)}
          value={getValue(secondNestedKey)}
        >
          <option value="">{secondSelectionLabel}</option>
          {secondSelectionData.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {String(item[secondSelectionKey])}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
