export interface Session {
 id: number
  name: string
applicationStartDate:Date
applicationEndDate: Date
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
}

export type AcademicSessionCreationDto = Omit<Session, 'id' | 'isCurrent'|'createdAt'|'updatedAt'>
