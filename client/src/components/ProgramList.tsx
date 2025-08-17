import { BadgeCheck, EyeIcon } from 'lucide-react'
import { Program } from '@/types/program'
import { Department } from '@/types/department'
import { apiRoutes } from '@/constants/apiRoutes'
import { useGet } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import { Faculty } from '@/types/faculty'
import { useState } from 'react'
import { FilterDropdown } from './FilterDropdown'
import { GenericSearchBar } from './SearchBar'

interface ProgramCardProps {
  entity: Program
  viewMore: (id: number) => void
}

export const ProgramListItem: React.FC<ProgramCardProps> = ({ entity, viewMore }) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <BadgeCheck className="text-slate-600" size={24} />
        <h2 className="text-xl font-semibold text-slate-900">{entity.name}</h2>
      </div>
    </div>
    <div className="text-sm text-slate-800 space-y-1 mb-4">
      <p>
        <strong>Level:</strong> {entity.level}
      </p>
      <p>
        <strong>Duration:</strong> {entity.duration} {entity.durationType.toLowerCase()}
      </p>
      <p>
        <strong>Application Fee:</strong> ₦{entity.applicationFeeInNaira}
      </p>
      <p>
        <strong>Acceptance Fee:</strong> ₦{entity.acceptanceFeeInNaira}
      </p>
    </div>
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

const ProgramList = () => {
  const { resourceData: progs } = useGet<Program[]>(apiRoutes.program.all)
  const { resourceData: depts } = useGet<Department[]>(apiRoutes.department.all)
  const { resourceData: faculties } = useGet<Faculty[]>(apiRoutes.faculty.all)
  const { navigateToDepartmentDetails } = useRoutes()
  const [searchResults, setSearchResults] = useState<Program[]>([])
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)
  const departments = depts || []
  const programs = progs || []
const filteredDepartments =  departments.filter((dept) => dept.facultyId === selectedFacultyId);


  const filteredPrograms = programs.filter((prog) => prog.departmentId === selectedDepartmentId)

  return (
    <>
      <FilterDropdown
        data={faculties || []}
        filterKey="id"
        filterValue={selectedFacultyId}
        onFilterChange={setSelectedFacultyId}
        displayKey="name"
        label="Select Faculty"
        placeholder="Choose a faculty..." dropDownTestId={''} optionsTestId={function (): string {
          throw new Error('Function not implemented.')
        } }      />
      <FilterDropdown
        data={filteredDepartments}
        filterKey="id"
        filterValue={selectedDepartmentId}
        onFilterChange={setSelectedDepartmentId}
        displayKey="name"
        label="Select Faculty"
        placeholder="Choose a department..." dropDownTestId={''} optionsTestId={function (): string {
          throw new Error('Function not implemented.')
        } }      />
      <GenericSearchBar<Program>
        data={filteredPrograms || []}
        searchKeys={['name']}
        onResults={setSearchResults}
        placeholder="Search departements by name ..."
        className="mb-4" testId={''}      />

      <div className="flex flex-col gap-4">
        {searchResults?.length ? (
          searchResults.map((department) => (
            <ProgramListItem
              key={department.id}
              entity={department}
              viewMore={navigateToDepartmentDetails}
            />
          ))
        ) : (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Programs yet</h3>
            <p className="text-slate-700">Start by adding new programs.</p>
          </div>
        )}
      </div>
    </>
  )
}
export default ProgramList
