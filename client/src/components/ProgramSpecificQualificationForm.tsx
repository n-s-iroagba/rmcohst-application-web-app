'use client'

import { CustomForm } from '@/components/CustomForm'
import { API_ROUTES } from '@/constants/apiRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { usePut } from '@/hooks/useApiQuery'
import { Application } from '@/types/application'
import React, { useEffect } from 'react'

import { ProgramSpecificQualificationFormdata } from '@/types/applicant_program_specific_qualification'
import { FieldsConfig } from '@/types/fields_config'
export const formConfig: FieldsConfig<ProgramSpecificQualificationFormdata> = {
  qualificationType: {
    type: 'select'
  },
  grade: {
    type: 'select'
  },
  completed: {
    type: 'checkbox'
  },
  certificate: {
    type: 'file'
  }
}
interface Props {
  application?: Application
  handleForward: () => void
  handleBackward: () => void
}

const ProgramSpecificQualificationForm: React.FC<Props> = ({ application, handleBackward, handleForward }) => {


  const {
    putResource: programSpecificQualifications,
    changeHandlers,

    updating,
    apiError
  } = usePut<ProgramSpecificQualificationFormdata>(
    application?.programSpecificQualifications?.id
      ? API_ROUTES.SSC_QUALIFICATION.UPDATE(application.programSpecificQualifications.id)
      : null,
    application?.programSpecificQualifications as ProgramSpecificQualificationFormdata
  )

  const { createFieldsConfig } =
    useFieldConfigContext<ProgramSpecificQualificationFormdata>()

  useEffect(() => {
    createFieldsConfig(formConfig, changeHandlers)
  }, [createFieldsConfig, changeHandlers])
  const handleSave = () => {
    handleForward()
  }
  testIdContext.setContext(formConfig)
  return (
    programSpecificQualifications && (
      <CustomForm
        data={programSpecificQualifications}
        submitHandler={handleSave}
        formLabel="Fill in Program Specific Qualification"
        onCancel={handleBackward}
        submiting={updating}
        error={apiError}
      />
    )
  )
}

export default ProgramSpecificQualificationForm
