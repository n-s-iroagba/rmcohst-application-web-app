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

export interface JwtPayload extends JwtPayloadBase {
  id?: number
  role?: string
  [key: string]: any
}

export type LoginAuthServiceReturn = {
  user: AuthUser
  accessToken: string
  refreshToken: string
}
export interface LoginRequestDto {
  email: string
  password: string
}

export type SignUpRequestDto= {
  email: string
  password: string
  username:string
  confirmPassword: string
}

export interface ForgotPasswordRequestDto {
  email: string
}

export interface ResetPasswordRequestDto {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailRequestDto {
  code: string
  token: string
}

export interface ResendVerificationRequestDto {
  id:string
  token: string
}
export interface ResendVerificationRespnseDto {
  id:string
  token: string
}
export type SignUpResponseDto = {
  verificationToken: string
  id:number

}

export type LoginResponseDto = {
  accessToken: string
  user: AuthUser
}

export type ResetPasswordResponseDto = {
  resetPasswordToken: string
}
