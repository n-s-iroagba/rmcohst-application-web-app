import React, { useState } from 'react'
import { Edit, Star, Trash2 } from 'lucide-react'

import { SSCSubject, SSCSubjectCreationAttributes } from '@/types/ssc_subject'
import { useGet } from '@/hooks/useApiQuery'
import { apiRoutes } from '@/constants/apiRoutes'
import { DeleteModal } from './DeleteModal'
import { CustomForm } from './CustomForm'
import ErrorAlert from './ErrorAlert'
import { Spinner } from './Spinner'

interface SSCSubjectCardProps {
  entity: SSCSubject
  onEdit: () => void
  onDelete: () => void
}

export const SubjectCard: React.FC<SSCSubjectCardProps> = ({ entity, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 shadow-md rounded-2xl p-6 transition hover:shadow-lg">
      <div className="flex justify-between items-center mb-4"></div>

      <div className="text-slate-800 text-sm mb-4 space-y-1">
        <p>
          <strong>SSCSubject:</strong> {entity.name}
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

const SubjectList = () => {
  const { resourceData, loading, error } = useGet<SSCSubject[]>(apiRoutes.subject.all)
  const [subjectToBeDeleted, setSubjectToBeDeleted] = useState<SSCSubject | null>(null)
  const [subjectToBeEdited, setSubjectToBeEdited] = useState<SSCSubject | null>(null)

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement edit logic
    console.log('Edit submitted for subject:', subjectToBeEdited)
    setSubjectToBeEdited(null)
  }

  const handleEditCancel = () => {
    setSubjectToBeEdited(null)
  }
  if (loading) return <Spinner className="w-10 h-10 text-slate-600" />

  if (error) return <ErrorAlert message={error || 'Failed to load'} />

  return (
    <div className="flex flex-col gap-4">
      {resourceData?.length ? (
        resourceData.map((subject) => (
          <SubjectCard
            key={subject.id}
            entity={subject}
            onEdit={() => setSubjectToBeEdited(subject)}
            onDelete={() => setSubjectToBeDeleted(subject)}
          />
        ))
      ) : (
        <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <Star className="text-slate-400" size={48} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No O'Level Subjects Yet</h3>
          <p className="text-slate-700">Start by adding a new subject.</p>
        </div>
      )}

      {subjectToBeDeleted && (
        <DeleteModal
          id={subjectToBeDeleted.id}
          onClose={() => setSubjectToBeDeleted(null)}
          type={'subject'}
          message={"Delete O'Level Subject"}
        />
      )}

      {subjectToBeEdited && (
        <CustomForm
          data={subjectToBeEdited as SSCSubjectCreationAttributes}
          submitHandler={handleEditSubmit}
          formLabel={'Edit Subject'}
          onCancel={handleEditCancel}
          submiting={false}
          error={''}
        />
      )}
    </div>
  )
}
export default SubjectList
