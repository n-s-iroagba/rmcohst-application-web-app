import type React from "react"
// Ensure this file has: export default AdminGenericDocumentsSection;
import type { ApplicantDocumentAttributes } from "@/types/applicant_document"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText } from "lucide-react"

interface AdminGenericDocumentsSectionProps {
  documents?: ApplicantDocumentAttributes[]
  isLoading?: boolean
}

const AdminGenericDocumentsSection: React.FC<AdminGenericDocumentsSectionProps> = ({ documents, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Applicant Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading documents...</p>
        </CardContent>
      </Card>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Applicant Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No additional documents were uploaded by the applicant.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Applicant Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <h4 className="font-semibold text-md">{doc.documentType}</h4>
                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" title={`View ${doc.fileName}`}>
                    View <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
              {doc.fileSize && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Size: {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
export default AdminGenericDocumentsSection
