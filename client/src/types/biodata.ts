export interface BiodataAttributes {
  id: number;
  applicationId:number
  firstName?: string;
  middleName?: string | null;
  surname?: string;
  gender?: string;
  dateOfBirth?: Date;
  maritalStatus?: string;
  homeAddress?: string;
  nationality?: string;
  stateOfOrigin?: string;
  lga?: string;
  homeTown?: string;
  phoneNumber?: string;
  emailAddress?: string;
  passportPhotograph?: string;
  nextOfKinFullName?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  relationshipWithNextOfKin?: string;
}

export interface EditBiodataAttributes {
  id: number;
  applicationId:number
  firstName?: string;
  middleName?: string | null;
  surname?: string;
  gender?: string;
  dateOfBirth?: Date;
  maritalStatus?: string;
  homeAddress?: string;
  nationality?: string;
  stateOfOrigin?: string;
  lga?: string;
  homeTown?: string;
  phoneNumber?: string;
  emailAddress?: string;
  passportPhotograph?: File;
  nextOfKinFullName?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  relationshipWithNextOfKin?: string;
}
