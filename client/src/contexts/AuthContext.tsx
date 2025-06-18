// "use client"

// import type React from "react"
// import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
// import { UserRole, type User } from "@/api/auth" // Assuming these are correctly exported from api/auth
// import {
//   login as apiLogin,
//   register as apiRegister,
//   validateToken as apiValidateToken,
//   logout as apiLogout,
// } from "@/api/auth"
// import { useRouter } from "next/navigation" // Assuming useRouter is from "next/navigation" for App Router

// interface LoginData {
//   email: string
//   password?: string
//   googleId?: string
// }
// interface RegisterData {
//   email: string
//   password?: string
//   firstName?: string
//   lastName?: string
// }

// interface AuthContextProps {
//   user: User | null
//   login: (loginData: LoginData) => Promise<void>
//   register: (registerData: RegisterData) => Promise<void>
//   logout: () => void
//   loading: boolean
//   error: string | null
//   // validateToken: () => Promise<void>; // This might be internal or exposed if needed
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined)

// export const useAuth = (): AuthContextProps => {
//   // Named export
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     const attemptValidateToken = async () => {
//       setLoading(true)
//       setError(null)
//       const token = localStorage.getItem("authToken")

//       if (token) {
//         const result = await apiValidateToken(token)
//         if (result.data) {
//           setUser(result.data) // Assuming result.data is the User object
//         } else {
//           setUser(null)
//           localStorage.removeItem("authToken") // Token is invalid or expired
//         }
//       } else {
//         setUser(null)
//       }
//       setLoading(false)
//     }
//     attemptValidateToken()
//   }, [])

//   const login = async (loginData: LoginData) => {
//     setLoading(true)
//     setError(null)
//     const result = await apiLogin(loginData)
//     if (result.data?.user && result.data?.token) {
//       localStorage.setItem("authToken", result.data.token)
//       setUser(result.data.user)
//       redirectToDashboard(result.data.user.role)
//     } else {
//       setError(result.error || "Login failed. Please check your credentials.")
//       setUser(null)
//     }
//     setLoading(false)
//   }

//   const register = async (registerData: RegisterData) => {
//     setLoading(true)
//     setError(null)
//     const result = await apiRegister(registerData)
//     if (result.data?.user && result.data?.token) {
//       localStorage.setItem("authToken", result.data.token)
//       setUser(result.data.user)
//       redirectToDashboard(result.data.user.role)
//     } else {
//       setError(result.error || "Registration failed. Please try again.")
//       setUser(null)
//     }
//     setLoading(false)
//   }

//   const logout = () => {
//     apiLogout() // Calls localStorage.removeItem("authToken")
//     setUser(null)
//     router.push("/") // Redirect to home or login page
//   }

//   const redirectToDashboard = (role: UserRole) => {
//     // Add your redirection logic here based on user role
//     switch (role) {
//       case UserRole.APPLICANT:
//         router.push("/dashboard/applicant")
//         break
//       case UserRole.ADMIN:
//         router.push("/dashboard/admin")
//         break
//       // Add other roles
//       default:
//         router.push("/")
//     }
//   }

//   const value = { user, login, register, logout, loading, error }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }
