"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getMyApplication, submitFinalApplication } from "@/services/application.service"
import { type Application, ApplicationStatus } from "@/types/application"
import withAuth from "@/components/auth/withAuth"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, FileText, ShieldAlert } from "lucide-react"
import BiodataReviewSection from "@/components/review/BiodataReviewSection"
import SscQualificationsReviewSection from "@/components/review/SscQualificationsReviewSection"
import ProgramChoiceReviewSection from "@/components/review/ProgramChoiceReviewSection"
import ProgramSpecificQualificationsReviewSection from "@/components/review/ProgramSpecificQualificationsReviewSection"
import GenericDocumentsReviewSection from "@/components/review/GenericDocumentsReviewSection"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function ReviewSubmitPage() {
  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        setIsLoading(true)
        // Assuming getMyApplication fetches the applicant's current/active application
        // with all necessary populated fields (biodata, program, sscQualifications, etc.)
        const appData = await getMyApplication() // This service should return Application type
        setApplication(appData)
        if (appData.status !== ApplicationStatus.DRAFT) {
          setSubmitSuccess(true) // If already submitted or further, treat as "success" for UI flow
        }
      } catch (err: any) {
        setError(err.message || "Failed to load application data. Please try again or contact support.")
        console.error("Fetch application error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchApplicationData()
  }, [])

  const isBiodataComplete = useMemo(() => !!application?.biodataId && !!application?.biodata, [application])
  const isProgramChosen = useMemo(() => !!application?.programId && !!application?.program, [application])
  const areSscQualsAdded = useMemo(
    () => !!application?.sscQualifications && application.sscQualifications.length > 0,
    [application],
  )

  const canSubmit = useMemo(() => {
    return isBiodataComplete && isProgramChosen && areSscQualsAdded && application?.status === ApplicationStatus.DRAFT
  }, [isBiodataComplete, isProgramChosen, areSscQualsAdded, application?.status])

  const handleSubmit = async () => {
    if (!application || !canSubmit) {
      setError(
        "Application cannot be submitted. Please ensure all required sections (Biodata, Program Choice, SSC Qualifications) are complete and the application is in Draft status.",
      )
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await submitFinalApplication(application.id) // Pass application.id (string)
      setSubmitSuccess(true)
      const updatedAppData = await getMyApplication() // Refetch to update status display
      setApplication(updatedAppData)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit application. Please try again.")
      console.error("Submit application error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg mt-4">Loading your application details...</p>
      </div>
    )
  }

  if (error && !submitSuccess) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Application</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/dashboard/applicant")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8 text-center">
        <Alert variant="warning">
          <FileText className="h-4 w-4" />
          <AlertTitle>No Application Found</AlertTitle>
          <AlertDescription>
            We could not find an active application for you. Please start an application from your dashboard.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/dashboard/applicant")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (submitSuccess || application.status !== ApplicationStatus.DRAFT) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-green-600 mr-2" />
              Application Status: {application.status}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {application.status === ApplicationStatus.SUBMITTED
                ? "Your application has been successfully submitted. You will be notified of any updates."
                : `Your application status is currently "${application.status}". No further action is needed from you at this moment unless otherwise communicated.`}
            </p>
            {application.status === ApplicationStatus.SUBMITTED && application.submittedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Submitted on: {new Date(application.submittedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/applicant")} className="w-full">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Pre-submission checks display
  const missingSections: string[] = []
  if (!isBiodataComplete) missingSections.push("Personal Information (Biodata)")
  if (!isProgramChosen) missingSections.push("Program Choice")
  if (!areSscQualsAdded) missingSections.push("SSC Qualifications")

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <header className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Review and Submit Your Application</h1>
        <p className="text-gray-600 mt-1">Please carefully review all sections before submitting.</p>
      </header>

      <BiodataReviewSection biodata={application.biodata} />
      <SscQualificationsReviewSection sscQualifications={application.sscQualifications} />
      <ProgramChoiceReviewSection program={application.program} />
      <ProgramSpecificQualificationsReviewSection qualifications={application.programSpecificQualifications} />
      <GenericDocumentsReviewSection documents={application.applicantDocuments} />
      {/* Add other sections like Generic Documents if implemented and part of review */}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Submission Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {application.status === ApplicationStatus.DRAFT && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Declaration and Final Submission</CardTitle>
          </CardHeader>
          <CardContent>
            {missingSections.length > 0 && (
              <Alert variant="warning" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Missing Information</AlertTitle>
                <AlertDescription>
                  The following sections must be completed before you can submit your application:
                  <ul className="list-disc list-inside mt-1 text-sm">
                    {missingSections.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                  Please go back to your dashboard to complete these sections.
                </AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-gray-600 mb-4">
              By clicking "Submit Application", I declare that all the information provided in this application is true,
              complete, and accurate to the best of my knowledge. I understand that any false or misleading information
              may lead to the rejection of my application or dismissal if already admitted.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/applicant")}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Back to Dashboard (Save Draft)
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !canSubmit} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Confirm and Submit Application"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default withAuth(ReviewSubmitPage, ["APPLICANT"])
