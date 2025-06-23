import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import ProgramSpecificRequirementForm from '@/components/ProgramSpecificRequirementForm'
import ProgramSpecificRequirementCard from '@/components/ProgramSpecificRequirementCard'

export default function ProgramSpecificRequirementCrudPage() {
  const { programSpecificRequirements, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="programSpecificRequirements"
      entityKey="specific program requirements"
      data={programSpecificRequirements || []}
      loading={loading}
      error={error}
      FormComponent={ProgramSpecificRequirementForm}
      CardComponent={ProgramSpecificRequirementCard}
    />
  )
}