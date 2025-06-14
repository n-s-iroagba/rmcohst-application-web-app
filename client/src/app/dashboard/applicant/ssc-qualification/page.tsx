"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import withAuth from "@/components/auth/withAuth"
import { UserRole } from "@/api/auth"
import { getMyApplications } from "@/services/application.service"
import type { ApplicationAttributes } from "@/types/application"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SscQualificationForm from "@/components/SscQualificationForm"

function ApplicantSscPage() {
  const { user } = useAuth()
  const [activeApplication, setActiveApplication] = useState<ApplicationAttributes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getMyApplications()
        .then((response) => {
          if (response.data && response.data.length > 0) {
            // Find an application that requires SSC qualification
            const appInProgress = response.data.find(
              (app) => app.status === "BIODATA" || app.status === "SSC_QUALIFICATION",
            )
            if (appInProgress) {
              setActiveApplication(appInProgress)
            } else {
              setError("No active application found that requires SSC qualification submission.")
            }
          } else if (response.error) {
            setError(response.error)
          } else {
            setError("No applications found. Please start an application first.")
          }
        })
        .catch((err) => {
          console.error("Error fetching applications:", err)
          setError("Failed to load your application details.")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user])

  const handleSuccess = (data: any) => {
    // Optionally, update application status or show a success message
    // e.g., call an API to update application status to 'PROGRAM_SPECIFIC_QUALIFICATION'
    alert("SSC Qualification saved successfully!")
    // router.push('/dashboard/applicant/program-specific-qualification'); // Navigate to next step
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading application details...</p>
      </div>
    )
  }

  if (error || !activeApplication) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Could not find an active application."}</AlertDescription>
        </Alert>
        <Link href="/dashboard/applicant" passHref>
          <Button variant="link" className="mt-4">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>SSC Qualification</CardTitle>
          <CardDescription>
            Enter your Senior School Certificate results. Application ID: {activeApplication.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SscQualificationForm applicationId={activeApplication.id} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <Link href="/dashboard/applicant" passHref>
          <Button variant="outline">Back to Applicant Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default withAuth(ApplicantSscPage, [UserRole.APPLICANT])
