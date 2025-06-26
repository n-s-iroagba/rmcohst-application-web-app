import { GraduationCap, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Faculty } from '@/types/faculty'

interface FacultyCardProps {
  entity: Faculty
  onEdit: () => void
  onDelete: () => void
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ entity, onEdit, onDelete }) => (
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
    <p className="text-sm text-slate-600 font-medium">Dean: {entity.nameOfDean || 'Not Assigned'}</p>
    <div className="flex gap-3 mt-3">
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
