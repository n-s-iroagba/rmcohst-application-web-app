'use client'

import { FilterDropdown } from '@/components/FilterDropdown'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { GenericSearchBar } from '@/components/SearchBar'
import { usePrograms } from '@/hooks/useProgram'

import { Program } from '@/types/program'
import { ApplicationTestIds } from '../../../test/testIds/applicationTestIds'

export default function SelectProgramPage() {
  const { programs, filteredPrograms, selectedLevel, setSelectedLevel } = usePrograms()
  const [searchResults, setSearchResults] = useState<Program[]>(filteredPrograms)

  const router = useRouter()

  const handleProgramClick = (programId: number) => {
    router.push(`/applicant/programs/${programId}`)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Choose a Program to Apply</h1>

      <FilterDropdown
        optionsTestId={ApplicationTestIds.selectLevel}
        dropDownTestId={ApplicationTestIds.clickFilterDropDown}
        data={programs || []}
        filterKey="level"
        filterValue={selectedLevel}
        onFilterChange={setSelectedLevel}
        displayKey="level"
        placeholder="Select Program Level"
        label="Program Level"
      />
      <GenericSearchBar<Program>
        data={filteredPrograms || []}
        searchKeys={['name']}
        testId={ApplicationTestIds.searchProgram}
        onResults={setSearchResults}
        placeholder="Search Programs by name ..."
        className="mb-4"
      />

      <div className="grid gap-4">
        {searchResults.map((program, index) => (
          <div
            key={program.id}
            className="p-4 cursor-pointer hover:shadow-md transition border"
            onClick={() => handleProgramClick(program.id)}
            data-testId={ApplicationTestIds.selectProgram(index)}
          >
            <h3 className="font-semibold text-lg">{program.name}</h3>
          </div>
        ))}
        {filteredPrograms.length === 0 && selectedLevel && (
          <div className="text-center text-gray-500">No programs found for this level.</div>
        )}
      </div>
    </div>
  )
}
