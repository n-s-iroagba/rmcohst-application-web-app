import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { SessionCard } from '@/components/SessionCard'
import SessionForm from '@/components/SessionForm'
import { useGetList } from '@/hooks/useGet'
import { Session } from '@/types/academic_session'

export default function SessionCrudPage() {
  const { data: sessions, loading, error } = useGetList<Session>('')

  const handleSubmitUpdate = () => {}
  const onDelete = () => {}

  return (
    <CrudPageWrapper
      title="sessions"
      entityKey="session"
      data={sessions}
      loading={loading}
      error={error || 'An error occured fetching sessions'}
      FormComponent={SessionForm}
      CardComponent={SessionCard}
    />
  )
}
