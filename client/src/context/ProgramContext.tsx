'use client';

import { API_ROUTES } from '@/config/routes';
import { useGet } from '@/hooks/useApiQuery';
import { Program, ProgramLevel } from '@/types/program';
import React, { createContext, useContext, useEffect, useState } from 'react';


interface Department {
  id: number;
  name: string;
  facultyName: string;
}


interface ProgramContextType {
  programs: Program[]|undefined;
  filteredPrograms: Program[];
  selectedLevel: ProgramLevel | null;
  setSelectedLevel: (level: ProgramLevel | null) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const ProgramProvider = ({ children }: { children: React.ReactNode }) => {
  const {resourceData:programs,loading,error} = useGet<Program[]>(API_ROUTES.PROGRAM.LIST);
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevel | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  useEffect(() => {
    if (selectedLevel&&programs) {
      setFilteredPrograms(programs.filter(p => p.level === selectedLevel));
    } else {
      setFilteredPrograms([]);
    }
  }, [selectedLevel, programs]);

  return (
    <ProgramContext.Provider
      value={{
        programs,
       
        selectedLevel,
        setSelectedLevel,
        filteredPrograms,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgramContext = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('useProgramContext must be used within a ProgramProvider');
  }
  return context;
};
