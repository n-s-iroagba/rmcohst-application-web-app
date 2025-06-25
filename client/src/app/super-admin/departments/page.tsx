// app/(dashboard)/departments/page.tsx
'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { DepartmentCard } from '@/components/DepartmentCard'
import DepartmentForm from '@/components/DepartmentForm' // Assume you have this
import { useGetList } from '@/hooks/useGet'
import { Department } from '@/types/department'

export default function DepartmentCrudPage() {
  const { data: departments, loading, error } = useGetList<Department>('departments')

  // Implement update/delete handlers if needed
  const handleSubmitUpdate = () => {
    // Your update logic here
  }

  const onDelete = () => {
    // Your delete logic here
  }

  return (
    <CrudPageWrapper
      title="Departments"
      entityKey="department"
      data={departments || []}
      loading={loading}
      error={error || 'An error occurred fetching departments'}
      FormComponent={DepartmentForm}
      CardComponent={DepartmentCard}
    />
  )
}
