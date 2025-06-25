import React from 'react'
import { Calendar, Edit, Trash2, CheckCircle } from 'lucide-react'

export interface Session {
  id: number
  name: string
  applicationStartDate: Date
  applicationEndDate: Date
  isCurrent: boolean
}

interface SessionCardProps {
  entity: Session
  onEdit: () => void
  onDelete: () => void
}

export const SessionCard: React.FC<SessionCardProps> = ({ entity, onEdit, onDelete }) => {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

  return (
    <div className="bg-blue-50 border border-blue-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-blue-900">{entity.name}</h2>
        </div>
        {entity.isCurrent && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle size={16} />
            Current
          </div>
        )}
      </div>

      <div className="text-blue-800 text-sm mb-4 space-y-1">
        <p>
          <strong>Start:</strong> {formatDate(entity.applicationStartDate)}
        </p>
        <p>
          <strong>End:</strong> {formatDate(entity.applicationEndDate)}
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={() => onEdit()} className="bg-blue-600 hover:bg-blue-700 text-white">
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
