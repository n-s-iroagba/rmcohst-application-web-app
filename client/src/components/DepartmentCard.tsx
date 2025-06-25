import { Building2, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Department } from '@/types/department'

interface DepartmentCardProps {
  entity: Department
  onEdit: () => void
  onDelete: () => void
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ entity, onEdit, onDelete }) => (
  <div className="bg-blue-50 border border-blue-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <Building2 className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-blue-900">{entity.name}</h2>
      </div>
      {entity.isActive && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <CheckCircle size={16} />
          Active
        </div>
      )}
    </div>
    <p className="text-blue-800 text-sm mb-4">{entity.description || 'No description.'}</p>
    <div className="flex gap-3">
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
