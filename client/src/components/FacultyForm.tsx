'use client'

import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { Faculty, FacultyCreationDto } from '@/types/faculty'
import { CustomArrayForm, CustomForm } from './CustomForm'
import { FieldsConfig, FieldType } from '@/types/fields_config'

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
  const { facultyData, handleSubmitFaculty, handleChangeFaculty,error,  addFaculty,
    removeFaculty, } = useApplicationRequirements()

  const data = facultyToEdit ? facultyToEdit : facultyData
  const onChangeFn = facultyToEdit ? handleChangeUpdate : handleChangeFaculty
  const onSaveFn = facultyToEdit ? handleSave : handleSubmitFaculty

  const fieldsConfig:FieldsConfig<FacultyCreationDto> = {
    name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    code: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    description: { type: 'textarea' as FieldType, onChangeHandler: onChangeFn },
    nameOfDean: { type: 'text' as FieldType, onChangeHandler: onChangeFn }
  }
  console.log('faculty data', facultyData)
  const onCancel = ()=>{}
  if (facultyToEdit)
    return <CustomForm data={facultyToEdit} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={''} onCancel={onCancel} submiting={false} error={error} />
  return (
    <CustomArrayForm
      arrayData={facultyData}
      fieldsConfig={fieldsConfig}
      onSubmit={onSaveFn}
      addOrRemovelabel={'Faculty'}
      onCancel={onCancel} submiting={false}
      addFn={addFaculty}
      removeFn={removeFaculty} apiError={''}    />
  )
}
export default FacultyForm
    