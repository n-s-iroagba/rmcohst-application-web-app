export interface Session {
  id: number
  name: string
  applicationStartDate: Date
  applicationEndDate: Date
  isCurrent: boolean
}

export type AcademicSessionCreationDto = Omit<Session, 'id' | 'isCurrent'>
