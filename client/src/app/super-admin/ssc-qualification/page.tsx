import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import SSCQualificationForm from '@/components/SSCQualificationForm'
import SSCQualificationCard from '@/components/SSCQualificationCard'

export default function SSCQualificationCrudPage() {
  const { sscQualifications, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="SSCQualifications"
      entityKey="SSCQualification"
      data={sscQualifications || []}
      loading={loading}
      error={error}
      FormComponent={SSCQualificationForm}
      CardComponent={SSCQualificationCard}
    />
  )
}
