import { Grade } from './program_ssc_requirement'
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ApplicantSSCQualification {
  id: number
  applicationId: number
  numberOfSittings: number
  certificateTypes: string[]
  certificates?: File[] | Blob[] | []
  firstSubject: number
  firstSubjectGrade: Grade
  secondSubject: number
  secondSubjectGrade: Grade
  thirdSubject: number
  thirdSubjectGrade: Grade
  fourthSubject: number
  fourthSubjectGrade: Grade
  fifthSubject: number
  fifthSubjectGrade: Grade
  completed: boolean
}

export interface SSCQualificationFormData
  extends Omit<ApplicantSSCQualification, 'id' | 'applicationId' | 'completed'> {

}
