export interface ApplicationProgramSpecificQualification {
  id: number
  applicationId: number
  qualificationType: string
  grade:string
  completed:boolean
  certificate: File|Blob|null
  createdAt?: Date
  updatedAt?: Date
}
export interface ProgramSpecificQualificationFormdata extends Omit< ApplicationProgramSpecificQualification, 'id' | 'createdAt' | 'updatedAt'|'applicationId'|'isComplete'> {}