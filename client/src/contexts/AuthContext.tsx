"use client"

import type React from "react"
import { createContext,  useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation" // Assuming useRouter is from "next/navigation" for App Router
import { useGetSingle } from "@/hooks/useGet"
import { apiRoutes } from "@/constants/apiRoutes"
import { UserRole } from "@/types/role.types"

type AuthUser ={
    userId:number
    role:UserRole
    displayName:string
}
interface AuthContextProps {
  user: AuthUser | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuthContext = (): AuthContextProps => {
  // Named export
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {data:user,loading,error} = useGetSingle<AuthUser>(apiRoutes.auth.me)
  const router = useRouter()

  if (!user && !loading) {
    alert("You are not authenticated. Please log in.")
    router.push("/")
  }

  const value = { user, loading, error }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
