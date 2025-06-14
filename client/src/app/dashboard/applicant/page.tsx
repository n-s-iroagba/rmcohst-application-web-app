"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import withAuth from "@/components/auth/withAuth"
import { UserRole } from "@/api/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BellIcon,
  UserCircle,
  FileText,
  BookOpen,
  CheckCircle,
  DownloadCloud,
  AlertTriangle,
  InfoIcon,
  PartyPopperIcon,
} from "lucide-react"
import Link from "next/link"
import { getMyApplications } from "@/services/application.service"
import type { ApplicationAttributes } from "@/types/application"
import { ClientApplicationStatus } from "@/types/application"

interface Notification {
  id: number
  message: string
  date: string
  type?: "success" | "info" | "warning"
}

function ApplicantDashboardPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<ApplicationAttributes[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: Date.now() + 1,
      message: "Welcome to the RMCOHST Application Portal!",
      date: new Date().toISOString().split("T")[0],
      type: "info",
    },
  ])

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true)
      setError(null)
      const response = await getMyApplications()
      if (response.error) {
        setError(response.error)
        setApplications([])
      } else {
        const fetchedApplications = response.data || []
        setApplications(fetchedApplications)

        // Update notifications based on fetched applications
        const newNotifications: Notification[] = [...notifications] // Start with existing welcome
        const latestApp =
          fetchedApplications.length > 0
            ? fetchedApplications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
            : null

        if (latestApp) {
          if (latestApp.status === ClientApplicationStatus.ADMITTED && latestApp.admissionLetterUrl) {
            if (!newNotifications.some((n) => n.message.includes("Congratulations! You have been admitted"))) {
              newNotifications.push({
                id: Date.now(),
                message: "Congratulations! You have been admitted. Your admission letter is available.",
                date: new Date(latestApp.updatedAt).toISOString().split("T")[0],
                type: "success",
              })
            }
          } else if (latestApp.status === ClientApplicationStatus.SUBMITTED) {
            if (!newNotifications.some((n) => n.message.includes("Your application has been submitted"))) {
              newNotifications.push({
                id: Date.now(),
                message: "Your application has been submitted successfully and is awaiting review.",
                date: new Date(latestApp.updatedAt).toISOString().split("T")[0],
                type: "info",
              })
            }
          } else if (latestApp.status === ClientApplicationStatus.REJECTED) {
            if (!newNotifications.some((n) => n.message.includes("application has been reviewed"))) {
              newNotifications.push({
                id: Date.now(),
                message: "Your application has been reviewed. Please check your application status for details.",
                date: new Date(latestApp.updatedAt).toISOString().split("T")[0],
                type: "warning",
              })
            }
          }
          // Add more dynamic notifications based on other statuses if needed
        }
        setNotifications(newNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
      setIsLoading(false)
    }

    if (user) {
      fetchApplications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]) // Removed notifications from dependency array to avoid loop, manage it internally

  const admittedApplication = applications.find(
    (app) => app.status === ClientApplicationStatus.ADMITTED && app.admissionLetterUrl,
  )
  const latestApplication =
    applications.length > 0
      ? applications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
      : null

  const displayApplicationStatus = latestApplication?.status || ClientApplicationStatus.APPLICATION_PAID
  const applicationInProgress =
    latestApplication &&
    ![
      ClientApplicationStatus.SUBMITTED,
      ClientApplicationStatus.ADMISSION_OFFICER_REVIEWED,
      ClientApplicationStatus.ADMITTED,
      ClientApplicationStatus.REJECTED,
      ClientApplicationStatus.OFFERED,
      ClientApplicationStatus.ACCEPTED,
      ClientApplicationStatus.ACCEPTANCE_PAID,
    ].includes(latestApplication.status)

  const getStatusColor = (status: ClientApplicationStatus | string) => {
    switch (status) {
      case ClientApplicationStatus.APPLICATION_PAID:
      case ClientApplicationStatus.BIODATA:
      case ClientApplicationStatus.SSC_QUALIFICATION:
      case ClientApplicationStatus.PROGRAM_SPECIFIC_QUALIFICATION:
        return "text-blue-500"
      case ClientApplicationStatus.SUBMITTED:
        return "text-yellow-600"
      case ClientApplicationStatus.ADMISSION_OFFICER_REVIEWED:
        return "text-yellow-700"
      case ClientApplicationStatus.ADMITTED:
      case ClientApplicationStatus.OFFERED:
      case ClientApplicationStatus.ACCEPTED:
      case ClientApplicationStatus.ACCEPTANCE_PAID:
        return "text-green-600 font-semibold"
      case ClientApplicationStatus.REJECTED:
        return "text-red-600 font-semibold"
      default:
        return "text-gray-500"
    }
  }

  const getStatusText = (status: ClientApplicationStatus | string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getNotificationIcon = (type?: "success" | "info" | "warning") => {
    switch (type) {
      case "success":
        return <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
      case "info":
      default:
        return <InfoIcon className="mr-2 h-5 w-5 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <p className="text-xl text-gray-600">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="mb-2 text-2xl font-semibold text-red-700">Error Loading Dashboard</h2>
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4 pt-8 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.firstName || "Applicant"}!</h1>
        <p className="text-gray-600">Manage your application and stay updated.</p>
      </header>

      {admittedApplication && (
        <Card className="mb-6 border-2 border-green-500 bg-green-50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-green-700">
              <PartyPopperIcon className="mr-3 h-8 w-8" />
              Congratulations! You've Been Admitted!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your hard work has paid off! Your admission letter is ready. Please download it for your records and
              information on the next steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={admittedApplication.admissionLetterUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
                <DownloadCloud className="mr-2 h-5 w-5" />
                View & Download Admission Letter
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <FileText className="mr-2 h-6 w-6 text-blue-600" />
              My Application
            </CardTitle>
            <CardDescription>
              Current Status:{" "}
              <span className={`font-bold ${getStatusColor(displayApplicationStatus)}`}>
                {getStatusText(displayApplicationStatus)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {latestApplication && latestApplication.status === ClientApplicationStatus.REJECTED && (
              <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
                <h3 className="font-semibold">Application Update</h3>
                <p>We regret to inform you that your application was not successful at this time.</p>
                {latestApplication.adminComments && (
                  <p className="mt-1 text-sm">Reason: {latestApplication.adminComments}</p>
                )}
              </div>
            )}
            {latestApplication &&
              latestApplication.status === ClientApplicationStatus.ADMITTED &&
              !admittedApplication && (
                <div className="rounded-md border border-yellow-400 bg-yellow-50 p-4 text-yellow-700">
                  <h3 className="font-semibold">Admission Letter Pending</h3>
                  <p>
                    Congratulations on your admission! Your admission letter is being processed and will be available
                    here shortly.
                  </p>
                </div>
              )}

            <p className="text-gray-700">
              {applicationInProgress || !latestApplication
                ? "Complete the following sections to submit your application. Ensure all information is accurate."
                : "Your application has been processed. You can review the details below."}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link href="/dashboard/applicant/biodata" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={!applicationInProgress && !!latestApplication}
                >
                  <UserCircle className="mr-2 h-5 w-5" />
                  Personal Information (Biodata)
                </Button>
              </Link>
              <Link href="/dashboard/applicant/ssc-qualification" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={!applicationInProgress && !!latestApplication}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  SSC Qualifications
                </Button>
              </Link>
              <Link href="/dashboard/applicant/program-specific-qualifications" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={!applicationInProgress && !!latestApplication}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Program Specific Qualifications
                </Button>
              </Link>
              <Link href="/dashboard/applicant/documents" passHref legacyBehavior>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  disabled={!applicationInProgress && !!latestApplication}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Upload Documents
                </Button>
              </Link>
            </div>

            {(!latestApplication || applicationInProgress) && (
              <Link href="/dashboard/applicant/review-submit" passHref legacyBehavior>
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  Review and Submit Application
                </Button>
              </Link>
            )}

            {latestApplication?.status === ClientApplicationStatus.SUBMITTED && (
              <div className="rounded-md bg-blue-50 p-4 text-blue-700">
                <InfoIcon className="mr-2 inline h-5 w-5" />
                Your application has been submitted and is currently awaiting review.
              </div>
            )}
            {latestApplication?.status === ClientApplicationStatus.ADMISSION_OFFICER_REVIEWED && (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
                <InfoIcon className="mr-2 inline h-5 w-5" />
                Your application is currently under review by an admission officer.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <BellIcon className="mr-2 h-5 w-5 text-orange-500" />
              Updates & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start border-b border-gray-200 pb-3 text-sm last:border-b-0 last:pb-0"
                  >
                    {getNotificationIcon(notification.type)}
                    <div>
                      <p className="text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No new notifications.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default withAuth(ApplicantDashboardPage, [UserRole.APPLICANT])
