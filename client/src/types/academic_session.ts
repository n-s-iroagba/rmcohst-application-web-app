export interface AcademicSessionAttributes {
  id: number
  name: string
applicationStartDate:Date
applicationEndDate: Date
  isCurrent: boolean
}

export type AcademicSessionCreationDto = Omit<AcademicSessionAttributes, 'id'|'isCurrent'>
