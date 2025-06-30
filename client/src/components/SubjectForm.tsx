'use client'
import React, { useState } from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'

import { FieldType } from '@/types/fields_config'

import { CustomForm } from './CustomForm'
import { handleChange } from '@/helpers/handleChange'
import { SSCSubject } from '@/types/ssc_subject'

interface SubjectFormProps {
  existingEntity?: SSCSubject
  onCancel: () => void
}

const SubjectForm: React.FC<SubjectFormProps> = ({ existingEntity, onCancel }) => {
  const { subject, handleSubmitSubject, handleChangeSubject,error } = useApplicationRequirements()
 const [state, setState] = useState<any> (existingEntity)
 const handleChangeTextUpdate = (event: React.ChangeEvent<HTMLInputElement>) =>{
   handleChange<SSCSubject>(setState,event) 
 }
  const data = existingEntity ? state : subject
  const onChangeFn = existingEntity ? handleChangeTextUpdate : handleChangeSubject
  const onSaveFn = existingEntity ? handleSubmitSubject : handleSubmitSubject
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

export default SubjectForm

