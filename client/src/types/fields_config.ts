import { ChangeEvent } from "react"

export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'double-select' | 'radio'|'date'

export  type FieldConfig = {
  onChangeHandler?:
   | ((e: any, index?: number) => void)
    | ((e: any, index: number) => void)
    // | ((e: any, index: number, subFieldKey: string) => void)
    | ((e: ChangeEvent<HTMLSelectElement>) => void)
    | ((e: ChangeEvent<HTMLInputElement>) => void)
    
    

  type: FieldType

  /**
   * Used by:
   * - select
   * - radio
   */
  options?: string[] | { id: string | number; label: string }[]

  /**
   * Used by double-select or multi-group fields
   */
  fieldGroup?: {
    groupKey: string
    fields: {
      name: string
      label: string
      options: { id: string | number; label: string }[]
    }[]
    addHandler: () => void
    removeHandler: (index: number) => void
    onChangeHandler: (e: ChangeEvent<HTMLSelectElement>,index:number, field:string) => void
  }
}
export type FieldsConfig<T> = {
  [key in keyof T]: FieldConfig

} 