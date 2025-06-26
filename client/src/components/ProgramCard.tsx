import { BadgeCheck, Edit, Trash2, Timer } from 'lucide-react'
import { Program } from '@/types/program'

interface ProgramCardProps {
  entity: Program
  onEdit: () => void
  onDelete: () => void
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ entity, onEdit, onDelete }) => (
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
