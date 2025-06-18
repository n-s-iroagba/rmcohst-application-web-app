import { apiRoutes } from "@/constants/apiRoutes"
import { handleChange } from "@/helpers/handleChange"
import { SignUpRole, UserRole } from "@/types/role.types"
import { get, post } from "@/utils/apiClient"
import { useRouter } from "next/router"
import { useState } from "react"

interface LoginData {
  email?: string
  username?: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
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
  register: (role: SignUpRole) => Promise<void>
  logout: () => Promise<void>
  signupData: RegisterData
  loginData: LoginData
  loading: boolean
  error: string | null
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const router = useRouter()

  const handleChangeSignupData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSignupData, e)
  }

  const handleChangeLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setLoginData, e)
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

  const logout = async () => {
    await get<null>(apiRoutes.auth.logout)
    router.push("/")
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

  return {
    handleChangeLoginData,
    handleChangeSignupData,
    login,
    register,
    logout,
    signupData,
    loginData,
    loading,
    error,
  }
}
