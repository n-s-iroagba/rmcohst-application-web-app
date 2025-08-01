'use client';

import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { clearToken, setAccessToken } from '@/lib/apiUtils';

import { API_ROUTES } from '@/config/routes';
import {
  LoginRequestDto,
  SignUpRequestDto,
  VerifyEmailRequestDto,
  ResendVerificationRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  User,
  LoginResponseDto,
  ResetPasswordResponseDto,
  SignUpResponseDto,
} from '@/types/auth.types';

import {
  FORGOT_PASSWORD_DEFAULT_DATA,
  LOGIN_FORM_DEFAULT_DATA,
  RESEND_VERIFICATION_DEFAULT_DATA,
  RESET_PASSWORD_DEFAULT_DATA,
  SIGNUP_FORM_DEFAULT_DATA,
  VERIFY_EMAIL_DEFAULT_DATA,
} from '@/constants/auth';

import { usePost } from './useApiQuery';
import { useRoutes } from './useRoutes';
import { useRouter } from 'next/navigation';


export const useAuth = () => {
  const { setUser } = useAuthContext();
  const { navigateToDashboard, navigateToLogin, navigateToVerifyEmail } =
    useRoutes();
    const router = useRouter()

  const [authError, setAuthError] = useState<string>('');

  // SIGNUP
  const {
    postResource: signUpRequest,
  
    handlePost: handleSignup,
    posting: signUpLoading,
    changeHandlers: signupChangeHandlers
  
  } = usePost<SignUpRequestDto, SignUpResponseDto>(
    API_ROUTES.AUTH.APPLICANT_SIGNUP,
    SIGNUP_FORM_DEFAULT_DATA
  );

   const {
    postResource: superAdminSignUpRequest,

    handlePost: handlesuperAdminSignUp,
    posting: superAdminSignUpLoading,
  } = usePost<SignUpRequestDto, SignUpResponseDto>(
    API_ROUTES.AUTH.SIGNUP_SUPER_ADMIN,
    SIGNUP_FORM_DEFAULT_DATA
  );

  // LOGIN
  const {
    postResource: loginRequest,
 
    handlePost: handleLogin,
    posting: loginLoading,
  } = usePost<LoginRequestDto, LoginResponseDto | SignUpResponseDto>(
    API_ROUTES.AUTH.LOGIN,
    LOGIN_FORM_DEFAULT_DATA
  );

  // VERIFY EMAIL
  const {
    postResource: verifyEmailRequest,
  
    handlePost: handleVerifyEmail,
    posting: verifyEmailLoading,
  } = usePost<VerifyEmailRequestDto, LoginResponseDto>(
    API_ROUTES.AUTH.VERIFY_EMAIL,
    VERIFY_EMAIL_DEFAULT_DATA
  );

  // RESEND VERIFICATION
  const {
    postResource: resendVerificationRequest,

    handlePost: handleResendVerification,
    posting: resendVerificationLoading,
  } = usePost<ResendVerificationRequestDto, SignUpResponseDto>(
    API_ROUTES.AUTH.RESEND_VERIFICATION_CODE,
    RESEND_VERIFICATION_DEFAULT_DATA
  );

  // FORGOT PASSWORD
  const {
    postResource: forgotPasswordRequest,
    changeHandlers: forgotPasswordChangeHandler,
    handlePost: handleForgotPassword,
    posting: forgotPasswordLoading,
  } = usePost<ForgotPasswordRequestDto, ResetPasswordResponseDto>(
    API_ROUTES.AUTH.FORGOT_PASSWORD,
    FORGOT_PASSWORD_DEFAULT_DATA
  );

  // RESET PASSWORD
  const {
    postResource: resetPasswordRequest,

    handlePost: handleResetPassword,
    posting: resetPasswordLoading,
  } = usePost<ResetPasswordRequestDto, LoginResponseDto>(
    API_ROUTES.AUTH.RESET_PASSWORD,
    RESET_PASSWORD_DEFAULT_DATA
  );

  // LOGOUT (dummy for now)
  const logout = () => {
    clearToken();
    setUser(null);
    navigateToLogin();
  };

  // SIGNUP action
  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
  const responsee =  await handleSignup(e) ;
    console.log('signup respnse is',responsee)
    const signUpResponse = responsee as unknown as SignUpResponseDto
    if (signUpResponse?.verificationToken) {
      router.push(`/auth/verify-email/${signUpResponse.verificationToken}/${signUpResponse.id}`)
    }
  };
  const signUpSuperAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
   const superAdminSignUpResponse=  await handlesuperAdminSignUp(e) as unknown as  SignUpResponseDto;;
    if (superAdminSignUpResponse?.verificationToken) {
      navigateToVerifyEmail(superAdminSignUpResponse.verificationToken,superAdminSignUpResponse.id);
    }
  };

  // LOGIN action
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginResponse = await handleLogin(e) as unknown as  LoginResponseDto|SignUpResponseDto;;

  

    if ('accessToken' in loginResponse && 'user' in loginResponse) {
      setAccessToken(loginResponse.accessToken);
      setUser(loginResponse.user);
      navigateToDashboard(loginResponse.user.role);
    } else if ('verificationToken' in loginResponse && 'in'in loginResponse) {
      navigateToVerifyEmail(loginResponse.verificationToken,loginResponse.id);
    }
  };

  // VERIFY EMAIL action
  const verifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    const verifyEmailResponse =await handleVerifyEmail(e) as unknown as  LoginResponseDto;
    if (verifyEmailResponse?.accessToken) {
      setAccessToken(verifyEmailResponse.accessToken);
      setUser(verifyEmailResponse.user);
      navigateToDashboard(verifyEmailResponse.user.role);
    }
  };

  // RESEND verification
  const resendVerificationCode = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    await handleResendVerification(e);
  };

  // FORGOT password
  const forgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    await handleForgotPassword(e);
  };

  // RESET password
  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
  const resetPasswordResponse =  await handleResetPassword(e) as any;
    if (resetPasswordResponse) {
      navigateToLogin();
    }
  };

  const isAuthLoading =
    loginLoading ||
    signUpLoading ||
    verifyEmailLoading ||
    resendVerificationLoading ||
    forgotPasswordLoading ||
    resetPasswordLoading;

  return {
    loading: isAuthLoading,
    error: authError,
  
    // loginResponse,
    // verifyEmailResponse,
    // resendVerificationResponse,
    // forgotPasswordResponse,
    // resetPasswordResponse,
    forgotPasswordChangeHandler,
    signUpRequest,
    loginRequest,
    verifyEmailRequest,
    resendVerificationRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    superAdminSignUpRequest,


    signupChangeHandlers,
    login,
    signUp,
    signUpSuperAdmin,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    logout,

    clearError: () => setAuthError('')
  };
};
