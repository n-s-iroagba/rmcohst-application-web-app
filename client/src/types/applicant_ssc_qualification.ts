import { Grade } from "./program_ssc_requirement"
export interface ApplicantSSCQualification {
  id: number
  applicationId: number
  numberOfSittings: number
  certificateTypes: string[]
  certificates?: File[]|Blob[]|[]
  firstSubjectId: number
  firstSubjectGrade: Grade
  secondSubjectId: number
  secondSubjectGrade: Grade
  thirdSubjectId: number
  thirdSubjectGrade: Grade
  fourthSubjectId: number
  fourthSubjectGrade: Grade
  fifthSubjectId: number
  fifthSubjectGrade: Grade
}



export interface SSCQualificationFormData extends Omit<ApplicantSSCQualification,'id'>{}
