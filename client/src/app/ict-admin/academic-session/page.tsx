'use client'

import { API_ROUTES } from '@/config/routes'
import { useGet } from '@/hooks/useApiQuery'
import { Session } from '@/types/academic_session'

export default function SessionCrudPage() {
  const { resourceData: sessions, loading, error } = useGet<Session>(API_ROUTES.SESSION.LIST)
  console.log('useGetlistEROR', error)

  return <></>
}
