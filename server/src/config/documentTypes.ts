// server/src/config/documentTypes.ts
export enum ServerApplicantDocumentType {
  BIRTH_CERTIFICATE = 'Birth Certificate',
  LGA_IDENTIFICATION = 'LGA Identification',
  ACADEMIC_TRANSCRIPT_PREVIOUS = 'Previous Academic Transcript',
  SPONSORSHIP_LETTER = 'Sponsorship Letter',
  NATIONAL_ID = 'National ID Card/NIN Slip',
  PASSPORT_PHOTOGRAPH = 'Passport Photograph', // Often part of biodata but can be separate
  SSC_CERTIFICATE = 'SSC Certificate/Statement of Result', // For SSC qualification
  OTHER_SUPPORTING_DOCUMENT = 'Other Supporting Document',
}

// This is the named export the error message is looking for.
export const DOCUMENT_TYPES = Object.values(ServerApplicantDocumentType)

export const isValidApplicantDocumentType = (type: string): type is ServerApplicantDocumentType => {
  return DOCUMENT_TYPES.includes(type as ServerApplicantDocumentType)
}
