import { ApplicationProgramSpecificQualification } from './applicant_program_specific_qualification'
import { ApplicantSSCQualification } from './applicant_ssc_qualification'
import { Biodata } from './biodata'
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ADMITTED = 'ADMITTED'
}

export interface Application {
  id: number
  applicantUserId: number
  programId: number
  biodataId: number
  biodata: Biodata
  sscQualifications: ApplicantSSCQualification[]
  programSpecificQualifications: ApplicationProgramSpecificQualification[]

  sessionId: number
  assignedOfficerId?: string
  status: ApplicationStatus
  admissionLetterUrl?: string | null
  rejectionReason?: string | null
  adminComments?: string | null
  hoaComments?: string | null
  submittedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}
