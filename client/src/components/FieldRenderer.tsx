import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  FileField,
  DoubleSelectField
} from './FormFields'

type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'double-select'

export type FieldConfig = {
  name: string // main identifier (e.g., index in array)
  label?: string
  type: FieldType

  // For select
  options?: string[] | { id: string | number; label: string }[]

  // For double-select
  fieldGroup?: {
    firstField: {
      name: string
      label: string
      options: { id: string | number; label: string }[]
    }
    secondField: {
      name: string
      label: string
      options: { id: string | number; label: string }[]
    }
  }
}

type FieldRendererProps<T> = {
  data: T
  errors?: Partial<Record<keyof T, string>>
  fieldsConfig: {
    [K in keyof T]?: FieldConfig
  }
  handlers: {
    [K in keyof T]?: ((e: any, index?: number) => void) |((e: React.ChangeEvent<HTMLSelectElement>, index: number) => void)
  }
}

export function FieldRenderer<T extends Record<string, any>>({
  data,
  errors = {},
  fieldsConfig,
  handlers
}: FieldRendererProps<T>) {
  return (
    <>
      {Object.entries(fieldsConfig).map(([key, config]) => {
        const value = data[key as keyof T]
        const error = errors[key as keyof T]
        const onChange = handlers[key as keyof T]

        if (!config) return null

        switch (config.type) {
          case 'textarea':
            return (
              <TextareaField
                key={key}
                name={key}
                label={config.label || key}
                value={value}
                onChange={onChange}
                error={error}
              />
            )

          case 'double-select':
            if (!config.fieldGroup) {
              console.error(`Double-select field "${key}" is missing fieldGroup config`)
              return null
            }
            if (!onChange){
              console.error(`Double-select field "${key}" is missing onChange handler`)
              return null
            }
            
            return (
              <div key={key} className="mb-4">
                {config.label && (
                  <label className="block font-medium mb-2">{config.label}</label>
                )}
                <DoubleSelectField
                  index={0}
                  data={Array.isArray(value) ? value : [value || {}]}
                  config={config}
                  onChange={onChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            )

          case 'select':
            return (
              <SelectField
                key={key}
                name={key}
                label={config.label || key}
                value={value}
                options={config.options}
                onChange={onChange}
                error={error}
              />
            )

          case 'checkbox':
            return (
              <CheckboxField
                key={key}
                name={key}
                label={config.label || key}
                checked={value}
                onChange={onChange}
                error={error}
              />
            )

          case 'file':
            return (
              <FileField
                key={key}
                name={key}
                label={config.label || key}
                onChange={onChange}
                error={error}
              />
            )

          case 'text':
          default:
            return (
              <TextField
                key={key}
                name={key}
                label={config?.label || key}
                value={value}
                onChange={onChange}
                error={error}
              />
            )
        }
      })}
    </>
  )
}