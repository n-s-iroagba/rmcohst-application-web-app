export interface Biodata {
  id: number
  applicationId: number
  firstName: string
  surname: string
  otherNames: string 
  email: string 
  dateOfBirth: Date 
   gender: string
  maritalStatus: string
  phoneNumber:string
  nationality: string
  stateOfOrigin: string
  localGovernmentArea: string
  contactAddress: string 
  passportPhotograph: Buffer
  nextOfKinName: string 
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  nextOfKinRelationship: string 
  completed: boolean
  homeTown: string
}
