import React from 'react'
import { useApplicationRequirements } from '@/hooks/useApplicationRequirements'

import { FieldType } from '@/types/fields_config'
import { Session } from '@/types/academic_session'
import { CustomForm } from './CustomForm'

interface SessionFormProps {
  session?: Session
  handleChangeUpdate: (e: any) => void
  handleSave: () => void
}

const SessionForm: React.FC<SessionFormProps> = ({ session, handleChangeUpdate, handleSave }) => {
  const { sessionData, handleSubmitSession, handleChangeSessionData } = useApplicationRequirements()

  const data = session ? session : sessionData
  const onChangeFn = session ? handleChangeUpdate : handleChangeSessionData
  const onSaveFn = session ? handleSave : handleSubmitSession

  const fieldsConfig = {
    name: {
      type: 'text' as FieldType,
      onChangeHandler: onChangeFn
    }
  }

  return <CustomForm data={data} fieldsConfig={fieldsConfig} onSubmit={onSaveFn} />
}

export default SessionForm
