import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import ProgramForm from '@/components/ProgramForm'
import ProgramCard from '@/components/ProgramCard'

export default function ProgramCrudPage() {
  const { programs, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="Programs"
      entityKey="Program"
      data={programs || []}
      loading={loading}
      error={error}
      FormComponent={ProgramForm}
      CardComponent={ProgramCard}
    />
  )
}
