import {
  LoginRequestDto,
  SignUpRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto,
} from '@/types/auth.types';
import { FieldConfigInput } from '@/types/fields_config';

export const LoginConfigInput: FieldConfigInput<LoginRequestDto> = {
  email: 'text',
  password: 'text', // You might want to use a custom 'password' type if available
};

export const SignUpConfigInput: FieldConfigInput<SignUpRequestDto> = {
  email: 'text',
  password: 'text',
  firstName: 'text',
  lastName: 'text',
  confirmPassword: 'text',
};

export const ForgotPasswordConfigInput: FieldConfigInput<ForgotPasswordRequestDto> =
  {
    email: 'text',
  };

export const ResetPasswordConfigInput: FieldConfigInput<ResetPasswordRequestDto> =
  {
    token: 'text', // This might be hidden or readonly in the actual form
    password: 'text',
    confirmPassword: 'text',
  };

export const VerifyEmailConfigInput: FieldConfigInput<VerifyEmailRequestDto> = {
  verificationCode: 'text',
};
