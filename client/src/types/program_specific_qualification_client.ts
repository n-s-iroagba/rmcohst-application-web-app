// This type will be used on the client-side form
export interface ClientProgramSpecificQualification {
  id?: number // For existing qualifications
  programRequirementId: number // Links to the ProgramSpecificQualification (requirement)
  qualificationType: string // Display purposes, fetched from program requirement
  grade: string
  certificateFile?: File | null
  certificateUrl?: string | null // For displaying existing certificate
  certificateDriveId?: string | null
}

export interface ProgramRequirement {
  id: number
  qualificationType: string
  minimumGrade?: string // Optional, for display
}
