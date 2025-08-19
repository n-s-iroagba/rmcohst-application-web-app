// ---------- Default objects for each DTO ----------

import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  ResendVerificationRequestDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto
} from '@/types/auth.types'



export const LOGIN_FORM_DEFAULT_DATA: LoginRequestDto = {
  email: '',
  password: ''
}

export const SIGNUP_FORM_DEFAULT_DATA: SignUpRequestDto = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}



export const FORGOT_PASSWORD_DEFAULT_DATA: ForgotPasswordRequestDto = {
  email: ''
}

export const RESET_PASSWORD_DEFAULT_DATA: ResetPasswordRequestDto = {
  resetPasswordToken: '',
  password: '',
  confirmPassword: ''
}

export const VERIFY_EMAIL_DEFAULT_DATA: VerifyEmailRequestDto = {

  verificationCode: '',
  verificationToken: ''
}

export const RESEND_VERIFICATION_DEFAULT_DATA: ResendVerificationRequestDto = {
  verificationToken: '',
  id: 0
}