// components/DisplayPageWrapper.tsx
'use client'
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
  programNew: <Timer className="w-12 h-12 text-slate-600" />,
  grade: <BadgeCheck className="w-12 h-12 text-slate-600" />,
  subject: <BookOpen className="w-12 h-12 text-slate-600" />
}

export type EntityKey =
  | 'faculty'
  | 'department'
  | 'program'
  | 'session'
  | 'programSpecificRequirement'
  | 'programSSCRequirement'
  | 'grade'
  | 'subject'

interface DisplayPageWrapperProps {
  title: string
  entityKey: EntityKey
  navigateToCreate: () => void
  ListComponent: React.ComponentType
}

export function DisplayPageWrapper({
  title,
  entityKey,
  navigateToCreate,
  ListComponent
}: DisplayPageWrapperProps) {
  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            {entityIcons[entityKey]}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
          </div>

          <button
            onClick={() => navigateToCreate()}
            className="bg-slate-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-slate-700 transition-colors w-full sm:w-auto"
          >
            Add New
          </button>
        </div>

        <ListComponent />
      </div>
    </div>
  )
}
