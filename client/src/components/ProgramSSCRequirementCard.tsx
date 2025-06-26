import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
import { BookOpenCheck, Edit, Trash2 } from 'lucide-react'

interface ProgramSSCRequirementCardProps {
  entity: ProgramSSCRequirement
  onEdit: () => void
  onDelete: () => void
}

export const ProgramSSCRequirementCard: React.FC<ProgramSSCRequirementCardProps> = ({
  entity,
  onEdit,
  onDelete
}) => (
  <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      <BookOpenCheck className="text-slate-600" size={24} />
      <h2 className="text-xl font-semibold text-slate-900">
        SSC Requirement (Max {entity.maximumNumberOfSittings} sittings)
      </h2>
    </div>
    <p className="text-slate-800 text-sm mb-2">
      Applies to: {entity.programs.map((p) => p.name).join(', ') || 'No linked programs'}
    </p>
    <p className="text-slate-800 text-sm mb-4">
      Required Subjects:{' '}
      {entity.subjectAndGrades.map((sg) => `${sg.subject.name} (${sg.grade.grade})`).join(', ')}
    </p>
    <div className="flex gap-3">
      <button
        onClick={onEdit}
        className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded-lg"
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
