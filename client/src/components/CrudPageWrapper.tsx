// components/icons.ts
import {
  Users,
  BookOpen,
  School,
  ScrollText,
  BadgeCheck,
  GraduationCap
} from 'lucide-react'

export const entityIcons: Record<string, React.ReactNode> = {
  department: <School className="w-12 h-12 text-blue-600" />,
  session: <ScrollText className="w-12 h-12 text-blue-600" />,
  programSpecificQualification: <BookOpen className="w-12 h-12 text-blue-600" />,
  sscQualification: <GraduationCap className="w-12 h-12 text-blue-600" />,
  program: <BadgeCheck className="w-12 h-12 text-blue-600" />,
  admissionOfficer: <Users className="w-12 h-12 text-blue-600" />
};


// components/CrudPageWrapper.tsx
'use client'

import { useState } from 'react'
import { Spinner } from '@/components/Spinner'
import ErrorAlert from '@/components/ErrorAlert'
import { DeleteModal } from '@/components/DeleteModal'
import { entityIcons } from './icons'

interface CrudPageWrapperProps<T> {
  title: string
  entityKey: string
  data: T[]
  loading: boolean
  error?: string
  FormComponent: React.ComponentType<any>
  CardComponent: React.ComponentType<{
    [key: string]: any
    onEdit: () => void
    onDelete: () => void
  }>
}

export function CrudPageWrapper<T>({
  title,
  entityKey,
  data,
  loading,
  error,
  FormComponent,
  CardComponent
}: CrudPageWrapperProps<T>) {
  const [createMode, setCreateMode] = useState(false)
  const [toDelete, setToDelete] = useState<T | null>(null)
  const [toUpdate, setToUpdate] = useState<T | null>(null)

  if (loading) return <Spinner className="w-10 h-10 text-blue-600" />
  if (error) return <ErrorAlert message={error || 'Failed to load'} />

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{title}</h1>
          <button
            onClick={() => setCreateMode(true)}
            className="bg-blue-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Add New
          </button>
        </div>

        {createMode && <FormComponent onCancel={() => setCreateMode(false)} />}
        {toUpdate && <FormComponent existingEntity={toUpdate} patch onCancel={() => setToUpdate(null)} />}

        {!data || data.length === 0 ? (
          <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              {entityIcons[entityKey]}
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No {title} Yet</h3>
            <p className="text-blue-700">Start by adding a new {title.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((item: any) => (
              <CardComponent
                key={item.id}
                entity={item}
                onEdit={() => setToUpdate(item)}
                onDelete={() => setToDelete(item)}
              />
            ))}
          </div>
        )}

        {toDelete && (
          <DeleteModal
            onClose={() => setToDelete(null)}
            id={toDelete.id}
            type={entityKey}
            message={`${(toDelete as any).name}`}
          />
        )}
      </div>
    </div>
  )
}


// example pages
// app/(dashboard)/departments/page.tsx


// Do the same for session, programSpecificQualification, sscQualification, program, admissionOfficer
