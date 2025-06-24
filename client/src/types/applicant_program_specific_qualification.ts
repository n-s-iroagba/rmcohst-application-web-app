export interface ApplicationProgramSpecificQualification {
  id: number

  applicationId: number
  qualificationType: string
  gradeId: number
  certificate: string
  createdAt?: Date
  updatedAt?: Date
}
