export interface Biodata {
  id: number
  applicationId: number
  firstName: string
  surname: string
  otherNames: string // Changed from middleName
  email: string // Changed from emailAddress
  phoneNumber: string
  dateOfBirth: Date
  gender: string
  maritalStatus: string
  nationality: string
  stateOfOrigin: string
  localGovernmentArea: string // Changed from lga
  contactAddress: string // Changed from homeAddress
  permanentHomeAddress: string // New field
  passportPhotograph: Buffer
  nextOfKinName: string // Changed from nextOfKinFullName
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  nextOfKinRelationship: string // Changed from relationshipWithNextOfKin
  completed: boolean
  homeTown: string // Kept for backward compatibility if needed
}
