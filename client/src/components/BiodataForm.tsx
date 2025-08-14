'use client'

import React, { useEffect } from 'react'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { usePut } from '@/hooks/useApiQuery'
import { Biodata } from '@/types/biodata'

const BiodataForm: React.FC<{ application?: Application }> = ({ application }) => {
  const { navigateToHome, } = useRoutes()
  const {
    putResource: biodata,
    changeHandlers,
    handlePut,
    updating,
    apiError
  } = usePut(
    application ? API_ROUTES.BIODATA.UPDATE(application?.biodata.id) : null,
    application?.biodata
  )
  const { setFieldConfigInput, setChangeHandlers } = useFieldConfigContext<Partial<Biodata>>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
    setFieldConfigInput({
    
  firstName: 'text',
  surname: 'text',
  otherNames: 'text', 
  email: 'text', 
  dateOfBirth: 'date',
   gender: 'select',
  maritalStatus: 'select',
  nationality: 'text',
  stateOfOrigin: 'text',
  localGovernmentArea: 'text',
  contactAddress: 'text', 
  passportPhotograph: 'file',
  nextOfKinName: 'text', 
  nextOfKinPhoneNumber: 'text',
  nextOfKinAddress: 'text',
  nextOfKinRelationship: 'text', 
  homeTown: 'text',
    })
    setChangeHandlers(changeHandlers)
  }, [setFieldConfigInput])

//   const TEST_ID_BASE = 'biodata-form'
//  biodata && testIdContext.setContext(biodata, TEST_ID_BASE)

  return (
    <CustomForm
      data={biodata || {}}
      submitHandler={handlePut}
      formLabel={'Fill in your biodata'}
      onCancel={navigateToHome}
      submiting={updating}
      error={apiError}
    />
  )
}

export default BiodataForm
