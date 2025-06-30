import React from 'react'
import { Calendar, Edit, Trash2, CheckCircle } from 'lucide-react'
import { Grade } from '@/types/grade'


interface GradeCardProps {
  entity: Grade
  onEdit: () => void
  onDelete: () => void
}

export const GradeCard: React.FC<GradeCardProps> = ({ entity, onEdit, onDelete }) => {


  return (
    <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
  
   
      </div>

      <div className="text-slate-800 text-sm mb-4 space-y-1">
        <p>
          <strong>Grade:</strong> {entity.grade}
        </p>
        <p>
          <strong>Grade Point:</strong> {entity.gradePoint}
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onEdit()} className="bg-slate-600 hover:bg-slate-700 text-white">
          <Edit size={16} className="mr-2" />
          Edit
        </button>
        <button onClick={() => onDelete()} className="text-red-600 border-red-400 hover:bg-red-50">
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  )
}
