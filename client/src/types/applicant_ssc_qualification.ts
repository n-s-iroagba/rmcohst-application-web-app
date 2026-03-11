import { Grade } from './program_ssc_requirement'
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApplicantSSCQualification {
  id: number
  applicationId: string
  numberOfSittings: number
  certificateTypes: string[]
  certificates?: File[] | Blob[] | []
  firstSubjectId: string
  firstSubjectGrade: Grade
  secondSubjectId: string
  secondSubjectGrade: Grade
  thirdSubjectId: string
  thirdSubjectGrade: Grade
  fourthSubjectId: string
  fourthSubjectGrade: Grade
  fifthSubjectId: string
  fifthSubjectGrade: Grade
  completed: boolean
}

export interface SSCQualificationFormData
  extends Omit<ApplicantSSCQualification, 'id' | 'applicationId' | 'completed'> {

}
