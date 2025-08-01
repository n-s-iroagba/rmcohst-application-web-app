import { JwtPayload as JwtPayloadBase } from 'jsonwebtoken'
import { AuthUser } from '../models/User'


export interface AuthConfig {
  jwtSecret: string
  clientUrl: string
  tokenExpiration: {
    verification: number
    login: number
    refresh: number
  }
}

export type SignUpRequestDto= {
  email: string
  password: string
  username:string
  confirmPassword: string
}
export type SignUpResponseDto = {
  verificationToken: string
  id:number
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
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export type LoginResponseDto = {
  accessToken: string
  user: AuthUser
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
export interface ResendVerificationRequestDto extends SignUpResponseDto{}
export interface ResendVerificationRespnseDto extends SignUpResponseDto{}




