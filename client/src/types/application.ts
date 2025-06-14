import type { BiodataAttributes } from "./biodata" // Corrected type name
import type { ApplicantSSCQualificationAttributes } from "./applicant_ssc_qualification" // Corrected type name
import type { ApplicantProgramSpecificQualificationAttributes } from "./applicant_program_specific_qualification" // Corrected type name
import type { ProgramAttributes } from "./program" // Corrected type name
import type { ApplicantDocumentAttributes } from "./applicant_document" // Added import

// Ensure this enum is consistent with the server-side ApplicationStatus
// server/src/models/Application.ts
export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  PENDING_APPROVAL = "PENDING_APPROVAL", // HOA Review
  APPROVED = "APPROVED", // Approved by HOA
  REJECTED = "REJECTED", // Rejected by Admin or HOA
  ADMITTED = "ADMITTED", // Admission letter generated
  // Add other statuses as needed, e.g., OFFER_ACCEPTED, ENROLLED
}

// This enum seems to be for a more granular client-side step tracking.
// It can be useful for UI, but the canonical status should be ApplicationStatus.
export enum ClientApplicationStatus {
  APPLICATION_FEE_PENDING = "APPLICATION_FEE_PENDING", // If payment is a step
  APPLICATION_PAID = "APPLICATION_PAID",
  BIODATA = "BIODATA", // Biodata section started/completed
  SSC_QUALIFICATION = "SSC_QUALIFICATION", // SSC section started/completed
  PROGRAM_CHOICE = "PROGRAM_CHOICE", // Program choice made
  PROGRAM_SPECIFIC_QUALIFICATION = "PROGRAM_SPECIFIC_QUALIFICATION", // Program specific started/completed
  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD", // Generic documents section
  REVIEW_AND_SUBMIT = "REVIEW_AND_SUBMIT", // Ready for final review by applicant
  SUBMITTED = "SUBMITTED", // Same as ApplicationStatus.SUBMITTED
  // Admin/HOA statuses can mirror ApplicationStatus or have their own client-side variants
  ADMISSION_OFFICER_REVIEW = "ADMISSION_OFFICER_REVIEW", // Equivalent to UNDER_REVIEW
  HOA_REVIEW = "HOA_REVIEW", // Equivalent to PENDING_APPROVAL
  ADMITTED = "ADMITTED", // Same as ApplicationStatus.ADMITTED
  REJECTED = "REJECTED", // Same as ApplicationStatus.REJECTED
  OFFERED = "OFFERED", // If there's a distinct offer step after ADMITTED
  ACCEPTED = "ACCEPTED", // Applicant accepts offer
  ACCEPTANCE_PAID = "ACCEPTANCE_PAID", // Acceptance fee paid
  ENROLLED = "ENROLLED", // Final step
}

export interface Application {
  id: string // Assuming UUID from server
  applicantUserId: string
  programId?: string | null
  // biodataId?: string | null // This might not be needed if biodata is directly linked or part of application
  status: ApplicationStatus
  admissionLetterUrl?: string | null
  rejectionReason?: string | null
  adminComments?: string | null
  hoaComments?: string | null
  submittedAt?: string | null

  createdAt: string // Date as string
  updatedAt: string // Date as string

  // Populated fields from server, ensure they are optional if not always present
  Program?: ProgramAttributes | null // Changed to ProgramAttributes, ensure consistency
  Biodata?: BiodataAttributes | null // Changed to BiodataAttributes
  ApplicantSSCQualification?: ApplicantSSCQualificationAttributes | null // Assuming one SSC qual per app, or make it an array
  ApplicantProgramSpecificQualifications?: ApplicantProgramSpecificQualificationAttributes[] | null // Changed to Attributes
  ApplicantDocuments?: ApplicantDocumentAttributes[] | null // Added for generic documents
}

// This interface seems to be for a specific list view or admin context.
// Ensure its properties and types are consistent with your actual data models.
export interface ApplicationAttributes {
  id: string // Changed to string to match Application.id
  userId: string // Changed to string
  // admissionOfficerId?: string | null // Changed to string
  academicSessionId: string // Changed to string
  programId?: string | null // Changed to string
  status: ApplicationStatus // Standardized to ApplicationStatus
  admissionLetterUrl?: string | null
  adminComments?: string | null
  hoaComments?: string | null
  submittedAt?: string | null
  user?: { id: string; email: string; firstName?: string; lastName?: string } // User details
  program?: { id: string; name: string } // Program details
  // bioData?: BiodataAttributes // If needed
  academicSession?: { id: string; name: string; isActive: boolean } // Academic session details
  createdAt: string
  updatedAt: string
}

export interface ApplicationStatusCount {
  status: ApplicationStatus // Standardized to ApplicationStatus
  count: number
}
