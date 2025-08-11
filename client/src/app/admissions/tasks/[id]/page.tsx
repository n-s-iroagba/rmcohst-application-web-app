'use client'

import ApplicationDetail from '@/components/ApplicationDetails'
import { API_ROUTES } from '@/config/routes'
import { useGet } from '@/hooks/useApiQuery'
import { Application } from '@/types/application'

import { FileText } from 'lucide-react'
import { useParams } from 'next/navigation'

const ApplicationDetailPage = () => {
  const id = useParams().id as string
  const { resourceData: application } = useGet<Application>(API_ROUTES.APPLICATION.GET_BY_ID(id))

  return (
    <div className="flex-1">
      {application ? (
        <ApplicationDetail application={application} />
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
