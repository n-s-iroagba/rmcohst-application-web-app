export interface Biodata {
  id: number
  applicationId: number
  lastName: string
  middleName: string | null
  surname: string
  gender: string
  dateOfBirth: Date
  maritalStatus: string
  homeAddress: string
  nationality: string
  stateOfOrigin: string
  lga: string
  homeTown: string
  phoneNumber: string
  emailAddress: string
  passportPhotograph: File | Blob | null
  nextOfKinFullName: string
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  relationshipWithNextOfKin: string
}
