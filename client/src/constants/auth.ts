// ---------- Default objects for each DTO ----------

import {
  User,
  LoginRequestDto,
  SignUpRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyEmailRequestDto,
  ResendVerificationRequestDto,
} from '@/types/auth.types';

// export const DEFAULT_USER: User = {
//   id: 'user-id-123',
//   user: 'John',
//   role: 'applicant',
// };

export const LOGIN_FORM_DEFAULT_DATA: LoginRequestDto = {
  email: '',
  password: '',
};

export const SIGNUP_FORM_DEFAULT_DATA: SignUpRequestDto = {
  
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const testSuccessfulUser: SignUpRequestDto = {
 
  username: 'Doe',
  email: 'nnamdisolomon1@gmail.com',
  password: 'SecurePassword123!',
  confirmPassword: 'SecurePassword123!',
};

export const testLoginUser: LoginRequestDto = {
  email: 'nnamdisolomon1@gmail.com',
  password: 'SecurePassword123!',
};

export const FORGOT_PASSWORD_DEFAULT_DATA: ForgotPasswordRequestDto = {
  email: '',
};

export const RESET_PASSWORD_DEFAULT_DATA: ResetPasswordRequestDto = {
  token: '',
  password: '',
  confirmPassword: '',
};

export const VERIFY_EMAIL_DEFAULT_DATA: VerifyEmailRequestDto= {
   id:'',
  code: '',
  token: ''
};

export const RESEND_VERIFICATION_DEFAULT_DATA: ResendVerificationRequestDto = {
  token: '',
  id:''
};
