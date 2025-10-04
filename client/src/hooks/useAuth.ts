'use client'

import { useAuthContext } from '@/context/AuthContext'
import { clearToken, setAccessToken } from '@/lib/api'
import { useState } from 'react'

import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '@/types/auth.types'

import {
  FORGOT_PASSWORD_DEFAULT_DATA,
  LOGIN_FORM_DEFAULT_DATA,
  RESET_PASSWORD_DEFAULT_DATA,
  SIGNUP_FORM_DEFAULT_DATA
} from '@/constants/auth'

import { useRouter } from 'next/navigation'
import { API_ROUTES } from '../constants/apiRoutes'
import { ApiError, handleError } from '../helpers/handleError'
import { usePost } from './useApiQuery'
import { useRoutes } from './useRoutes'

export const useAuth = () => {
  const { setUser } = useAuthContext()
  const { navigateToDashboard, navigateToLogin, navigateToVerifyEmail } = useRoutes()
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const [authError, setAuthError] = useState<string>('')
  const googleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }
  // SIGNUP
  const {
    postResource: signUpRequest,

    handlePost: handleSignup,
    posting: signUpLoading,
    changeHandlers: signupChangeHandlers
  } = usePost<SignUpRequestDto, SignUpResponseDto>(
    API_ROUTES.AUTH.APPLICANT_SIGNUP,
    SIGNUP_FORM_DEFAULT_DATA
  )

  const {
    postResource: superAdminSignUpRequest,

    handlePost: handlesuperAdminSignUp,
    posting: superAdminSignUpLoading
  } = usePost<SignUpRequestDto, SignUpResponseDto>(
    API_ROUTES.AUTH.SIGNUP_SUPER_ADMIN,
    SIGNUP_FORM_DEFAULT_DATA
  )

  // LOGIN
  const {
    postResource: loginRequest,
    changeHandlers: loginChangeHandlers,
    handlePost: handleLogin,
    posting: loginLoading,
    apiError: loginError
  } = usePost<LoginRequestDto, LoginResponseDto | SignUpResponseDto>(
    API_ROUTES.AUTH.LOGIN,
    LOGIN_FORM_DEFAULT_DATA
  )





  // FORGOT PASSWORD
  const {
    postResource: forgotPasswordRequest,
    changeHandlers: forgotPasswordChangeHandler,
    handlePost: forgotPassword,
    posting: forgotPasswordLoading
  } = usePost<ForgotPasswordRequestDto, ForgotPasswordResponseDto>(
    API_ROUTES.AUTH.FORGOT_PASSWORD,
    FORGOT_PASSWORD_DEFAULT_DATA
  )

  // RESET PASSWORD
  const {
    postResource: resetPasswordRequest,
    changeHandlers: resetPasswordChangeHandlers,
    handlePost: handleResetPassword,
    posting: resetPasswordLoading,
    mutation: resetPasswordMutation
  } = usePost<ResetPasswordRequestDto, LoginResponseDto>(
    API_ROUTES.AUTH.RESET_PASSWORD,
    RESET_PASSWORD_DEFAULT_DATA
  )

  // LOGOUT (dummy for now)
  const logout = () => {
    clearToken()
    setUser(null)
    navigateToLogin()
  }

  // SIGNUP action
  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    const responsee = await handleSignup(e)
    console.log('signup respnse is', responsee)
    const signUpResponse = responsee as unknown as SignUpResponseDto
    if (signUpResponse?.verificationToken) {
      router.push(`/auth/verify-email/${signUpResponse.verificationToken}/${signUpResponse.id}`)
    }
  }
  const signUpSuperAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    const superAdminSignUpResponse = (await handlesuperAdminSignUp(
      e
    )) as unknown as SignUpResponseDto
    if (superAdminSignUpResponse?.verificationToken) {
      navigateToVerifyEmail(superAdminSignUpResponse.verificationToken, superAdminSignUpResponse.id)
    }
  }

  // LOGIN action
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const loginResponse = (await handleLogin(e)) as unknown as LoginResponseDto | SignUpResponseDto

      if ('accessToken' in loginResponse && 'user' in loginResponse) {
        setAccessToken(loginResponse.accessToken)
        setUser(loginResponse.user)
        console.log('USERS', loginResponse.user)
        navigateToDashboard(loginResponse.user.role)
      } else {
        navigateToVerifyEmail(loginResponse.verificationToken, loginResponse.id)
      }
    } catch (error) {
      console.error('Login Failed:', error)
      handleError(error as ApiError, setError)
    }

  }



  // RESET password
  const resetPassword = async (e: React.FormEvent<HTMLFormElement>, resetPasswordToken: string) => {
    try {
      console.log('req', resetPasswordRequest)
      e.preventDefault()
      await resetPasswordMutation.mutateAsync({ ...resetPasswordRequest, resetPasswordToken })

      navigateToLogin()

    } catch (error) {

      console.error('Reset Password Failed failed:', error)
      handleError(error as ApiError, setError)

    }
  }


  const isAuthLoading =
    loginLoading ||
    signUpLoading ||
    forgotPasswordLoading ||
    resetPasswordLoading ||
    superAdminSignUpLoading

  return {
    loading: isAuthLoading,
    error: loginError || error,

    signUpRequest,
    loginRequest,

    forgotPasswordRequest,
    resetPasswordRequest,
    superAdminSignUpRequest,

    signupChangeHandlers,
    loginChangeHandlers,
    resetPasswordChangeHandlers,
    forgotPasswordChangeHandler,
    login,
    googleLogin,
    signUp,
    signUpSuperAdmin,

    forgotPassword,
    resetPassword,
    logout,

    clearError: () => setAuthError('')
  }
}
