export interface ApplicantSSCQualification {
  id: number
  applicationId: number
  numberOfSittings?: number | null
  certificateTypes?: string[]
  certificates?: string[]
  minimumGrade?: string
  createdAt?: Date
  updatedAt?: Date
}
