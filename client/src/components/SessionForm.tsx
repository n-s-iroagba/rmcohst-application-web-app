import React, { useState } from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'

import { FieldType } from '@/types/fields_config'
import { Session } from '@/types/academic_session'
import { CustomForm } from './CustomForm'
import { handleChange } from '@/helpers/handleChange'

interface SessionFormProps {
  existingEntity?: Session
  onCancel: () => void
}

const SessionForm: React.FC<SessionFormProps> = ({ existingEntity, onCancel }) => {
  const { sessionData, handleSubmitSession, handleChangeSessionData,error } = useApplicationRequirements()
 const [state, setState] = useState<any> (existingEntity)
 const handleChangeTextUpdate = (event: React.ChangeEvent<HTMLInputElement>) =>{
   handleChange<Session>(setState,event) 
 }
  const data = existingEntity ? state : sessionData
  const onChangeFn = existingEntity ? handleChangeTextUpdate : handleChangeSessionData
  const onSaveFn = existingEntity ? handleSubmitSession : handleSubmitSession
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

export default SessionForm

