export interface AcademicSessionAttributes {
  id: number
  sessionName: string
  startDate: Date
  endDate: Date
  isCurrent: boolean
}

export type AcademicSessionCreationDto = Omit<AcademicSessionAttributes, 'id' | 'isCurrent'>
