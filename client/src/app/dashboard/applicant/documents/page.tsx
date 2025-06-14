"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation" // If needed for navigation
import withAuth from "@/components/auth/withAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, UploadCloud, Trash2, FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react"
import {
  uploadApplicantDocument,
  getApplicantDocuments,
  deleteApplicantDocument,
} from "@/services/applicantDocument.service"
import {
  type ApplicantDocument,
  type ClientApplicantDocumentType,
  ALL_CLIENT_APPLICANT_DOCUMENT_TYPES,
} from "@/types/applicant_document"
import { getMyApplication } from "@/services/application.service" // To get current application ID
import { type Application, ApplicationStatus } from "@/types/application" // For application status check

function ApplicantDocumentsPage() {
  const [application, setApplication] = useState<Application | null>(null)
  const [documents, setDocuments] = useState<ApplicantDocument[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState<ClientApplicantDocumentType | "">("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null) // Store ID of doc being deleted
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const router = useRouter()

  // Fetch current application to get its ID and status
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setIsLoading(true)
        const appData = await getMyApplication()
        setApplication(appData)
        if (appData && appData.id) {
          fetchDocuments(appData.id)
        } else {
          setError("Could not load your application details. Please try again.")
          setIsLoading(false)
        }
      } catch (err: any) {
        setError(err.message || "Failed to load application information.")
        setIsLoading(false)
      }
    }
    fetchAppData()
  }, [])

  const fetchDocuments = async (appId: string) => {
    try {
      const docs = await getApplicantDocuments(appId)
      setDocuments(docs)
    } catch (err: any) {
      setError(err.message || "Failed to load your documents.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setError(null) // Clear previous file errors
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocumentType) {
      setError("Please select a document type and a file to upload.")
      return
    }
    if (!application || !application.id) {
      setError("Application ID not found. Cannot upload document.")
      return
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      setError("Documents can only be uploaded while the application is in DRAFT status.")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await uploadApplicantDocument(application.id, selectedDocumentType as ClientApplicantDocumentType, selectedFile)
      setSuccessMessage(`${selectedDocumentType} uploaded successfully!`)
      setSelectedFile(null) // Reset file input
      setSelectedDocumentType("") // Reset select
      if (document.getElementById("documentFile")) {
        // Reset file input visually
        ;(document.getElementById("documentFile") as HTMLInputElement).value = ""
      }
      fetchDocuments(application.id) // Refresh document list
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string, documentName: string) => {
    if (!application || application.status !== ApplicationStatus.DRAFT) {
      setError("Documents can only be deleted while the application is in DRAFT status.")
      // Optionally, disable delete buttons if not in DRAFT status
      return
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${documentName}"? This action cannot be undone.`,
    )
    if (!confirmDelete) return

    setIsDeleting(documentId)
    setError(null)
    setSuccessMessage(null)
    try {
      await deleteApplicantDocument(documentId)
      setSuccessMessage(`Document "${documentName}" deleted successfully.`)
      setDocuments(documents.filter((doc) => doc.id !== documentId))
    } catch (err: any) {
      setError(err.message || "Failed to delete document.")
    } finally {
      setIsDeleting(null)
    }
  }

  const canModifyDocuments = application?.status === ApplicationStatus.DRAFT

  if (isLoading && !application) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg mt-4">Loading document manager...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Supporting Documents</CardTitle>
          <CardDescription>
            Upload required documents such as Birth Certificate, LGA Identification, etc. Ensure files are clear and
            legible. Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {!canModifyDocuments && application && (
            <Alert variant="info">
              <FileText className="h-4 w-4" />
              <AlertTitle>Application Status: {application.status}</AlertTitle>
              <AlertDescription>
                Documents cannot be modified as the application is not in DRAFT status.
              </AlertDescription>
            </Alert>
          )}

          {canModifyDocuments && (
            <div className="space-y-4 p-4 border rounded-md bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <Select
                    value={selectedDocumentType}
                    onValueChange={(value) => setSelectedDocumentType(value as ClientApplicantDocumentType | "")}
                    disabled={isUploading}
                  >
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CLIENT_APPLICANT_DOCUMENT_TYPES.map((docType) => (
                        <SelectItem key={docType} value={docType}>
                          {docType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700 mb-1">
                    Choose File
                  </label>
                  <Input
                    id="documentFile"
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile || !selectedDocumentType}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Upload Document
              </Button>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>
            {isLoading && documents.length === 0 ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500 mx-auto" />
                <p className="text-sm text-gray-500 mt-1">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">
                          Type: {doc.documentType} | Size:{" "}
                          {doc.fileSize ? (doc.fileSize / 1024 / 1024).toFixed(2) + " MB" : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                        title="View/Download Document"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {canModifyDocuments && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.fileName)}
                          disabled={isDeleting === doc.id}
                          title="Delete Document"
                        >
                          {isDeleting === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push("/dashboard/applicant")} className="w-full sm:w-auto">
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default withAuth(ApplicantDocumentsPage, ["APPLICANT"])
