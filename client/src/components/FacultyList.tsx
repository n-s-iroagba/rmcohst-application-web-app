import { GraduationCap, Edit, Trash2, CheckCircle, EyeIcon } from 'lucide-react'
import { Faculty } from '@/types/faculty'
import { apiRoutes } from '@/constants/apiRoutes'
import { useGet } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import { title } from 'process'
import { useState } from 'react'
import { GenericSearchBar } from './SearchBar'

interface FacultyCardProps {
  entity: Faculty
  viewMore: (id: number) => void
}
const FacultyListItem: React.FC<FacultyCardProps> = ({ entity, viewMore }) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <GraduationCap className="text-slate-600" size={24} />
        <h2 className="text-xl font-semibold text-slate-900">{entity.name}</h2>
      </div>
      {entity.isActive && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle size={16} />
          Active
        </div>
      )}
    </div>
    <p className="text-slate-800 text-sm mb-4">{entity.description || 'No description.'}</p>
    <p className="text-sm text-slate-600 font-medium">
      Dean: {entity.nameOfDean || 'Not Assigned'}
    </p>
    <div className="flex gap-3">
      <button
        onClick={() => viewMore(entity.id)}
        className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg"
      >
        <EyeIcon size={16} className="mr-1" />
        View More
      </button>
    </div>
  </div>
)

const FacultyList = () => {
  const { resourceData } = useGet<Faculty[]>(apiRoutes.faculty.all)
  const { navigateToFacultyDetails } = useRoutes()
  const [searchResults, setSearchResults] = useState<Faculty[]>([])

  return (
    <>
      <GenericSearchBar<Faculty>
        data={resourceData || []}
        searchKeys={['name']}
        onResults={setSearchResults}
        placeholder="Search departements by name ..."
        className="mb-4"
      />

      <div className="flex flex-col gap-4">
        {searchResults?.length ? (
          searchResults.map((Faculty) => (
            <FacultyListItem
              key={Faculty.id}
              entity={Faculty}
              viewMore={navigateToFacultyDetails}
            />
          ))
        ) : (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No {title} Yet</h3>
            <p className="text-slate-700">Start by adding a new {title.toLowerCase()}.</p>
          </div>
        )}
      </div>
    </>
  )
}
export default FacultyList
