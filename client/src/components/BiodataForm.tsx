'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SignUpRequestDto } from '@/types/auth.types'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'
import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { usePut } from '@/hooks/useApiQuery'
import { Biodata } from '@/types/biodata'



const BiodataForm: React.FC<{application?:Application}> = ({application}) => {


  const { navigateToHome, navigateToLogin } = useRoutes()
  const{putResource:biodata,changeHandlers,handlePut,updating,apiError} = usePut(application?API_ROUTES.BIODATA.UPDATE(application?.biodata.id):null,application?.biodata)
  const {  setFieldConfigInput,setChangeHandlers } = useFieldConfigContext<Partial<Biodata>>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
    setFieldConfigInput({
         
  firstName: 'text',
  middleName: 'text',
  surname: 'text',
  gender: 'select',
  dateOfBirth: 'date',
  maritalStatus: 'select',
  homeAddress: 'textarea',
  nationality: 'select',
  stateOfOrigin: 'select',
  lga: 'select',
  homeTown: 'text',
  phoneNumber: 'text',
  emailAddress: 'email',
  passportPhotograph: 'file',
  nextOfKinFullName: 'text',
  nextOfKinPhoneNumber: 'text',
  nextOfKinAddress: 'textarea',
  relationshipWithNextOfKin: 'select',


    })
    setChangeHandlers(changeHandlers)
  }, [setFieldConfigInput])

const TEST_ID_BASE = 'signup-form';
testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, TEST_ID_BASE);


  return (
    <CustomForm 
      data={biodata||{}} 
      submitHandler={handlePut} 
      formLabel={'Fill in your biodata'} 
      onCancel={navigateToHome} 
      submiting={updating} 
      error={apiError} 
    
    />
   
  )
}

export default BiodataForm