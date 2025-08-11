import React, { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'

// Generic types for the dropdown
export interface FilterDropdownProps<T, K extends keyof T> {
  data: T[]
  filterKey: K
  filterValue: T[K] | null
  onFilterChange: (value: T[K] | null) => void
  displayKey: keyof T
  placeholder?: string
  label?: string
  className?: string
}

export function FilterDropdown<T, K extends keyof T>({
  data,
  filterKey,
  filterValue,
  onFilterChange,
  displayKey,
  placeholder = 'Select an option',
  label,
  className = ''
}: FilterDropdownProps<T, K>) {
  const [isOpen, setIsOpen] = useState(false)

  // Get unique values for the filter dropdown
  const uniqueOptions = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item[filterKey])))
    return unique.filter((value) => value != null)
  }, [data, filterKey])

  const handleSelect = (value: T[K] | null) => {
    onFilterChange(value)
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (!filterValue) return placeholder

    // Find the item that matches the filter value to get its display text
    const matchingItem = data.find((item) => item[filterKey] === filterValue)
    return matchingItem ? String(matchingItem[displayKey]) : String(filterValue)
  }

  return (
    <div className={`relative inline-block w-full max-w-xs ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="block truncate">{getDisplayValue()}</span>
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          >
            All items
          </button>

          {uniqueOptions.map((optionValue, index) => {
            const matchingItem = data.find((item) => item[filterKey] === optionValue)
            const displayText = matchingItem
              ? String(matchingItem[displayKey])
              : String(optionValue)

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(optionValue)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  filterValue === optionValue ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                }`}
              >
                {displayText}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
