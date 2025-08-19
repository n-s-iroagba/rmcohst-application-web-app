import { Biodata } from "@/types/biodata";
import { FieldsConfig } from "@/types/fields_config";

export const biodataFormConfig: FieldsConfig<Partial<Biodata>> = {
  firstName: {
    type: 'text'
  },
  surname: {
    type: 'text'
  },
  otherNames: {
    type: 'text'
  },
  email: {
    type: 'email'
  },
  dateOfBirth: {
    type: 'date'
  },
  gender: {
    type: 'select',
   
  },
  maritalStatus: {
    type: 'select',
   
  },
  nationality: {
    type: 'text'
  },
  stateOfOrigin: {
    type: 'text'
  },
  localGovernmentArea: {
    type: 'text'
  },
  homeTown: {
    type: 'text'
  },
  contactAddress: {
    type: 'textarea'
  },
  passportPhotograph: {
    type: 'file',

  },
  nextOfKinName: {
    type: 'text'
  },
  nextOfKinPhoneNumber: {
    // type: 'tel'
     type: 'number'
  },
  nextOfKinAddress: {
    type: 'textarea'
  },
  nextOfKinRelationship: {
    type: 'select'
  }
}