import { Building2, CheckCircle, EyeIcon } from 'lucide-react'
import { Department } from '@/types/department'
import { useGet } from '@/hooks/useApiQuery'
import { apiRoutes } from '@/constants/apiRoutes'
import { useRoutes } from '@/hooks/useRoutes'
import { GenericSearchBar } from './SearchBar'
import { useMemo, useState } from 'react'
import { Faculty } from '@/types/faculty'
import { title } from 'process'
import { FilterDropdown } from './FilterDropdown'
import { Spinner } from './Spinner'
import ErrorAlert from './ErrorAlert'



interface DepartmentListItemProps {
  entity: Department
  viewMore: (id:number) => void
}

const DepartmentListItem: React.FC<DepartmentListItemProps> = ({ entity, viewMore}) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Building2 className="text-slate-600" size={24} />
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


const DepartmentList = ()=>{
  const {resourceData,loading:deptLoading,error} = useGet<Department[]>(apiRoutes.department.all)
  const {resourceData:faculties,loading:facLoading} = useGet<Faculty[]>(apiRoutes.faculty.all)
  const {navigateToDepartmentDetails}= useRoutes()
  const [searchResults, setSearchResults] = useState<Department[]>([])
  const [selectedFacultyId,setSelectedFacultyId]=useState<number|null>(null)
  const loading = deptLoading||facLoading
  const departments = resourceData || []

const filteredDepartments = useMemo(() => {

    if (!selectedFacultyId) return departments;
    return departments.filter(dept => dept.facultyId === selectedFacultyId);
  }, [selectedFacultyId]);
 if (loading) return <Spinner className="w-10 h-10 text-slate-600" />

  if (error) return <ErrorAlert message={error || 'Failed to load'} />
  return (
    <>
        <FilterDropdown
          data={faculties||[]}
          filterKey="id"
          filterValue={selectedFacultyId}
          onFilterChange={setSelectedFacultyId}
          displayKey="name"
          label="Select Faculty"
          placeholder="Choose a faculty..."
        />
       <GenericSearchBar<Department>
          data={filteredDepartments}
          searchKeys={['name']}
          onResults={setSearchResults}
          placeholder="Search departements by name ..."
          className="mb-4"
        />
      
    <div className="flex flex-col gap-4">
      {searchResults?.length?(searchResults.map((department) => (
        <DepartmentListItem
        key={department.id}
        entity={department}
        viewMore={navigateToDepartmentDetails}
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
export default DepartmentList