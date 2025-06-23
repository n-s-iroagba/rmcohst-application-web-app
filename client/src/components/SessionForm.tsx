import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'
import { session, sessionCreationDto } from '@/types/session'


interface SessionFormProps {
  sessionData: sessionCreationDto[] | session
  isEdit: boolean
  handleChangeUpdate:(e:any)=>void
  handleSave:(e:any)=> void
}



const SessionForm: React.FC<SessionFormProps> = ({ isEdit = false, sessionToEdit, handleChangeUpdate, handleSave }) => {
  const {
    sessionData,
    handleSubmitSession,
        handleChangeSessionData,
    addFaculty,
    removeFaculty
  } = useApplicationRequirements()

  const data = isEdit && sessionToEdit ? sessionToEdit : sessionData
  const onChangeFn = isEdit ? handleChangeUpdate : handleChangeSessionData
  const onSaveFn = isEdit ? handleSave : handleSubmitSession,

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
    if (isEdit && sessionToEdit) {
      // update logic here
      console.log('Updating faculty:', sessionToEdit)
    } else {
      addFaculty()
    }
  }

  return (
    <CustomForm
      isEdit={isEdit??false}
      data={data}
      fieldsConfig={fieldsConfig}
      handlers={handlers}
      onSubmit={handleSubmit}
      cancelLabel="Cancel"
      onCancel={onCancel}
    />
  )
}

export default SessionForm
