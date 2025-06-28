// app/(dashboard)/faculties/page.tsx
'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { FacultyCard } from '@/components/FacultyCard'
import FacultyForm from '@/components/FacultyForm'
import { apiRoutes } from '@/constants/apiRoutes'
import { useGetList } from '@/hooks/useGet'
import { Faculty } from '@/types/faculty'

export default function FacultyCrudPage() {
  const { data: faculties, loading, error } = useGetList<Faculty>(apiRoutes.faculty.all)



  return (
    <CrudPageWrapper
      title="Faculties"
      entityKey="faculty"
      data={faculties || []}
      loading={loading}
      error={error}
      FormComponent={FacultyForm}
      CardComponent={FacultyCard}
    />
  )
}
