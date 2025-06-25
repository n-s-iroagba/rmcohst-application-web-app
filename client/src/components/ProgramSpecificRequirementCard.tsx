import { ProgramSpecificRequirement } from '@/types/program_specific_requirement'
import { FileText, Edit, Trash2 } from 'lucide-react'

interface ProgramSpecificRequirementCardProps {
  entity: ProgramSpecificRequirement
  onEdit: () => void
  onDelete: () => void
}

export const ProgramSpecificRequirementCard: React.FC<ProgramSpecificRequirementCardProps> = ({
  entity,
  onEdit,
  onDelete
}) => (
  <div className="bg-blue-50 border border-blue-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      <FileText className="text-blue-600" size={24} />
      <h2 className="text-xl font-semibold text-blue-900">{entity.qualificationType}</h2>
    </div>
    <p className="text-blue-800 text-sm mb-2">
      Minimum Grade Required: <span className="font-medium">{entity.minimumGrade}</span>
    </p>
    <div className="flex gap-3 mt-2">
      <button
        onClick={onEdit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
      >
        <Edit size={16} className="mr-1" />
        Edit
      </button>
      <button onClick={onDelete} className="text-red-600 hover:text-red-800 px-3 py-1 rounded-lg">
        <Trash2 size={16} className="mr-1" />
        Delete
      </button>
    </div>
  </div>
)
