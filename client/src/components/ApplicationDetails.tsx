'use client'

import { Application, ApplicationStatus } from '@/types/application'
import {
  User,
  ChevronUp,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  GraduationCap,
  MessageSquare
} from 'lucide-react'
import { useState } from 'react'
import { FileViewer } from './FileViewer'
import { apiRoutes } from '@/constants/apiRoutes'
import { post } from '@/utils/apiClient'
import StatusBadge from './StatusBadge'
export type CommentType = 'GENERAL' | 'BIODATA' | 'QUALIFICATION' | 'DECISION'

export interface Comment {
  id: string
  content: string
  type: CommentType
  officer: string
  timestamp: string
  applicationId: string
  createdAt: string
  updatedAt: string
}
const ApplicationDetail: React.FC<{
  application: Application
}> = ({ application }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(application.status)
  const [statusComments, setStatusComments] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    biodata: true,
    qualifications: true,
    comments: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  const handleAddComment = async (type: Comment['type']) => {
    if (newComment.trim()) {
      const comment = await post<{content:string,type:string}, Comment>(
        apiRoutes.application.addComment(application.id.toString()),
        { content: newComment, type }
      )
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  const handleStatusUpdate = async () => {
    if (newStatus !== application.status) {
      //   await onStatusUpdate(application.id.toString(), newStatus, statusComments)
      setStatusComments('')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {application.biodata.firstName} {application.biodata.otherNames}{' '}
              {application.biodata.surname}
            </h1>
            <p className="text-gray-500 mt-1">Application ID: {application.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={application.status} />
            <span className="text-sm text-gray-500">
              Applied: {formatDate(new Date(application.createdAt).toISOString())}
            </span>
          </div>
        </div>

        {/* Biodata Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection('biodata')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            {expandedSections.biodata ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {expandedSections.biodata && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-gray-900">
                    {application.biodata.surname} {application.biodata.otherNames}{' '}
                    {application.biodata.surname}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                  <p className="text-gray-900">{application.biodata.gender}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(new Date(application.biodata.dateOfBirth).toISOString())}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Marital Status
                  </label>
                  <p className="text-gray-900">{application.biodata.maritalStatus}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {application.biodata.phoneNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {application.biodata.email}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Home Address
                  </label>
                  <p className="text-gray-900 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5" />
                    {application.biodata.contactAddress}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nationality
                  </label>
                  <p className="text-gray-900">{application.biodata.nationality}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    State of Origin
                  </label>
                  <p className="text-gray-900">{application.biodata.stateOfOrigin}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">LGA</label>
                  <p className="text-gray-900">{application.biodata.localGovernmentArea}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Home Town</label>
                  <p className="text-gray-900">{application.biodata.homeTown}</p>
                </div>
              </div>

              {/* Next of Kin */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Next of Kin Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900">{application.biodata.nextOfKinName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {application.biodata.nextOfKinPhoneNumber}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Relationship
                    </label>
                    <p className="text-gray-900">{application.biodata.nextOfKinRelationship}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900 flex items-start">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5" />
                      {application.biodata.nextOfKinAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Qualifications Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection('qualifications')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              SSC Qualifications
            </h3>
            {expandedSections.qualifications ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {expandedSections.qualifications && (
            <div className="px-4 pb-4 border-t border-gray-100">
             
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">SSC Qualification</h4>
                    <span className="text-sm text-gray-500">
                      {application.sscQualification.numberOfSittings} sitting(s)
                    </span>
                  </div>

                  <FileViewer
                    files={application.sscQualification.certificates as string[] || []}
                    types={application.sscQualification.certificateTypes || []}
                  />
                </div>
              
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleSection('comments')}
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comments & Notes
            </h3>
            {expandedSections.comments ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {expandedSections.comments && (
            <div className="px-4 pb-4 border-t border-gray-100">
              {/* Add Comment */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your review comments here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option value="GENERAL">General Comment</option>
                    <option value="BIODATA">Biodata Review</option>
                    <option value="QUALIFICATION">Qualification Review</option>
                    <option value="DECISION">Decision Note</option>
                  </select>
                  <button
                    onClick={() => handleAddComment('GENERAL')}
                    disabled={!newComment.trim()}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      newComment.trim()
                        ? 'bg-slate-600 text-white hover:bg-slate-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="mt-4 space-y-3">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{comment.officer}</span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {comment.type}
                          </span>
                          <span>{new Date(comment.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* Status Update Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Application Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="WAITLISTED">Waitlisted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={statusComments}
                onChange={(e) => setStatusComments(e.target.value)}
                placeholder="Add comments about this status change..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
          <button
            onClick={handleStatusUpdate}
            disabled={newStatus === application.status}
            className={`mt-4 px-4 py-2 rounded-md font-medium ${
              newStatus === application.status
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-slate-600 text-white hover:bg-slate-700'
            }`}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}
export default ApplicationDetail
