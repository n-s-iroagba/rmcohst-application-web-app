import { BookOpen, CheckCircle, EyeIcon, Users, Clock } from 'lucide-react'

import { apiRoutes } from '@/constants/apiRoutes'
import { useGet } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import { useState } from 'react'
import { GenericSearchBar } from './SearchBar'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
import ErrorAlert from './ErrorAlert'
import { Spinner } from './Spinner'

interface ProgramSSCRequirementCardProps {
  entity: ProgramSSCRequirement
  viewMore: (id: number) => void
}

const ProgramSSCRequirementListItem: React.FC<ProgramSSCRequirementCardProps> = ({
  entity,
  viewMore
}) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <BookOpen className="text-slate-600" size={24} />
        <h2 className="text-xl font-semibold text-slate-900">{entity.tag}</h2>
      </div>
      <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
        <CheckCircle size={16} />
        SSC Requirement
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <Clock size={16} className="text-slate-500" />
        <span className="font-medium">Max Sittings:</span>
        <span>{entity.maximumNumberOfSittings}</span>
      </div>

      <div className="flex items-start gap-2 text-sm text-slate-700">
        <Users size={16} className="text-slate-500 mt-0.5" />
        <div>
          <span className="font-medium">Qualification Types:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {entity.qualificationTypes.map((type, index) => (
              <span key={index} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-slate-600">
        <span className="font-medium">Required Subjects:</span> 5 subjects with specific grades
        <div className="text-xs text-slate-500 mt-1">
          Grades: {entity.firstSubjectGrade}, {entity.secondSubjectGrade},{' '}
          {entity.thirdSubjectGrade}, {entity.fourthSubjectGrade}, {entity.fifthSubjectGrade}
        </div>
      </div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={() => viewMore(entity.id)}
        className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
      >
        <EyeIcon size={16} />
        View More
      </button>
    </div>
  </div>
)

const ProgramSSCRequirementList = () => {
  const { resourceData, loading, error } = useGet<ProgramSSCRequirement[]>(
    apiRoutes.programSSCRequirement.all
  )
  const { navigateToProgramSSCRequirementDetails } = useRoutes()
  const [searchResults, setSearchResults] = useState<ProgramSSCRequirement[]>([])
  if (loading) return <Spinner className="w-10 h-10 text-slate-600" />

  if (error) return <ErrorAlert message={error || 'Failed to load'} />
  return (
    <>
      <GenericSearchBar<ProgramSSCRequirement>
        data={resourceData || []}
        searchKeys={['tag']}
        onResults={setSearchResults}
        placeholder="Search SSC requirements by tag..."
        className="mb-4" testId={''}      />

      <div className="flex flex-col gap-4">
        {searchResults?.length ? (
          searchResults.map((requirement) => (
            <ProgramSSCRequirementListItem
              key={requirement.id}
              entity={requirement}
              viewMore={navigateToProgramSSCRequirementDetails}
            />
          ))
        ) : (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <BookOpen className="text-slate-400" size={48} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No SSC Requirements Yet</h3>
            <p className="text-slate-700">Start by adding a new SSC requirement.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ProgramSSCRequirementList
