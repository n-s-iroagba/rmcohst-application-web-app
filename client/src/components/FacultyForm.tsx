'use client'

import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Faculty, FacultyCreationDto } from '@/types/faculty'
import { CustomForm } from './CustomForm'

interface FacultyFormProps {
  isEdit?: boolean
  facultyToEdit?: Faculty
  onCancel?: () => void
   handleChangeUpdate:(e:any)=>void
  handleSave:(e:any)=> void
}

const FacultyForm: React.FC<FacultyFormProps> = ({ isEdit = false, facultyToEdit, onCancel handleChangeUpdate,
  handleSave}) => {
  const {
    facultyData,
    handleChangeFaculty,
    addFaculty,
    removeFaculty
  } = useApplicationRequirements()

  const data = isEdit && facultyToEdit ? facultyToEdit : facultyData

  const fieldsConfig = {
    name: { type: 'text', label: 'Faculty Name' },
    description: { type: 'textarea', label: 'Faculty Description' }
  }

  const handlers = {
    name: handleChangeFaculty,
    description: handleChangeFaculty
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && facultyToEdit) {
      // update logic here
      console.log('Updating faculty:', facultyToEdit)
    } else {
      addFaculty()
    }
  }

  return (
    <CustomForm
      data={data}
      fieldsConfig={fieldsConfig}
      handlers={handlers}
      onSubmit={handleSubmit}
      cancelLabel="Cancel"
      onCancel={onCancel}
    />
  )
}

export default FacultyForm
