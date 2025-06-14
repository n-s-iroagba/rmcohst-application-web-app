// Ensure this file (client/src/types/applicant_document.ts) has this named export:
// ALL_CLIENT_APPLICANT_DOCUMENT_TYPES

// These are types for client-side display and selection.
// The actual validation of document types happens on the server.
export enum ClientApplicantDocumentType {
  BIRTH_CERTIFICATE = "Birth Certificate",
  LGA_IDENTIFICATION = "LGA Identification",
  ACADEMIC_TRANSCRIPT_PREVIOUS = "Previous Academic Transcript",
  SPONSORSHIP_LETTER = "Sponsorship Letter",
  NATIONAL_ID = "National ID Card/NIN Slip",
  PASSPORT_PHOTOGRAPH = "Passport Photograph",
  SSC_CERTIFICATE = "SSC Certificate/Statement of Result",
  OTHER_SUPPORTING_DOCUMENT = "Other Supporting Document",
}

export const ALL_CLIENT_APPLICANT_DOCUMENT_TYPES = Object.values(ClientApplicantDocumentType)

export interface ApplicantDocumentAttributes {
  id: string
  applicationId: string
  documentType: string // Should match one of the ClientApplicantDocumentType values or server-side enum
  fileName: string
  fileUrl: string // URL to view/download the document
  fileSize?: number | null
  mimeType?: string | null
  googleDriveFileId?: string | null // If using Google Drive
  createdAt: string // Date as string
  updatedAt: string // Date as string
}
