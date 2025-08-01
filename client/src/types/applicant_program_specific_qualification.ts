export interface ApplicationProgramSpecificQualification {
  id: number
  applicationId: number
  qualificationType: string
  grade:string
  certificate: File|Blob|null
  createdAt?: Date
  updatedAt?: Date
}
