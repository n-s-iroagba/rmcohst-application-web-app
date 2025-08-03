'use client'

import React, { useEffect } from 'react'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'
import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { usePut } from '@/hooks/useApiQuery'



import { ProgramSpecificQualificationFormdata } from '@/types/applicant_program_specific_qualification'

interface Props {
  application?: Application
}

const ProgramSpecificQualificationForm: React.FC<Props> = ({ application }) => {
  const { navigateToHome } = useRoutes()



  const {
    putResource: programSpecificQualifications,
    changeHandlers,
    handlePut,
    updating,
    apiError
  } = usePut<ProgramSpecificQualificationFormdata>(
    application?.programSpecificQualifications?.id
      ? API_ROUTES.SSC_QUALIFICATION.UPDATE(application.programSpecificQualifications.id)
      : null,
    application?.programSpecificQualifications as ProgramSpecificQualificationFormdata
  )

  const { setChangeHandlers, setFieldConfigInput } = useFieldConfigContext<ProgramSpecificQualificationFormdata>()


  useEffect(() => {



    setFieldConfigInput({
      qualificationType: 'text',
      grade: 'text',
      certificate: 'file'

    })
    setChangeHandlers(changeHandlers)

  }, [ setFieldConfigInput])

  useEffect(() => {
    testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, 'signup-form')
  }, [])

  return (
    programSpecificQualifications && (
      <CustomForm
        data={programSpecificQualifications}
        submitHandler={handlePut}
        formLabel="Fill in Program Specific Qualification"
        onCancel={navigateToHome}
        submiting={updating}
        error={apiError}
      />
    )
  )
}

export default ProgramSpecificQualificationForm
