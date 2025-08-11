import { Star, CheckCircle, EyeIcon, Users, Award } from 'lucide-react'

import { apiRoutes } from '@/constants/apiRoutes'
import { useGet } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import { useState } from 'react'
import { GenericSearchBar } from './SearchBar'
import { ProgramSpecificRequirement } from '@/types/program_specific_requirement'
import ErrorAlert from './ErrorAlert'
import { Spinner } from './Spinner'

interface ProgramSpecificRequirementCardProps {
  entity: ProgramSpecificRequirement
  viewMore: (id: number) => void
}

const ProgramSpecificRequirementListItem: React.FC<ProgramSpecificRequirementCardProps> = ({
  entity,
  viewMore
}) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Star className="text-slate-600" size={24} />
        <h2 className="text-xl font-semibold text-slate-900">{entity.tag}</h2>
      </div>
      <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
        <CheckCircle size={16} />
        Specific Requirement
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <Award size={16} className="text-slate-500" />
        <span className="font-medium">Minimum Grade:</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
          {entity.minimumGrade}
        </span>
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

const ProgramSpecificRequirementList = () => {
  const { resourceData, loading, error } = useGet<ProgramSpecificRequirement[]>(
    apiRoutes.programSpecificRequirement.all
  )
  const { navigateToProgramSpecificRequirementDetails } = useRoutes()
  const [searchResults, setSearchResults] = useState<ProgramSpecificRequirement[]>([])
  if (loading) return <Spinner className="w-10 h-10 text-slate-600" />

  if (error) return <ErrorAlert message={error || 'Failed to load'} />
  return (
    <>
      <GenericSearchBar<ProgramSpecificRequirement>
        data={resourceData || []}
        searchKeys={['tag', 'minimumGrade']}
        onResults={setSearchResults}
        placeholder="Search specific requirements by tag or grade..."
        className="mb-4"
      />

      <div className="flex flex-col gap-4">
        {searchResults?.length ? (
          searchResults.map((requirement) => (
            <ProgramSpecificRequirementListItem
              key={requirement.id}
              entity={requirement}
              viewMore={navigateToProgramSpecificRequirementDetails}
            />
          ))
        ) : (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <Star className="text-slate-400" size={48} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Specific Requirements Yet
            </h3>
            <p className="text-slate-700">Start by adding a new specific requirement.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default ProgramSpecificRequirementList
