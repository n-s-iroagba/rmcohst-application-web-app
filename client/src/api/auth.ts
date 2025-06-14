// Ensure this file (client/src/api/auth.ts) has these named exports:
// UserRole, login, register, validateToken

export enum UserRole {
  APPLICANT = "applicant",
  ADMIN = "admin",
  HOA = "hoa",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  emailVerified: boolean
}

interface LoginData {
  email: string
  password?: string
  googleId?: string
}

interface RegisterData {
  email: string
  password?: string
  firstName?: string
  lastName?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"

export const login = async (
  loginData: LoginData,
): Promise<{ data?: { token: string; user: User }; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
    const data = await response.json()
    if (!response.ok) return { error: data.message || "Login failed" }
    if (data.token) localStorage.setItem("authToken", data.token)
    return { data }
  } catch (error: any) {
    return { error: error.message || "Login failed due to network error." }
  }
}

export const register = async (
  registerData: RegisterData,
): Promise<{ data?: { token: string; user: User }; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    })
    const data = await response.json()
    if (!response.ok) return { error: data.message || "Registration failed" }
    if (data.token) localStorage.setItem("authToken", data.token)
    return { data }
  } catch (error: any) {
    return { error: error.message || "Registration failed due to network error." }
  }
}

export const validateToken = async (token: string): Promise<{ data?: User; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (!response.ok) return { error: data.message || "Token validation failed" }
    return { data: data.user }
  } catch (error: any) {
    return { error: error.message || "Token validation failed due to network error." }
  }
}

export const logout = () => {
  localStorage.removeItem("authToken")
}
