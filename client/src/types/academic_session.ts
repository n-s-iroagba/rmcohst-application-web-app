export interface AcademicSessionAttributes {
  id: number
  sessionName: string
  startDate: Date
  endDate: Date
  isCurrent: boolean
}

export type AcademicSessionCreationAttributes = Omit<AcademicSessionAttributes, "id" | "isCurrent">
