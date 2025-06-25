// app/(dashboard)/programs/page.tsx
'use client'

import { CrudPageWrapper } from '@/components/CrudPageWrapper'
import { ProgramCard } from '@/components/ProgramCard'
import ProgramForm from '@/components/ProgramForm'
import { useGetList } from '@/hooks/useGet'
import { Program } from '@/types/program'

export default function ProgramCrudPage() {
  const { data: programs, loading, error } = useGetList<Program>('programs')

  return (
    <CrudPageWrapper
      title="Programs"
      entityKey="program"
      data={programs || []}
      loading={loading}
      error={error || 'An error occurred fetching programs'}
      FormComponent={ProgramForm}
      CardComponent={ProgramCard}
    />
  )
}
