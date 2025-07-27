export type UserRole = 'admin' | 'applicant' | 'head_of_admissions'|'admission_officer';

export interface User {
  id: string;
  firstName: string;
  role: UserRole;
  email:string
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface SignUpRequestDto {
  email: string;
  password: string;
  username:string
  confirmPassword: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequestDto {
  id:string
  code: string
  token: string
}
export interface ResendVerificationRequestDto {
  id:string
  token: string;
}

export type SignUpResponseDto = {
  id:string
  verificationToken: string;
};

export type LoginResponseDto = {
  accessToken: string;
  user: User;
};

export type ResetPasswordResponseDto = {
  resetPasswordToken: string;
};
export interface ResendVerificationRespnseDto {
  id:string
  token: string
}

export interface ForgotPasswordRequestDto {
  email: string;
}

