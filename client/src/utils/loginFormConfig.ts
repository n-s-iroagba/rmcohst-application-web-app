import { ApplicantSSCQualification } from "@/types/applicant_ssc_qualification";
import { ForgotPasswordRequestDto, LoginRequestDto, ResetPasswordRequestDto, SignUpRequestDto } from "@/types/auth.types";
import {  FieldsConfig } from "@/types/fields_config";

export const loginFormConfig:FieldsConfig<LoginRequestDto> = {
      email:{
        type: 'email'},
      password:{type: 'password'}
    }
export const resetPasswordFormConfig:FieldsConfig<Partial<ResetPasswordRequestDto>> = {
     
      password:{type: 'password'},
      confirmPassword:{type:'password'}
    }

export const forgotPasswordFormConfig:FieldsConfig<ForgotPasswordRequestDto> = {
      email:{
        type: 'email'},
 
    }
export const signUpFormConfig:FieldsConfig<SignUpRequestDto> = {
  username:{
    type:'text'
  },   
  email:{
        type: 'email'},
      password:{type: 'password'},
      confirmPassword:{type:'password'}
    }


    export const sscQualificationFormConfig: FieldsConfig<Partial<ApplicantSSCQualification>> = {
  numberOfSittings: {
    type: 'number'
  },
  certificateTypes: {
    type: 'select'
  },
  certificates: {
    type: 'file'
  },
  firstSubjectId: {
    type: 'select'
  },
  firstSubjectGrade: {
    type: 'select'
  },
  secondSubjectId: {
    type: 'select'
  },
  secondSubjectGrade: {
    type: 'select'
  },
  thirdSubjectId: {
    type: 'select'
  },
  thirdSubjectGrade: {
    type: 'select'
  },
  fourthSubjectId: {
    type: 'select'
  },
  fourthSubjectGrade: {
    type: 'select'
  },
  fifthSubjectId: {
    type: 'select'
  },
  fifthSubjectGrade: {
    type: 'select'
  }
}