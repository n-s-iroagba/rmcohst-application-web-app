import React, { useState, useEffect, useCallback } from 'react'
import {
  User,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  GraduationCap,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

// Types
type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WAITLISTED'

interface Biodata {
  id: number
  applicationId: number
  lastName: string
  middleName?: string
  surname: string
  gender: string
  dateOfBirth: string
  maritalStatus: string
  homeAddress: string
  nationality: string
  stateOfOrigin: string
  lga: string
  homeTown: string
  phoneNumber: string
  emailAddress: string
  passportPhotograph: string // Base64 or blob data
  nextOfKinFullName: string
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  relationshipWithNextOfKin: string
}

interface SSCQualification {
  id: number
  applicationId: number
  numberOfSittings: number
  certificateTypes: string[]
  certificates: string[] // Array of base64 or file paths
}

interface Application {
  id: number
  status: ApplicationStatus
  adminComments?: string
  createdAt: string
  updatedAt: string
  biodata: Biodata
  sscQualifications: SSCQualification[]
}

interface Comment {
  id: string
  content: string
  timestamp: string
  officer: string
  type: 'GENERAL' | 'BIODATA' | 'QUALIFICATION' | 'DECISION'
}

// Services
class ApplicationService {
  static async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    comments?: string
  ): Promise<Application> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: parseInt(id),
          status,
          adminComments: comments,
          createdAt: '2024-01-01',
          updatedAt: new Date().toISOString(),
          biodata: {} as Biodata,
          sscQualifications: []
        })
      }, 1000)
    })
  }

  static async getApplications(filters?: any): Promise<Application[]> {
    // Mock data
    return mockApplications
  }

  static async getApplication(id: string): Promise<Application> {
    return mockApplications.find((app) => app.id === parseInt(id)) || mockApplications[0]
  }

  static async addComment(
    applicationId: string,
    comment: string,
    type: Comment['type']
  ): Promise<Comment> {
    const newComment: Comment = {
      id: Date.now().toString(),
      content: comment,
      timestamp: new Date().toISOString(),
      officer: 'Current Officer',
      type
    }
    return newComment
  }
}

// Mock data
const mockApplications: Application[] = [
  {
    id: 1,
    status: 'PENDING',
    adminComments: '',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    biodata: {
      id: 1,
      applicationId: 1,
      lastName: 'John',
      middleName: 'David',
      surname: 'Doe',
      gender: 'Male',
      dateOfBirth: '2000-05-15',
      maritalStatus: 'Single',
      homeAddress: '123 Main Street, Lagos',
      nationality: 'Nigerian',
      stateOfOrigin: 'Lagos',
      lga: 'Ikeja',
      homeTown: 'Ikeja',
      phoneNumber: '+2348012345678',
      emailAddress: 'john.doe@email.com',
      passportPhotograph: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      nextOfKinFullName: 'Jane Doe',
      nextOfKinPhoneNumber: '+2348012345679',
      nextOfKinAddress: '123 Main Street, Lagos',
      relationshipWithNextOfKin: 'Sister'
    },
    sscQualifications: [
      {
        id: 1,
        applicationId: 1,
        numberOfSittings: 1,
        certificateTypes: ['WAEC', 'NECO'],
        certificates: ['cert1_base64', 'cert2_base64']
      }
    ]
  }
]

// Utility Components

// Main Components

// Main Application Component
const AdmissionReviewSystem: React.FC = () => {
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/3 min-w-96">
        <ApplicationList
          applications={applications}
          onSelectApplication={setSelectedApplication}
          selectedId={selectedApplication?.id}
        />
      </div>

      {/* Main Content */}
    </div>
  )
}

export default AdmissionReviewSystem
