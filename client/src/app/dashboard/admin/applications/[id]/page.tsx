"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation" // Or however you get the ID
import { getApplicationDetailsForAdmin } from "@/services/application.service" // Assuming this service exists and fetches full details
import type { ApplicationAttributes } from "@/types/application" // Ensure this includes applicantDocuments
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import AdminGenericDocumentsSection from "@/components/admin/review/AdminGenericDocumentsSection" // Import the new component

// Placeholder for other review sections you might have for admin
const AdminBiodataReviewSectionPlaceholder = ({ biodata }: any) => (
  <div className="p-4 border rounded-md mt-4 bg-gray-50">
    <h3 className="font-semibold text-lg mb-2">Biodata (Admin View)</h3>
    {biodata ? <pre className="text-xs">{JSON.stringify(biodata, null, 2)}</pre> : <p>No biodata.</p>}
  </div>
)
const AdminProgramChoiceReviewSectionPlaceholder = ({ program }: any) => (
  <div className="p-4 border rounded-md mt-4 bg-gray-50">
    <h3 className="font-semibold text-lg mb-2">Program Choice (Admin View)</h3>
    {program ? <pre className="text-xs">{JSON.stringify(program, null, 2)}</pre> : <p>No program selected.</p>}
  </div>
)
// ... other placeholder review sections

const AdminApplicationDetailPage: React.FC = () => {
  const params = useParams()
  const applicationId = params?.id as string

  const [application, setApplication] = useState<ApplicationAttributes | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (applicationId) {
      const fetchApplication = async () => {
        setIsLoading(true)
        setError(null)
        try {
          // Make sure your application.service.ts has a method like this
          // that calls the backend service which includes applicantDocuments
          const response = await getApplicationDetailsForAdmin(applicationId)
          setApplication(response.data) // Assuming response structure { data: ApplicationAttributes }
        } catch (err: any) {
          setError(err.message || "Failed to load application details.")
          console.error("Error fetching application details for admin:", err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchApplication()
    }
  }, [applicationId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading application details...</div>
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
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Application details could not be found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Application Review</h1>
        <p className="text-md text-gray-600">
          Applicant: {application.applicant?.firstName} {application.applicant?.lastName} (ID: {application.id})
        </p>
      </header>

      <div className="space-y-6">
        {/* Placeholder for other admin review sections */}
        <AdminBiodataReviewSectionPlaceholder biodata={application.biodata} />
        <AdminProgramChoiceReviewSectionPlaceholder program={application.program} />
        {/* ... other sections like SSC Qualifications, Program Specific Qualifications ... */}

        {/* Integrate the Generic Documents Section */}
        <AdminGenericDocumentsSection documents={application.applicantDocuments} />

        {/* Placeholder for admin actions (approve, reject, comment, assign) */}
        <div className="p-4 border rounded-md mt-6 bg-white shadow">
          <h3 className="font-semibold text-lg mb-3">Admin Actions</h3>
          <p className="text-sm text-gray-500">Action buttons and forms would go here.</p>
          {/* Example:
          <Button className="mr-2">Approve</Button>
          <Button variant="destructive">Reject</Button>
          */}
        </div>
      </div>
    </div>
  )
}

export default AdminApplicationDetailPage
