'use client';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/hooks/useApiQuery';
import { Program, ProgramLevel } from '@/types/program';
import React, { useEffect, useState } from 'react';



export const usePrograms = () => {
  const { resourceData: programs, loading, error } = useGet<Program[]>(API_ROUTES.PROGRAM.LIST);
  console.log('progs', programs)
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevel | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  useEffect(() => {
    if (selectedLevel && programs) {
      setFilteredPrograms(programs.filter(p => p.level === selectedLevel));
    } else {
      setFilteredPrograms([]);
    }
  }, [selectedLevel, programs]);

  return {
    programs,

    selectedLevel,
    setSelectedLevel,
    filteredPrograms,
  }
}