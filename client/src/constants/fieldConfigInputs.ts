import {
  LoginRequestDto,
  SignUpRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto
} from '@/types/auth.types'
import { FieldConfigInput } from '@/types/fields_config'

export const LoginConfigInput: FieldConfigInput<LoginRequestDto> = {
  email: 'text',
  password: 'text' // You might want to use a custom 'password' type if available
}

export const SignUpConfigInput: FieldConfigInput<SignUpRequestDto> = {
  email: 'text',
  password: 'text',
  username: 'text',
  confirmPassword: 'text'
}

export const ForgotPasswordConfigInput: FieldConfigInput<ForgotPasswordRequestDto> = {
  email: 'text'
}

export const ResetPasswordConfigInput: FieldConfigInput<Omit<ResetPasswordRequestDto, 'token'>> = {
  password: 'text',
  confirmPassword: 'text'
}

export const VerifyEmailConfigInput: FieldConfigInput<Omit<VerifyEmailRequestDto, 'id'>> = {
  code: 'text',
  token: 'text'
}
