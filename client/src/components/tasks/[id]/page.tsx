'use client'

import ApplicationDetail from '@/components/ApplicationDetails'
import useReviewApplication from '@/hooks/useReviewApplication'
import { FileText } from 'lucide-react'



const ApplicationDetailPage = () => {


  const { application } = useReviewApplication('1')
  return (
    <div className="flex-1">
      {application ? (
        <ApplicationDetail application={application}/>
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
export default ApplicationDetailPage
