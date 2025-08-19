'use client'

import { useGet } from '@/hooks/useApiQuery'
import { Program, ProgramLevel } from '@/types/program'
import { useEffect, useState } from 'react'
import { API_ROUTES } from '../constants/apiRoutes'

export const usePrograms = () => {
  const { resourceData: programs, loading, error } = useGet<Program[]>(API_ROUTES.PROGRAM.LIST)
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevel | null>(null)
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])

  useEffect(() => {
    if (selectedLevel && programs) {
      setFilteredPrograms(programs.filter((p) => p.level === selectedLevel))
    } else {
      setFilteredPrograms([])
    }
  }, [selectedLevel, programs])

  return {
    programs,
    loading,
    error,
    selectedLevel,
    setSelectedLevel,
    filteredPrograms
  }
}