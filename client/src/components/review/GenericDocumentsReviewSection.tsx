import type React from "react"
// Ensure this file has: export default GenericDocumentsReviewSection;
import type { ApplicantDocumentAttributes } from "@/types/applicant_document" // Corrected import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" // Assuming Button is for actions like 'View'
import { ExternalLink } from "lucide-react"

interface GenericDocumentsReviewSectionProps {
  documents?: ApplicantDocumentAttributes[]
  isLoading?: boolean
}

const GenericDocumentsReviewSection: React.FC<GenericDocumentsReviewSectionProps> = ({ documents, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading documents...</p>
        </CardContent>
      </Card>
    )
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No additional documents have been uploaded yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{doc.documentType}</p>
                <p className="text-sm text-muted-foreground">{doc.fileName}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  View Document <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default GenericDocumentsReviewSection
