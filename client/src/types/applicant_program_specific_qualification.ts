export interface ApplicationProgramSpecificQualification {
  id: number

  applicationId: number
  qualificationType: string
  grade:string
  certificates: File
  createdAt?: Date
  updatedAt?: Date
}
