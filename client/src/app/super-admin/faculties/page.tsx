import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import FacultyForm from '@/components/FacultyForm'
import FacultyCard from '@/components/FacultyCard'

export default function FacultyCrudPage() {
  const { faculties, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="faculties"
      entityKey="faculty"
      data={faculties || []}
      loading={loading}
      error={error}
      FormComponent={FacultyForm}
      CardComponent={FacultyCard}
    />
  )
}