"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, File, CheckCircle, AlertCircle, X, Eye, ChevronLeft, FileText, ImageIcon } from "lucide-react"

interface DocumentType {
  id: string
  name: string
  description: string
  required: boolean
  maxSize: string
  acceptedFormats: string[]
  uploaded?: boolean
  file?: File
  url?: string
}

interface UploadedFile {
  file: File
  preview?: string
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function DocumentUpload() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({})

  const documentTypes: DocumentType[] = [
    {
      id: "passport",
      name: "Passport Photograph",
      description: "Recent passport-sized photograph with white background",
      required: true,
      maxSize: "2MB",
      acceptedFormats: ["JPG", "PNG"],
      uploaded: false,
    },
    {
      id: "waec",
      name: "WAEC/NECO Certificate",
      description: "Original or certified copy of your WAEC/NECO certificate",
      required: true,
      maxSize: "5MB",
      acceptedFormats: ["PDF", "JPG", "PNG"],
      uploaded: false,
    },
    {
      id: "birth_certificate",
      name: "Birth Certificate",
      description: "Original or certified copy of birth certificate",
      required: true,
      maxSize: "5MB",
      acceptedFormats: ["PDF", "JPG", "PNG"],
      uploaded: false,
    },
    {
      id: "local_govt",
      name: "Local Government Certificate",
      description: "Certificate of origin from local government",
      required: true,
      maxSize: "5MB",
      acceptedFormats: ["PDF", "JPG", "PNG"],
      uploaded: false,
    },
    {
      id: "medical_report",
      name: "Medical Report",
      description: "Recent medical fitness report",
      required: true,
      maxSize: "5MB",
      acceptedFormats: ["PDF", "JPG", "PNG"],
      uploaded: false,
    },
    {
      id: "jamb_result",
      name: "JAMB Result",
      description: "JAMB UTME result slip (if applicable)",
      required: false,
      maxSize: "5MB",
      acceptedFormats: ["PDF", "JPG", "PNG"],
      uploaded: false,
    },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, documentId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0], documentId)
    }
  }, [])

  const handleFileUpload = async (file: File, documentId: string) => {
    const documentType = documentTypes.find((doc) => doc.id === documentId)
    if (!documentType) return

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toUpperCase()
    if (!fileExtension || !documentType.acceptedFormats.includes(fileExtension)) {
      alert(`Please upload a file in one of these formats: ${documentType.acceptedFormats.join(", ")}`)
      return
    }

    // Validate file size
    const maxSizeInBytes = Number.parseFloat(documentType.maxSize) * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      alert(`File size must be less than ${documentType.maxSize}`)
      return
    }

    // Create preview for images
    let preview: string | undefined
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file)
    }

    // Set uploading state
    setUploadedFiles((prev) => ({
      ...prev,
      [documentId]: {
        file,
        preview,
        uploading: true,
        uploaded: false,
      },
    }))

    // Simulate upload
    setTimeout(() => {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentId]: {
          ...prev[documentId],
          uploading: false,
          uploaded: true,
        },
      }))
    }, 2000)
  }

  const removeFile = (documentId: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      if (newFiles[documentId]?.preview) {
        URL.revokeObjectURL(newFiles[documentId].preview!)
      }
      delete newFiles[documentId]
      return newFiles
    })
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return ImageIcon
    } else if (extension === "pdf") {
      return FileText
    }
    return File
  }

  const requiredDocuments = documentTypes.filter((doc) => doc.required)
  const optionalDocuments = documentTypes.filter((doc) => !doc.required)
  const uploadedRequiredCount = requiredDocuments.filter((doc) => uploadedFiles[doc.id]?.uploaded).length
  const allRequiredUploaded = uploadedRequiredCount === requiredDocuments.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Document Upload</h1>
                <p className="text-sm text-gray-500">Upload required documents to complete your application</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                {uploadedRequiredCount} of {requiredDocuments.length} required documents uploaded
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Progress</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                allRequiredUploaded ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {uploadedRequiredCount}/{requiredDocuments.length} Required
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadedRequiredCount / requiredDocuments.length) * 100}%` }}
            />
          </div>

          {allRequiredUploaded && (
            <div className="mt-4 flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">All required documents uploaded!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Required Documents */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                Required Documents
              </h3>

              <div className="space-y-6">
                {requiredDocuments.map((document) => (
                  <DocumentUploadCard
                    key={document.id}
                    document={document}
                    uploadedFile={uploadedFiles[document.id]}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={removeFile}
                    onDrag={handleDrag}
                    onDrop={handleDrop}
                    dragActive={dragActive}
                    getFileIcon={getFileIcon}
                  />
                ))}
              </div>
            </div>

            {/* Optional Documents */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 text-blue-500 mr-2" />
                Optional Documents
              </h3>

              <div className="space-y-6">
                {optionalDocuments.map((document) => (
                  <DocumentUploadCard
                    key={document.id}
                    document={document}
                    uploadedFile={uploadedFiles[document.id]}
                    onFileUpload={handleFileUpload}
                    onRemoveFile={removeFile}
                    onDrag={handleDrag}
                    onDrop={handleDrop}
                    dragActive={dragActive}
                    getFileIcon={getFileIcon}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Guidelines */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span>Ensure documents are clear and readable</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span>Upload original or certified copies only</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span>File size should not exceed specified limits</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span>Accepted formats: PDF, JPG, PNG</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-blue-500 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Having trouble uploading documents? Our support team is here to help.
              </p>
              <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/application/payment")}
            disabled={!allRequiredUploaded}
            className={`px-8 py-4 rounded-lg font-medium text-white transition-all ${
              allRequiredUploaded
                ? "bg-gradient-to-r from-blue-600 to-red-600 hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {allRequiredUploaded ? "Continue to Payment" : "Upload Required Documents First"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Document Upload Card Component
interface DocumentUploadCardProps {
  document: DocumentType
  uploadedFile?: UploadedFile
  onFileUpload: (file: File, documentId: string) => void
  onRemoveFile: (documentId: string) => void
  onDrag: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, documentId: string) => void
  dragActive: boolean
  getFileIcon: (fileName: string) => any
}

function DocumentUploadCard({
  document,
  uploadedFile,
  onFileUpload,
  onRemoveFile,
  onDrag,
  onDrop,
  dragActive,
  getFileIcon,
}: DocumentUploadCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files[0], document.id)
    }
  }

  const FileIcon = uploadedFile?.file ? getFileIcon(uploadedFile.file.name) : Upload

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{document.name}</h4>
            {document.required && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Required</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{document.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>Max size: {document.maxSize}</span>
            <span>Formats: {document.acceptedFormats.join(", ")}</span>
          </div>
        </div>
      </div>

      {uploadedFile ? (
        <div className="space-y-3">
          {uploadedFile.uploading ? (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-700">Uploading...</span>
            </div>
          ) : uploadedFile.uploaded ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium text-green-900">{uploadedFile.file.name}</div>
                  <div className="text-xs text-green-700">{(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadedFile.preview && (
                  <button className="p-1 text-green-600 hover:text-green-800">
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => onRemoveFile(document.id)} className="p-1 text-red-600 hover:text-red-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={(e) => onDrop(e, document.id)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={document.acceptedFormats.map((format) => `.${format.toLowerCase()}`).join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your file here, or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            {document.acceptedFormats.join(", ")} up to {document.maxSize}
          </p>
        </div>
      )}
    </div>
  )
}
