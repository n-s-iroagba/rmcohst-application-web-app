import { apiRoutes } from "@/constants/apiRoutes"
import { handleChange } from "@/helpers/handleChange"
import { SignUpRole, UserRole } from "@/types/role.types"
import { get, post } from "@/utils/apiClient"
import { useRouter } from "next/router"
import { useState } from "react"

type AuthFormKeys = keyof RegisterationFormData | keyof LoginData | keyof ForgotPassword | keyof VerifyEmailCode | keyof ResetPasswordFormData

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}




export interface RegisterationFormData extends RegisterData {
  confirmPassword: string;
}

interface LoginData {
  email?: string
  username?: string
  password: string
}

type ForgotPassword = {
  email:string
}

type VerifyEmailCode = {
  code:string // 6 digits
}

type ResetPasswordFormData = {
  password:string;
  resetPassword:string
}

class AuthError extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

class ValidationError extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

type UseAuthReturn = {
  handleChangeSignupData: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeLoginData: (e: React.ChangeEvent<HTMLInputElement>) => void
  login: () => Promise<void>
  handleSubmitSignup: (e: React.FormEvent, role: SignUpRole) => Promise<void>
  logout: () => Promise<void>
  signupData: RegisterationFormData
  loginData: LoginData
  loading: boolean
  error: string | null
  validationErrors:Partial<Record<AuthFormKeys, string>>
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState<RegisterationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword:''
  })
  const router = useRouter()
    const [validationErrors, setValidationErrors] = useState<Partial<Record<AuthFormKeys, string>>>({})

  
function validate(formData: Partial<RegisterationFormData | LoginData | ForgotPassword | VerifyEmailCode | ResetPasswordFormData>): boolean {
  const errors: Partial<Record<AuthFormKeys, string>> = {}

  // Common email validation if email exists
  if ('email' in formData) {
    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid."
    }
  }

  // Registration-specific validations
  if ('firstName' in formData) {
    if (!formData.firstName || !formData.firstName.trim()) {
      errors.firstName = "First name is required."
    }
  }
  if ('lastName' in formData) {
    if (!formData.lastName || !formData.lastName.trim()) {
      errors.lastName = "Last name is required."
    }
  }
  if ('password' in formData) {
    if (!formData.password) {
      errors.password = "Password is required."
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters."
    }
  }

  // Confirm password check for registration form
  if ('confirmPassword' in formData) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password."
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }
  }

  // Verify code validation
  if ('code' in formData) {
    if (!formData.code || !/^\d{6}$/.test(formData.code)) {
      errors.code = "Code must be 6 digits."
    }
  }

  // Reset password specific validation
  if ('resetPassword' in formData) {
    if (!formData.resetPassword) {
      errors.resetPassword = "Reset password is required."
    }
    // Optionally add more rules for resetPassword
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
  const redirectToDashboard = (role: UserRole) => {
    switch (role) {
      case "APPLICANT":
        router.push("/applicant/dashboard")
        break
      case "ADMISSION_OFFICER":
      case "HEAD_OF_ADMISSIONS":
        router.push("/staff/dashboard")
        break
      case "SUPER_ADMIN":
        router.push("/super-admin/dashboard")
        break
      default:
        router.push("/")
        break
    }
  }
  const login = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await post<LoginData, UserRole>(apiRoutes.auth.login, loginData)
      redirectToDashboard(result)
    } catch (error) {
      console.error("Error occurred during login", error)
      if (error instanceof AuthError || error instanceof ValidationError) {
        setError(error.message)
      } else {
        setError("Unknown error occurred. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (role: SignUpRole) => {
    setLoading(true)
    setError(null)
    const signupRoute =
      role === "SUPER_ADMIN" ? apiRoutes.auth.superAdminSignup : apiRoutes.auth.applicantSignup

    try {
      const result = await post<RegisterData, string>(signupRoute, signupData)
      router.push(`/auth/verify-email/${result}`)
    } catch (error) {
      console.error("Error occurred during signup", error)
      if (error instanceof AuthError || error instanceof ValidationError) {
        setError(error.message)
      } else {
        setError("Unknown error occurred. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }
    
  const handleSubmitSignup = async(e: React.FormEvent,role:SignUpRole) => {
        e.preventDefault()
        if (validate(signupData)) {
         await  register(role)
        }
      }

  const logout = async () => {
    await get<null>(apiRoutes.auth.logout)
    router.push("/")
  }



  return {
    handleChangeLoginData,
    handleChangeSignupData,
    login,
    handleSubmitSignup,
    logout,
    signupData,
    loginData,
    loading,
    error,
    validationErrors
  }
  }
