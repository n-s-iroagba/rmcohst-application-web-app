'use client'
import { apiRoutes } from '@/constants/apiRoutes'
import { handleArrayChange, handleChange } from '@/helpers/handleChange'
import { SignUpRole, UserRole } from '@/types/role.types'
import { get, post } from '@/utils/apiClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type AuthFormKeys =
  | keyof RegisterationFormData
  | keyof LoginData
  | keyof ForgotPassword
  | keyof VerifyEmailCode
  | keyof ResetPasswordFormData

interface RegisterData {
  email: string
  password: string
  lastName: string
  firstName: string
}

export interface RegisterationFormData extends RegisterData {
  confirmPassword: string
}

interface LoginData {
  email: string
  password: string
}

type ForgotPassword = {
  email: string
}

type VerifyEmailCode = {
  code: string
}

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

type EmailVerificationCode = {
  code: string
}

class AuthError extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

type UseAuthReturn = {
  handleChangeSignupData: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeForgotPasswordData: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeResetPasswordFormData: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeEmailVerificationCodeData: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
  handleResendEmailVerificationFormCode: () => void
  handleChangeLoginData: (e: React.ChangeEvent<HTMLInputElement>) => void
  login: () => Promise<void>
  handleSubmitSignup: (role: SignUpRole) => Promise<void>
  handleSubmitForgotPassword: () => Promise<void>
  verifyCode: (e: React.FormEvent) => Promise<void>
  resetPassword: () => Promise<void>
  logout: () => Promise<void>
  signupData: RegisterationFormData
  loginData: LoginData
  forgotPasswordData: ForgotPassword
  emailVerificationFormCode: string[]
  resetPasswordFormData: ResetPasswordFormData
  validationErrors: Partial<Record<AuthFormKeys, string>>
  loading: boolean
  error: string 
  submitting: boolean
  handleCancel: ()=>void
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string >('')

  const [signupData, setSignupData] = useState<RegisterationFormData>({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  })

  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPassword>({ email: '' })
  const [emailVerificationFormCode, setEmailVerificationCode] = useState<string[]>(
    Array(6).fill('')
  )

  const [resetPasswordFormData, setResetPasswordFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  })

  const [validationErrors, setValidationErrors] = useState<Partial<Record<AuthFormKeys, string>>>(
    {}
  )

  
  const handleCancel = ()=>{
    router.push('/')
  }

  const validate = (
    formData: Partial<
      RegisterationFormData | LoginData | ForgotPassword | VerifyEmailCode | ResetPasswordFormData
    >
  ): boolean => {
    const errors: Partial<Record<AuthFormKeys, string>> = {}

    if ('email' in formData) {
      if (!formData.email?.trim()) errors.email = 'Email is required.'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid.'
    }

    if ('lastName' in formData && !formData.lastName?.trim()) {
      errors.lastName = 'First name is required.'
    }

    if ('lastName' in formData && !formData.lastName?.trim()) {
      errors.lastName = 'Last name is required.'
    }

    if ('password' in formData) {
      if (!formData.password) errors.password = 'Password is required.'
      else if (formData.password.length < 6)
        errors.password = 'Password must be at least 6 characters.'
    }

    if ('confirmPassword' in formData) {
      if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password.'
      else if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match.'
    }

    if ('code' in formData && !/^\d{6}$/.test(formData.code || '')) {
      errors.code = 'Code must be 6 digits.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangeSignupData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSignupData, e)
  }

  const handleChangeLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setLoginData, e)
  }
  const handleChangeForgotPasswordData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setForgotPasswordData, e)
  }
  const handleChangeResetPasswordFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setResetPasswordFormData, e)
  }
  const handleChangeEmailVerificationCodeData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target
    if (!/^\d?$/.test(value)) return
    handleArrayChange(setEmailVerificationCode, e, index)
  }
  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case 'APPLICANT':
        router.push('/applicant/dashboard')
        break
      case 'ADMISSION_OFFICER':
      case 'HEAD_OF_ADMISSIONS':
        router.push('/staff/dashboard')
        break
      case 'SUPER_ADMIN':
        router.push('/super-admin/dashboard')
        break
      default:
        router.push('/')
    }
  }

  const login = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await post<LoginData, UserRole>(apiRoutes.auth.login, loginData)
      redirectToDashboard(result)
    } catch (error) {
      console.error('Login error', error)
      setError(error instanceof AuthError ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (role: SignUpRole) => {
    setLoading(true)
    setError('')
    const route =
      role === 'SUPER_ADMIN' ? apiRoutes.auth.superAdminSignup : apiRoutes.auth.applicantSignup

    try {
      const result = await post<RegisterData, string>(route, signupData)
      router.push(`/auth/verify-email/${result}`)
    } catch (error) {
      console.error('Registration error', error)
      setError(error instanceof AuthError ? error.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitSignup = async (role: SignUpRole) => {
    if (validate(signupData)) {
      await register(role)
    }
  }

  const handleSubmitForgotPassword = async () => {

    setSubmitting(true)
    setError('')

    if (!validate(forgotPasswordData)) return

    try {
      const token = await post<ForgotPassword, string>(
        apiRoutes.auth.forgotPassword,
        forgotPasswordData
      )
      router.push(`/auth/reset-paswword/${token}`)
    } catch (error) {
      console.error('Forgot password error', error)
      setError(error instanceof AuthError ? error.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const code = emailVerificationFormCode.join('')
    try {
      const role = await post<EmailVerificationCode, UserRole>(apiRoutes.auth.verifyEmailCode, {
        code
      })
      redirectToDashboard(role)
    } catch (error) {
      console.error('Verify code error', error)
      setError(error instanceof AuthError ? error.message : 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendEmailVerificationFormCode = async () => {
    try {
      const newToken = await get<string>(apiRoutes.auth.resendVerificationEmail)
      router.push(`/auth/verify-email/${newToken}`)
    } catch (error) {
      console.error('Verify code error', error)
      setError(error instanceof AuthError ? error.message : 'Verification failed')
    } finally {
      setSubmitting(false)
    }
  }

  const resetPassword = async () => {

    setSubmitting(true)
    setError('')

    if (!validate(resetPasswordFormData)) return

    try {
      await post(`${apiRoutes.auth.resetPassword}`, {
        password: resetPasswordFormData.password
      })
      router.push('/auth/login')
    } catch (error) {
      console.error('Reset password error', error)
      setError(error instanceof AuthError ? error.message : 'Password reset failed')
    } finally {
      setSubmitting(false)
    }
  }

  const logout = async () => {
    await get<null>(apiRoutes.auth.logout)
    router.push('/')
  }

  return {
    handleCancel,
    handleChangeSignupData,
    handleChangeLoginData,
    login,
    handleSubmitSignup,
    handleSubmitForgotPassword,
    verifyCode,
    resetPassword,
    logout,
    signupData,
    loginData,
    forgotPasswordData,
    emailVerificationFormCode,
    resetPasswordFormData,
    handleResendEmailVerificationFormCode,
    validationErrors,
    loading,
    error,
    submitting,
    handleChangeForgotPasswordData,
    handleChangeResetPasswordFormData,
    handleChangeEmailVerificationCodeData
  }
}
