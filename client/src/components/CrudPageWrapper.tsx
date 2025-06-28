// components/CrudPageWrapper.tsx
'use client'

import { useState } from 'react'
import { Spinner } from '@/components/Spinner'
import ErrorAlert from '@/components/ErrorAlert'
import { DeleteModal } from '@/components/DeleteModal'
import {
  Users,
  BookOpen,
  School,
  ScrollText,
  BadgeCheck,
  GraduationCap,
  Building2,
  FileText,
  BookOpenCheck,
  Timer
} from 'lucide-react'

export const entityIcons: Record<string, React.ReactNode> = {
  department: <School className="w-12 h-12 text-slate-600" />,
  session: <ScrollText className="w-12 h-12 text-slate-600" />,
  programSpecificQualification: <BookOpen className="w-12 h-12 text-slate-600" />,
  sscQualification: <GraduationCap className="w-12 h-12 text-slate-600" />,
  program: <BadgeCheck className="w-12 h-12 text-slate-600" />,
  admissionOfficer: <Users className="w-12 h-12 text-slate-600" />,
  faculty: <GraduationCap className="w-12 h-12 text-slate-600" />,
  programSSCRequirement: <BookOpenCheck className="w-12 h-12 text-slate-600" />,
  programSpecificRequirement: <FileText className="w-12 h-12 text-slate-600" />,
  departmentNew: <Building2 className="w-12 h-12 text-slate-600" />,
  programNew: <Timer className="w-12 h-12 text-slate-600" />
}

interface HasIdAndName {
  id: number
  name?: string // optional if some types may not have name
}

interface CrudPageWrapperProps<T extends HasIdAndName> {
  title: string
  entityKey:
    | 'faculty'
    | 'department'
    | 'program'
    | 'session'
    | 'programSpecificRequirement'
    | 'programSSCRequirement'
  data: T[]
  loading: boolean
  error: string|null
  FormComponent: React.ComponentType<any>
  CardComponent: React.ComponentType<{
    entity: T
    onEdit: () => void
    onDelete: () => void
  }>
}

export function CrudPageWrapper<T extends HasIdAndName>({     
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

  if (loading) return <Spinner className="w-10 h-10 text-slate-600" />
  if (error) console.log('error is', error)
  if (error) return <ErrorAlert message={error || 'Failed to load'} />

  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
          <button
            onClick={() => setCreateMode(true)}
            className="bg-slate-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-slate-700 transition-colors w-full sm:w-auto"
          >
            Add New
          </button>
        </div>

        {createMode && <FormComponent onCancel={() => setCreateMode(false)} />}
        {toUpdate && (
          <FormComponent existingEntity={toUpdate} onCancel={() => setToUpdate(null)} />
        )}
 
        {!data || data.length === 0 ? (
          <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">{entityIcons[entityKey]}</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No {title} Yet</h3>
            <p className="text-slate-700">Start by adding a new {title.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.map((item: T) => (
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
