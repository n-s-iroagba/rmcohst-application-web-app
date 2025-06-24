import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import DepartmentForm from '@/components/DepartmentForm'
import DepartmentCard from '@/components/DepartmentCard'

export default function DepartmentCrudPage() {
  const { departments, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="departments"
      entityKey="department"
      data={departments || []}
      loading={loading}
      error={error}
      FormComponent={DepartmentForm}
      CardComponent={DepartmentCard}
    />
  )
}
