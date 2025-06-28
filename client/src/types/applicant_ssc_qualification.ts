export interface ApplicantSSCQualification {
  id: number
  applicationId: number
  numberOfSittings: number
  certificateTypes: string[]
  certificates?: string[]
  minimumGrade?: string
  createdAt?: Date
  updatedAt?: Date
}

interface ApplicantSubjectAndGrade {
  subjectId: number
  gradeId: number
}

export interface SSCQualificationFormData {
  certificateTypes: string[]
  certificates: File[]
  numberOfSittings: number
  minimumGrade: string
  subjectsAndGrades: ApplicantSubjectAndGrade[]
}

interface Subject {
  id: number
  name: string
}

interface Grade {
  id: number
  name: string
  gradePoint: number
}