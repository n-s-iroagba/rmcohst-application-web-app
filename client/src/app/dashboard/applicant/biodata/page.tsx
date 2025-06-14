"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import withAuth from "@/components/auth/withAuth"
import { UserRole } from "@/api/auth"
import EditBiodataForm from "@/components/EditBiodataForm"
import { getMyApplications } from "@/services/application.service"
import type { ApplicationAttributes } from "@/types/application"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function ApplicantBiodataPage() {
  const { user } = useAuth()
  const [activeApplication, setActiveApplication] = useState<ApplicationAttributes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getMyApplications()
        .then((response) => {
          if (response.data && response.data.length > 0) {
            // Find an application that requires biodata or is in progress
            // This logic might need to be more sophisticated based on your application statuses
            const appInProgress = response.data.find(
              (app) => app.status === "APPLICATION_PAID" || app.status === "BIODATA",
            )
            if (appInProgress) {
              setActiveApplication(appInProgress)
            } else {
              // If no app is in a state for biodata, pick the latest one or show a message
              setActiveApplication(response.data[0]) // Or set error
              // setError("No active application found that requires biodata submission.");
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

  const handleBiodataSuccess = (updatedBiodata: any) => {
    // Optionally, update application status or show a success message
    // e.g., call an API to update application status to 'SSC_QUALIFICATION'
    alert("Biodata saved successfully!")
    // router.push('/dashboard/applicant/ssc-qualification'); // Navigate to next step
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading application details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {error.includes("No applications found") && (
          <Link href="/dashboard/applicant" passHref>
            <Button variant="link" className="mt-4">
              Go to Dashboard to Start Application
            </Button>
          </Link>
        )}
      </div>
    )
  }

  if (!activeApplication) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Active Application</AlertTitle>
          <AlertDescription>
            We could not find an active application for you to submit biodata. Please ensure you have started an
            application process from your dashboard.
          </AlertDescription>
        </Alert>
        <Link href="/dashboard/applicant" passHref>
          <Button variant="outline" className="mt-4">
            Back to Applicant Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Personal Information (Biodata)</CardTitle>
          <CardDescription>
            Please fill in your personal details accurately. Application ID: {activeApplication.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditBiodataForm applicationId={activeApplication.id} onSuccess={handleBiodataSuccess} />
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

export default withAuth(ApplicantBiodataPage, [UserRole.APPLICANT])
