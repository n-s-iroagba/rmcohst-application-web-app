import React, { useState } from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'

import { FieldType } from '@/types/fields_config'

import { CustomForm } from './CustomForm'
import { handleChange } from '@/helpers/handleChange'
import { Grade } from '@/types/program_ssc_requirement'

interface GradeFormProps {
  existingEntity?: Grade
  onCancel: () => void
}

const GradeForm: React.FC<GradeFormProps> = ({ existingEntity, onCancel }) => {
  const { gradeData, handleSubmitGrade, handleChangeGrade,error } = useApplicationRequirements()
 const [state, setState] = useState<any> (existingEntity)
 const handleChangeTextUpdate = (event: React.ChangeEvent<HTMLInputElement>) =>{
   handleChange<Grade>(setState,event) 
 }
  const data = existingEntity ? state : gradeData
  const onChangeFn = existingEntity ? handleChangeTextUpdate : handleChangeGrade
  const onSaveFn = existingEntity ? handleSubmitGrade : handleSubmitGrade
console.log(existingEntity)
  const fieldsConfig = {
    id: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
    name: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
    applicationStartDate: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
    applicationEndDate: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
    isCurrent: { type: 'checkbox' as FieldType, onChangeHandler: onChangeFn }
  }
  const onCance= ()=>{
    window.location.reload()
  }
  return <CustomForm error={error} data={data} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} formLabel={'Sesssion Form'} onCancel={onCancel} submiting={false} />
}

export default GradeForm

    