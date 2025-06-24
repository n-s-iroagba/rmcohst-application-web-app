export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'double-select'
export type FieldConfig = {
  type: FieldType
  onchangeHandler:
    | ((
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
        parentIndex?: number,
        subjectKey?: string,
        subjectIndex?: number,
        entityKey?: string
      ) => void)
    | ((
        e: React.ChangeEvent<HTMLTextAreaElement>,
        index?: number,
        parentIndex?: number,
        subjectKey?: string,
        subjectIndex?: number,
        entityKey?: string
      ) => void)
    | ((
        e: React.ChangeEvent<HTMLSelectElement>,
        index?: number,
        parentIndex?: number,
        subjectKey?: string,
        subjectIndex?: number,
        entityKey?: string
      ) => void)
    | ((
        e: React.ChangeEvent<HTMLInputElement>,
        index?: number,
        parentIndex?: number,
        subjectKey?: string,
        subjectIndex?: number,
        entityKey?: string
      ) => void)

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
