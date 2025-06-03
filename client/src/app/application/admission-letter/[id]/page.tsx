"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Download, Share2, PrinterIcon as Print, CheckCircle, Calendar, GraduationCap } from "lucide-react"

export default function AdmissionLetterPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [letterData, setLetterData] = useState<any>(null)

  useEffect(() => {
    fetchAdmissionLetter()
  }, [])

  const fetchAdmissionLetter = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setLetterData({
          applicationId: params.id,
          studentName: "John Doe",
          program: "Medical Laboratory Science",
          admissionNumber: "RMCOHST/2024/MLS/001",
          sessionYear: "2024/2025",
          dateOfAdmission: "2024-03-15",
          reportingDate: "2024-09-15",
          faculty: "Health Sciences",
          department: "Medical Laboratory Science",
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching admission letter:", error)
      setLoading(false)
    }
  }

  const handleDownload = () => {
    // Generate PDF download
    const element = document.getElementById("admission-letter")
    if (element) {
      window.print()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your admission letter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Print className="w-4 h-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Admission Letter */}
        <div id="admission-letter" className="bg-white rounded-xl shadow-xl p-12 print:shadow-none print:p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="w-16 h-16 text-blue-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">REMINGTON COLLEGE</h1>
                <p className="text-lg text-gray-600">OF HEALTH SCIENCES AND TECHNOLOGY</p>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-600 mx-auto mb-8"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">LETTER OF ADMISSION</h2>
            <p className="text-gray-600">Academic Session {letterData.sessionYear}</p>
          </div>

          {/* Letter Content */}
          <div className="space-y-8">
            {/* Admission Details */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Congratulations!</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We are pleased to inform you that you have been offered admission into{" "}
                <strong>{letterData.program}</strong> program at Remington College of Health Sciences and Technology for
                the {letterData.sessionYear} academic session.
              </p>
            </div>

            {/* Student Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Student Information</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {letterData.studentName}
                  </p>
                  <p>
                    <span className="font-medium">Admission Number:</span> {letterData.admissionNumber}
                  </p>
                  <p>
                    <span className="font-medium">Date of Admission:</span>{" "}
                    {new Date(letterData.dateOfAdmission).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Program Details</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Program:</span> {letterData.program}
                  </p>
                  <p>
                    <span className="font-medium">Faculty:</span> {letterData.faculty}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span> {letterData.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
                <h4 className="font-semibold text-gray-900">Important Dates & Instructions</h4>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Reporting Date:</strong> {new Date(letterData.reportingDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Registration:</strong> You are required to complete your registration within two weeks of
                  resumption.
                </p>
                <p>
                  <strong>Documents Required:</strong> Please bring original copies of all submitted documents for
                  verification.
                </p>
                <p>
                  <strong>Acceptance Fee:</strong> Your acceptance fee payment has been confirmed and processed.
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Terms and Conditions</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. This admission is provisional and subject to verification of all submitted documents.</p>
                <p>2. Failure to report on the specified date may result in forfeiture of admission.</p>
                <p>3. All college rules and regulations must be strictly adhered to.</p>
                <p>4. Fees once paid are non-refundable except in exceptional circumstances.</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end pt-12">
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Registrar</p>
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Head of Admissions</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                This letter was generated on {new Date().toLocaleDateString()} and is valid for the{" "}
                {letterData.sessionYear} academic session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
