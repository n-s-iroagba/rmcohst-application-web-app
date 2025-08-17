'use client'

import React, { useEffect } from 'react'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { usePut } from '@/hooks/useApiQuery'
import { Biodata } from '@/types/biodata'
import { testIdContext } from '@/test/utils/testIdContext'
import { biodataFormTestIds } from '@/utils/formTestIds'
import api from '@/lib/apiUtils'
import { biodataFormConfig } from '@/utils/applicationFormconfig'

const BiodataForm: React.FC<{ application: Application,handleForward:()=>void }> = ({ application,handleForward }) => {
  const { navigateToHome, } = useRoutes()
  const {
    putResource: biodata,
    changeHandlers,
    updating,
    apiError
  } = usePut(
    application ? API_ROUTES.BIODATA.UPDATE(application?.biodata.id) : null,
    application?.biodata
  )
  const {createFieldsConfig } = useFieldConfigContext<Partial<Biodata>>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
   createFieldsConfig(biodataFormConfig,changeHandlers)
  }, [createFieldsConfig,changeHandlers])

testIdContext.setContext(biodataFormTestIds)
 const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
  e.preventDefault()
  const formdata = new FormData()
  
  // Get form data from the form event
  const form = e.target as HTMLFormElement
  const formDataObj = new FormData(form)
  
  // Append all form fields to formdata
  for (const [key, value] of formDataObj.entries()) {
    formdata.append(key, value)
    
    //    if (key==='passportPhotograph') {
    //   formdata.append(key, value.files[0])
    // }
  }
  console.log(formdata.values)
  
  await api.patch( API_ROUTES.BIODATA.UPDATE(application?.biodata.id),formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
  handleForward()
 }



  return (
    <CustomForm
      data={biodata || {}}
      submitHandler={handleSubmit}
      formLabel={'Fill in your biodata'}
      onCancel={navigateToHome}
      submiting={updating}
      error={apiError}
    />
  )
}

export default BiodataForm
