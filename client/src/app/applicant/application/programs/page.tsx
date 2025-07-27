'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FilterDropdown } from '@/components/FilterDropdown';
import { useProgramContext } from '@/context/ProgramContext';


export default function SelectProgramPage() {
  const {
    programs,
    filteredPrograms,
    selectedLevel,
    setSelectedLevel,
   
  } = useProgramContext();

  const router = useRouter();



  const handleProgramClick = (programId: number) => {
    router.push(`/programs/${programId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Choose a Program to Apply</h1>

      <FilterDropdown
        data={programs||[]}
        filterKey="level"
        filterValue={selectedLevel}
        onFilterChange={setSelectedLevel}
        displayKey="level"
        placeholder="Select Program Level"
        label="Program Level"
      />

      <div className="grid gap-4">
        {filteredPrograms.map(program => (
          <div
            key={program.id}
            className="p-4 cursor-pointer hover:shadow-md transition border"
            onClick={() => handleProgramClick(program.id)}
          >
            <h3 className="font-semibold text-lg">{program.name}</h3>
            <p className="text-sm text-gray-500">
              {program.department.name} • {program.department.faculty?.name}
            </p>
          </div>
        ))}
        {filteredPrograms.length === 0 && selectedLevel && (
          <div className="text-center text-gray-500">
            No programs found for this level.
          </div>
        )}
      </div>
    </div>
  );
}
