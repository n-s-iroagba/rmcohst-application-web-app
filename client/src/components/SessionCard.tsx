import React, { useState } from 'react'
import { Calendar, Edit, Trash2, CheckCircle, EyeIcon } from 'lucide-react'
import { apiRoutes } from '@/constants/apiRoutes'
import { GenericSearchBar } from './SearchBar'
import { useGet } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import { title } from 'process'

export interface AdmissionSession {
  id: number
  name: string
  applicationStartDate: Date
  applicationEndDate: Date
  isCurrent: boolean
}

interface AdmissionSessionListItemProps {
  entity: AdmissionSession
  viewMore:(id:number)=>void
}
 const AdmissionSessionListItem: React.FC<AdmissionSessionListItemProps> = ({ entity, viewMore }) => {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

  return (
    <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-slate-600" size={24} />
          <h2 className="text-xl font-semibold text-slate-900">{entity.name}</h2>
        </div>
        {entity.isCurrent && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            Current
          </div>
        )}
      </div>

      <div className="text-slate-800 text-sm mb-4 space-y-1">
        <p>
          <strong>Start:</strong> {formatDate(entity.applicationStartDate)}
        </p>
        <p>
          <strong>End:</strong> {formatDate(entity.applicationEndDate)}
        </p>
      </div>

      <div className="flex gap-3">
     <button
           onClick={()=>viewMore(entity.id)}
           className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg"
         >
           <EyeIcon size={16} className="mr-1" />
           View More
         </button>
      </div>
    </div>
  )
}

const AdmissionSessionList = ()=>{
  const {resourceData} = useGet<AdmissionSession[]>(apiRoutes.admissionSession.all)
  const {navigateToAdmissionSessionDetails}= useRoutes()
  const [searchResults, setSearchResults] = useState<AdmissionSession[]>([])



  return (
    <>
      
       <GenericSearchBar<AdmissionSession>
          data={resourceData||[]}
          searchKeys={['name']}
          onResults={setSearchResults}
          placeholder="Search departements by name ..."
          className="mb-4"
        />
      
    <div className="flex flex-col gap-4">
      {searchResults?.length?(searchResults.map((AdmissionSession) => (
        <AdmissionSessionListItem
        key={AdmissionSession.id}
        entity={AdmissionSession}
        viewMore={navigateToAdmissionSessionDetails}
        />
      ))):(   
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No {title} Yet</h3>
            <p className="text-slate-700">Start by adding a new {title.toLowerCase()}.</p>
          </div>
        ) 
    
    }
    </div>
    </>
  )
}
export default AdmissionSessionList