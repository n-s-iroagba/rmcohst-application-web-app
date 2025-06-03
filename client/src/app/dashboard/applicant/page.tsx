"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { applicationService } from "@/services/application.service"
import type { ApplicationWithDetails } from "@/types/application"
import {
  User,
  FileText,
  CheckCircle,
  Clock,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Plus,
  Upload,
  MessageSquare,
  Download,
} from "lucide-react"

interface ApplicationStage {
  stage: string
  status: "completed" | "current" | "pending"
  date?: string
  description: string
}

export default function ApplicantDashboard() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications] = useState(3)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getMyApplications()
      if (response.data) {
        setApplications(response.data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const getApplicationStages = (application: ApplicationWithDetails): ApplicationStage[] => {
    const stages: ApplicationStage[] = [
      {
        stage: "Registration",
        status: "completed",
        date: new Date(application.createdAt).toLocaleDateString(),
        description: "Account created and email verified",
      },
      {
        stage: "Application Fee",
        status: application.status === "APPLICATION_PAID" ? "completed" : "pending",
        date:
          application.status === "APPLICATION_PAID" ? new Date(application.updatedAt).toLocaleDateString() : undefined,
        description: "Payment confirmed",
      },
      {
        stage: "Form Completion",
        status:
          application.status === "BIODATA" ||
          application.status === "SSC_QUALIFICATION" ||
          application.status === "PROGRAM_SPECIFIC_QUALIFICATION"
            ? "current"
            : [
                  "SUBMITTED",
                  "ADMISSION_OFFICER_REVIEWED",
                  "ADMITTED",
                  "REJECTED",
                  "OFFERED",
                  "ACCEPTED",
                  "ACCEPTANCE_PAID",
                ].includes(application.status)
              ? "completed"
              : "pending",
        description: "Complete your application form and upload documents",
      },
      {
        stage: "Review",
        status:
          application.status === "SUBMITTED" || application.status === "ADMISSION_OFFICER_REVIEWED"
            ? "current"
            : ["ADMITTED", "REJECTED", "OFFERED", "ACCEPTED", "ACCEPTANCE_PAID"].includes(application.status)
              ? "completed"
              : "pending",
        description: "Application under review by admissions team",
      },
      {
        stage: "Decision",
        status: ["ADMITTED", "REJECTED", "OFFERED"].includes(application.status)
          ? "completed"
          : application.status === "ADMISSION_OFFICER_REVIEWED"
            ? "current"
            : "pending",
        description: "Final admission decision",
      },
      {
        stage: "Acceptance Fee",
        status:
          application.status === "ACCEPTANCE_PAID"
            ? "completed"
            : application.status === "OFFERED" || application.status === "ACCEPTED"
              ? "current"
              : "pending",
        description: "Pay acceptance fee if admitted",
      },
      {
        stage: "Enrollment",
        status: application.status === "ACCEPTANCE_PAID" ? "completed" : "pending",
        description: "Complete enrollment process",
      },
    ]

    return stages
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLICATION_PAID":
        return "bg-blue-100 text-blue-800"
      case "BIODATA":
      case "SSC_QUALIFICATION":
      case "PROGRAM_SPECIFIC_QUALIFICATION":
        return "bg-yellow-100 text-yellow-800"
      case "SUBMITTED":
      case "ADMISSION_OFFICER_REVIEWED":
        return "bg-purple-100 text-purple-800"
      case "ADMITTED":
      case "OFFERED":
      case "ACCEPTED":
      case "ACCEPTANCE_PAID":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextAction = (application: ApplicationWithDetails) => {
    switch (application.status) {
      case "APPLICATION_PAID":
        return { text: "Complete Biodata", href: `/application/${application.id}/biodata` }
      case "BIODATA":
        return { text: "Add Qualifications", href: `/application/${application.id}/qualifications` }
      case "SSC_QUALIFICATION":
      case "PROGRAM_SPECIFIC_QUALIFICATION":
        return { text: "Submit Application", href: `/application/${application.id}/submit` }
      case "OFFERED":
        return { text: "Pay Acceptance Fee", href: `/payment/acceptance-fee/${application.id}` }
      default:
        return null
    }
  }

  const quickActions = [
    {
      title: "Complete Application",
      description: "Fill out your application form",
      icon: FileText,
      color: "bg-blue-500",
      href: "/application/form",
    },
    {
      title: "Upload Documents",
      description: "Submit required documents",
      icon: Upload,
      color: "bg-green-500",
      href: "/application/documents",
    },
    {
      title: "View Messages",
      description: "Check communication with officers",
      icon: MessageSquare,
      color: "bg-purple-500",
      href: `/messages/${applications[0]?.id}`,
    },
    {
      title: "Download Admission Letter",
      description: "Get your admission letter",
      icon: Download,
      color: "bg-red-500",
      href: `/application/admission-letter/${applications[0]?.id}`,
      show: applications[0]?.status === "ACCEPTED" || applications[0]?.status === "ACCEPTANCE_PAID",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RMCOHST</span>
              </div>
              <div className="hidden md:block text-gray-500">|</div>
              <div className="hidden md:block text-gray-600">Student Portal</div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">Applicant</div>
                </div>
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>

              <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-gray-600">Track your application progress and complete remaining steps.</p>
        </div>

        {applications.length === 0 ? (
          /* No Applications State */
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-6">Start your journey by creating your first application.</p>
            <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center mx-auto">
              <Plus className="w-5 h-5 mr-2" />
              Create New Application
            </button>
          </div>
        ) : (
          /* Applications List */
          <div className="space-y-8">
            {applications.map((application) => {
              const stages = getApplicationStages(application)
              const nextAction = getNextAction(application)

              return (
                <div key={application.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {/* Application Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Application #{application.id}</h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Session: {application.academicSession?.sessionName}</span>
                          <span>•</span>
                          <span>Submitted: {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}
                        >
                          {application.status.replace("_", " ")}
                        </span>
                        {nextAction && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            {nextAction.text}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Application Progress */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Progress</h3>

                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>

                      <div className="space-y-6">
                        {stages.map((stage, index) => (
                          <div key={index} className="relative flex items-start">
                            <div
                              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                                stage.status === "completed"
                                  ? "bg-green-500 border-green-500"
                                  : stage.status === "current"
                                    ? "bg-blue-500 border-blue-500"
                                    : "bg-gray-100 border-gray-300"
                              }`}
                            >
                              {stage.status === "completed" ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : stage.status === "current" ? (
                                <Clock className="w-6 h-6 text-white" />
                              ) : (
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                              )}
                            </div>

                            <div className="ml-6 flex-1">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`font-semibold ${
                                    stage.status === "completed" || stage.status === "current"
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {stage.stage}
                                </h4>
                                {stage.date && <span className="text-sm text-gray-500">{stage.date}</span>}
                              </div>
                              <p
                                className={`text-sm ${
                                  stage.status === "completed" || stage.status === "current"
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {stage.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
