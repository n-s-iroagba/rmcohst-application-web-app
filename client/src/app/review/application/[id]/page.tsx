"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  GraduationCap,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

export default function ApplicationReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [decision, setDecision] = useState("")
  const [comments, setComments] = useState("")
  const [activeTab, setActiveTab] = useState("personal")

  // Mock application data
  const application = {
    id: params.id,
    applicant: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+234 801 234 5678",
      address: "123 Main Street, Lagos, Nigeria",
      dateOfBirth: "1995-05-15",
      gender: "Male",
      nationality: "Nigerian",
    },
    program: {
      name: "Computer Science",
      faculty: "Engineering",
      department: "Computer Science",
      level: "Undergraduate",
    },
    academic: {
      olevelResults: [
        { subject: "Mathematics", grade: "A1" },
        { subject: "English Language", grade: "B2" },
        { subject: "Physics", grade: "A1" },
        { subject: "Chemistry", grade: "B3" },
        { subject: "Biology", grade: "C4" },
      ],
      jambScore: 285,
      postUtmeScore: 78,
    },
    documents: [
      { name: "O'Level Certificate", status: "verified", url: "#" },
      { name: "JAMB Result", status: "verified", url: "#" },
      { name: "Birth Certificate", status: "pending", url: "#" },
      { name: "Passport Photograph", status: "verified", url: "#" },
    ],
    status: "under_review",
    submittedDate: "2024-01-15",
    score: 85,
  }

  const handleDecision = (type: string) => {
    setDecision(type)
    // Handle decision logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Applications
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Application Review</h1>
              <p className="text-gray-600 mt-1">Application ID: {application.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${application.score}%` }}></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{application.score}%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "personal", label: "Personal Info", icon: User },
                    { id: "academic", label: "Academic", icon: GraduationCap },
                    { id: "documents", label: "Documents", icon: FileText },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="text-gray-900 font-medium">{application.applicant.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <p className="text-gray-900">{application.applicant.email}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <p className="text-gray-900">{application.applicant.phone}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                            <p className="text-gray-900">{application.applicant.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <p className="text-gray-900">
                              {new Date(application.applicant.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <p className="text-gray-900">{application.applicant.gender}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                          <p className="text-gray-900">{application.applicant.nationality}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Program Applied</label>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-blue-900">{application.program.name}</p>
                            <p className="text-sm text-blue-700">
                              {application.program.faculty} - {application.program.department}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "academic" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">O&apos;Level Results</h3>
                        <div className="space-y-3">
                          {application.academic.olevelResults.map((result, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-gray-900">{result.subject}</span>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  result.grade.startsWith("A")
                                    ? "bg-green-100 text-green-800"
                                    : result.grade.startsWith("B")
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {result.grade}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examination Scores</h3>
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-900">JAMB Score</span>
                                <span className="text-2xl font-bold text-blue-600">
                                  {application.academic.jambScore}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(application.academic.jambScore / 400) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-900">Post-UTME Score</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {application.academic.postUtmeScore}%
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${application.academic.postUtmeScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {application.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                doc.status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : doc.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {doc.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button className="flex items-center text-green-600 hover:text-green-800 transition-colors">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Under Review
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <span className="text-sm font-medium text-gray-900">{application.submittedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Score</span>
                  <span className="text-sm font-medium text-gray-900">{application.score}%</span>
                </div>
              </div>
            </div>

            {/* Decision Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Decision</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDecision("approve")}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      decision === "approve"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision("reject")}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      decision === "reject"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments (Optional)</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add your review comments..."
                  />
                </div>

                <button
                  disabled={!decision}
                  className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Decision
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Send Message</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Calendar className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Schedule Interview</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Download className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">Export Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
