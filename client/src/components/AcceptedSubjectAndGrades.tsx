'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'

import { apiRoutes } from '@/constants/apiRoutes'
import { useGetList } from '@/hooks/useGet'
import { Grade } from '@/types/program_ssc_requirement'
import GradeForm from './GradeForm'
import { GradeCard } from './GradeCard'
import { SSCSubject } from '@/types/ssc_subject'

import { SubjectCard } from './SubjectCard'
import SubjectForm from './SubjectForm'

export function GradesCrudPage() {
  const { data: grades, loading, error } = useGetList<Grade>(apiRoutes.grade.all)
  console.log('useGetlistEROR',error)

  return (
    <CrudPageWrapper
      title="grades"
      entityKey="grade"
      data={grades}
      loading={loading}
      error={error} 
      FormComponent={GradeForm}
      CardComponent={GradeCard}
    />
  )
}

export  function SubjectsCrudPage() {
  const { data: subjects, loading, error } = useGetList<SSCSubject>(apiRoutes.subject.all)


  return (
    <CrudPageWrapper
      title="Subjects"
      entityKey="subject"
      data={subjects}
      loading={loading}
      error={error}
      FormComponent={SubjectForm}
      CardComponent={SubjectCard}
    />
  )
}