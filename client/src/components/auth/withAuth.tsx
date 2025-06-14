"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { UserRole } from "@/api/auth"

// Define props for the wrapped component if needed, otherwise use a generic
type WithAuthProps = {}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, allowedRoles: UserRole[]) => {
  const ComponentWithAuth = (props: P & WithAuthProps) => {
    const { user, loading, error } = useAuth() // Assuming error state is managed in AuthContext
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (error) {
          // Handle auth errors, e.g., redirect to login if token validation failed
          // This depends on how your AuthContext handles errors from validateToken
          // For now, let's assume an error means not authenticated
          router.replace("/applicant/login") // Or a generic login page
          return
        }
        if (!user) {
          router.replace("/applicant/login")
        } else if (!allowedRoles.includes(user.role)) {
          // Redirect to a generic unauthorized page or their respective dashboard
          // This logic can be expanded based on your app's flow
          switch (user.role) {
            case UserRole.APPLICANT:
              router.replace("/dashboard/applicant")
              break
            case UserRole.ADMIN:
              router.replace("/dashboard/admin")
              break
            // Add other roles
            default:
              router.replace("/") // Fallback
          }
        }
      }
    }, [user, loading, error, router, allowedRoles])

    if (loading || !user || (user && !allowedRoles.includes(user.role)) || error) {
      // Render a loading state or null while checking auth
      // Or a more sophisticated loading component
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      )
    }

    return <WrappedComponent {...(props as P)} /> // Cast props to P
  }

  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component"
  ComponentWithAuth.displayName = `withAuth(${displayName})`

  return ComponentWithAuth
}

export default withAuth // Default export
