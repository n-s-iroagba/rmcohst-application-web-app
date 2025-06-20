import React from 'react'
import { formatCamelCase } from '@/utils/formatCamelCase'

type DynamicFormTextFieldProps<T> = {
  data: T
  errors?: Partial<Record<keyof T, string>>
  onChange: (e: React.ChangeEvent<HTMLInputElement>, index?: number) => void
  index?: number
  excludeKeys?: (keyof T)[]
  textareaKeys?: (keyof T)[]
  classNameInput?: string
  classNameLabel?: string
  classNameError?: string
}

export function DynamicFormTextFields<T extends Record<string, any>>({
  data,
  errors = {},
  onChange,
  index,
  excludeKeys = [],
  textareaKeys = [],
  classNameInput = 'w-full border rounded px-3 py-2',
  classNameLabel = 'block mb-1 font-medium text-gray-700',
  classNameError = 'text-red-600 text-sm mt-1'
}: DynamicFormTextFieldProps<T>) {
  return (
    <>
      {Object.keys(data).map((key) => {
        const typedKey = key as keyof T
        if (excludeKeys.includes(typedKey)) return null

        const isTextarea = textareaKeys.includes(typedKey)
        const inputType = key.toLowerCase().includes('password')
          ? 'password'
          : key.toLowerCase().includes('email')
            ? 'email'
            : key === 'dateOfBirth'
              ? 'date'
              : 'text'

        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label htmlFor={key} className={classNameLabel}>
              {formatCamelCase(key)}
            </label>

            <input
              id={key}
              name={key}
              type={inputType}
              value={data[typedKey] ?? ''}
              onChange={(e) => onChange(e, index)}
              className={classNameInput}
            />

            {errors[typedKey] && <p className={classNameError}>{errors[typedKey]}</p>}
          </div>
        )
      })}
    </>
  )
}

type RenderDoubleSelectFieldsProps<T, U> = {
  firstSelectionData: T[]
  secondSelectionData: U[]
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    parentIndex: number,
    childIndex: number
  ) => void
  parentIndex: number
  childIndex: number
  firstSelectionKey: keyof T
  secondSelectionKey: keyof U
  firstSelectionLabel: string
  secondSelectionLabel: string
}

export function RenderDoubleSelectFields<
  T extends { id: string | number },
  U extends { id: string | number }
>({
  firstSelectionData,
  secondSelectionData,
  onChange,
  parentIndex,
  childIndex,
  firstSelectionKey,
  secondSelectionKey,
  firstSelectionLabel,
  secondSelectionLabel
}: RenderDoubleSelectFieldsProps<T, U>) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="flex flex-col">
        <label className="mb-1">{firstSelectionLabel}</label>
        <select
          onChange={(e) => onChange(e, parentIndex, childIndex)}
          className="border p-2 rounded"
          name={String(firstSelectionKey)}
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
          onChange={(e) => onChange(e, parentIndex, childIndex)}
          className="border p-2 rounded"
          name={String(secondSelectionKey)}
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

type RenderDoubleSelectFieldsForUpdateProps<
  T extends { id: string | number },
  U extends { id: string | number },
  W extends Record<string, any>
> = {
  valueData: W[]
  firstSelectionData: T[]
  secondSelectionData: U[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>, index: number) => void
  index: number
  firstSelectionKey: keyof T
  secondSelectionKey: keyof U
  firstSelectionLabel: string
  secondSelectionLabel: string
  firstNestedKey: keyof W
  secondNestedKey: keyof W
}

export function RenderDoubleSelectFieldsForUpdate<
  T extends { id: string | number },
  U extends { id: string | number },
  W extends Record<string, any>
>({
  valueData,
  firstSelectionData,
  secondSelectionData,
  onChange,
  index,
  firstSelectionKey,
  secondSelectionKey,
  firstSelectionLabel,
  secondSelectionLabel,
  firstNestedKey,
  secondNestedKey
}: RenderDoubleSelectFieldsForUpdateProps<T, U, W>) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="flex flex-col">
        <label className="mb-1">{firstSelectionLabel}</label>
        <select
          name={String(firstNestedKey)}
          value={String(valueData[index][firstNestedKey])}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
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
          name={String(secondNestedKey)}
          value={String(valueData[index][secondNestedKey])}
          onChange={(e) => onChange(e, index)}
          className="border p-2 rounded"
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
