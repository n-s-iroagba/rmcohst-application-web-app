import React, { useState, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'

// Generic search bar props
interface SearchBarProps<T> {
  data: T[]
  searchKeys: (keyof T)[]
  onResults: (results: T[]) => void
  placeholder?: string
  debounceMs?: number
  className?: string
  showClearButton?: boolean
  caseSensitive?: boolean
  exactMatch?: boolean
}

// Hook for debouncing search queries
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function GenericSearchBar<T extends Record<string, any>>({
  data,
  searchKeys,
  onResults,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
  showClearButton = true,
  caseSensitive = false,
  exactMatch = false
}: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  // Search function
  const performSearch = useCallback(
    (term: string) => {
      if (!term.trim()) {
        onResults(data)
        return
      }

      const searchValue = caseSensitive ? term : term.toLowerCase()

      const filteredResults = data.filter((item) => {
        return searchKeys.some((key) => {
          const itemValue = item[key]

          // Handle null/undefined values
          if (itemValue == null) return false

          // Convert to string for searching
          const stringValue = String(itemValue)
          const searchableValue = caseSensitive ? stringValue : stringValue.toLowerCase()

          // Perform search based on match type
          return exactMatch
            ? searchableValue === searchValue
            : searchableValue.includes(searchValue)
        })
      })

      onResults(filteredResults)
    },
    [data, searchKeys, onResults, caseSensitive, exactMatch]
  )

  // Trigger search when debounced term changes
  React.useEffect(() => {
    performSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, performSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onResults(data)
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {showClearButton && searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Example usage component
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'technical_admin' | 'editor'
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
}

function SearchBarExample() {
  // Example data
  const users: User[] = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'editor' },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      role: 'technical_admin'
    },
    { id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', role: 'editor' }
  ]

  const products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      price: 999,
      description: 'High-performance laptop'
    },
    { id: 2, name: 'Mouse', category: 'Electronics', price: 25, description: 'Wireless mouse' },
    {
      id: 3,
      name: 'Chair',
      category: 'Furniture',
      price: 199,
      description: 'Ergonomic office chair'
    },
    { id: 4, name: 'Desk', category: 'Furniture', price: 299, description: 'Standing desk' }
  ]

  const [userResults, setUserResults] = useState<User[]>(users)
  const [productResults, setProductResults] = useState<Product[]>(products)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Generic Search Bar Examples</h1>

      {/* User Search */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Search Users</h2>
        <GenericSearchBar<User>
          data={users}
          searchKeys={['firstName', 'lastName', 'email', 'role']}
          onResults={setUserResults}
          placeholder="Search users by name, email, or role..."
          className="mb-4"
        />
        <div className="grid gap-2">
          {userResults.map((user) => (
            <div key={user.id} className="p-3 border rounded-lg bg-gray-50">
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-600">
                {user.email} • {user.role}
              </div>
            </div>
          ))}
        </div>
        {userResults.length === 0 && (
          <div className="text-gray-500 text-center py-4">No users found</div>
        )}
      </div>

      {/* Product Search */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Search Products</h2>
        <GenericSearchBar<Product>
          data={products}
          searchKeys={['name', 'category', 'description']}
          onResults={setProductResults}
          placeholder="Search products by name, category, or description..."
          debounceMs={500}
          className="mb-4"
        />
        <div className="grid gap-2">
          {productResults.map((product) => (
            <div key={product.id} className="p-3 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.category}</div>
                  <div className="text-xs text-gray-500">{product.description}</div>
                </div>
                <div className="font-bold text-green-600">${product.price}</div>
              </div>
            </div>
          ))}
        </div>
        {productResults.length === 0 && (
          <div className="text-gray-500 text-center py-4">No products found</div>
        )}
      </div>

      {/* Advanced Search Example */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Advanced Search (Case Sensitive, Exact Match)
        </h2>
        <GenericSearchBar<User>
          data={users}
          searchKeys={['role']}
          onResults={setUserResults}
          placeholder="Search exact role (try 'admin' vs 'Admin')..."
          caseSensitive={true}
          exactMatch={true}
          className="mb-4"
        />
      </div>
    </div>
  )
}

export default SearchBarExample
