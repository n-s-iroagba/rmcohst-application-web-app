// app/(dashboard)/faculties/page.tsx
'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { FacultyCard } from '@/components/FacultyCard'
import FacultyForm from '@/components/FacultyForm'
import { useGetList } from '@/hooks/useGet'
import { Faculty } from '@/types/faculty'

export default function FacultyCrudPage() {
  const { data: faculties, loading, error } = useGetList<Faculty>('faculties')

  const handleSubmitUpdate = () => {
    // update logic here
  }
  const onDelete = () => {
    // delete logic here
  }

  return (
    <CrudPageWrapper
      title="Faculties"
      entityKey="faculty"
      data={faculties || []}
      loading={loading}
      error={error || 'An error occurred fetching faculties'}
      FormComponent={FacultyForm}
      CardComponent={FacultyCard}
    />
  )
}
