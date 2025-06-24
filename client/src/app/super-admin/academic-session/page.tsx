import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import SessionForm from '@/components/SessionForm'
import SessionCard from '@/components/SessionCard'

export default function SessionCrudPage() {
  const { sessions, loading, error } = useApplicationRequirements()

  return (
    <CrudPageWrapper
      title="sessions"
      entityKey="session"
      data={sessions || []}
      loading={loading}
      error={error}
      FormComponent={SessionForm}
      CardComponent={SessionCard}
    />
  )
}
