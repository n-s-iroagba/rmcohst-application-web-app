import { FileText } from 'lucide-react'
import { useState } from 'react'

const ApplicationDetailPage = () => {
  const [isDocumentView, setIsDocumentView] = useState()
  const { application, onStatusUpdate } = useReviewApplication()
  return (
    <div className="flex-1">
      {!isDocumentView ? (
        <ApplicationDetail application={} onStatusUpdate={handleStatusUpdate} />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
            <p className="text-gray-500">Select an application from the list to review</p>
          </div>
        </div>
      )}
    </div>
  )
}
ApplicationDetailPage
