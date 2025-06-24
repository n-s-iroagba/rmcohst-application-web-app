'use client'

import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Faculty, FacultyCreationDto } from '@/types/faculty'
import { CustomArrayForm, CustomForm } from './CustomForm'
import { FieldType } from '@/types/fields_config'

interface FacultyFormProps {
  facultyToEdit?: Faculty
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const FacultyForm: React.FC<FacultyFormProps> = ({
  facultyToEdit,
  handleChangeUpdate,
  handleSave
}) => {
  const { facultyData, handleSubmitFaculty, handleChangeFaculty } = useApplicationRequirements()

  const data = facultyToEdit ? facultyToEdit : facultyData
  const onChangeFn = facultyToEdit ? handleChangeUpdate : handleChangeFaculty
  const onSaveFn = facultyToEdit ? handleSave : handleSubmitFaculty

  const fieldsConfig = {
    name: {
      type: 'text' as FieldType,
      onChangeHandler: onChangeFn
    }
  }

  if (facultyToEdit)
    return <CustomForm data={facultyToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
  return (
    <CustomArrayForm
      arrayData={facultyData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'Faculty'}
    />
  )
}
export default FacultyForm
