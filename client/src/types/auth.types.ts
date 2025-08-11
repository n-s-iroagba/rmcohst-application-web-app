export type UserRole = 'admin' | 'applicant' | 'head-of-admissions' | 'admission-officer'

export interface User {
  id: string
  username: string
  role: UserRole
  email: string
}

export interface LoginRequestDto {
  email: string
  password: string
}

export interface SignUpRequestDto {
  email: string
  password: string
  username: string
  confirmPassword: string
}

export type SignUpResponseDto = {
  verificationToken: string
  id: number
}
export interface VerifyEmailRequestDto {
  verificationCode: string
  verificationToken: string
}
export interface LoginRequestDto {
  email: string
  password: string
}
export type AuthServiceLoginResponse = {
  user: User
  accessToken: string
  refreshToken: string
}

export type LoginResponseDto = {
  accessToken: string
  user: User
}

export interface ForgotPasswordRequestDto {
  email: string
}

export type ForgotPasswordResponseDto = {
  resetPasswordToken: string
}

export interface ResetPasswordRequestDto {
  resetPasswordToken: string
  password: string
  confirmPassword: string
}

export interface ResendVerificationRequestDto extends SignUpResponseDto {}
export interface ResendVerificationRespnseDto extends SignUpResponseDto {}
