'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { SessionCard } from '@/components/SessionCard'
import SessionForm from '@/components/SessionForm'
import { apiRoutes } from '@/constants/apiRoutes'
import { useGetList } from '@/hooks/useGet'
import { Session } from '@/types/academic_session'

export default function SessionCrudPage() {
  const { data: sessions, loading, error } = useGetList<Session>(apiRoutes.academicSession.all)
  console.log('useGetlistEROR',error)

  return (
    <CrudPageWrapper
      title="sessions"
      entityKey="session"
      data={sessions}
      loading={loading}
      error={error}
      FormComponent={SessionForm}
      CardComponent={SessionCard}
    />
  )
}
