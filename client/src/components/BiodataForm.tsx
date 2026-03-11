'use client'

import { CustomForm } from '@/components/CustomForm'
import { API_ROUTES } from '@/constants/apiRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { usePut } from '@/hooks/useApiQuery'
import { useRoutes } from '@/hooks/useRoutes'
import api from '@/lib/api'
import { biodataFormConfig } from '@/test/config/applicationFormconfig'
import { biodataFormTestIds } from '@/test/testIds/formTestIds'
import { Application } from '@/types/application'
import { Biodata } from '@/types/biodata'
import React, { useEffect, useState } from 'react'
import { createFieldsConfig } from '../helpers/createFieldConfig'

const BiodataForm: React.FC<{ application: Application, handleForward: () => void }> = ({ application, handleForward }) => {
  const { navigateToHome, } = useRoutes()
  const [error, setError] = useState('')
  const {
    putResource: biodata,
    changeHandlers,
    updating,

  } = usePut(
    application ? API_ROUTES.BIODATA.UPDATE(application?.biodata.id) : null,
    application?.biodata
  )
  const { setFieldsConfig } = useFieldConfigContext<Partial<Biodata>>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
    setFieldsConfig(createFieldsConfig(biodataFormConfig, changeHandlers, { gender: [{ label: 'Male', id: 'Male' }, { label: 'Female', id: 'Female' }] }))
  }, [])

  testIdContext.setContext(biodataFormTestIds)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formdata = new FormData()
    try {
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

      await api.patch(API_ROUTES.BIODATA.UPDATE(application?.biodata.id), formdata, { headers: { 'Content-Type': 'multipart/form-data' } })
      handleForward()

    } catch (error) {
      console.error(error)
      setError('An Error occured')

    }
  }

  return (
    <CustomForm
      data={biodata || {}}
      submitHandler={handleSubmit}
      formLabel={'Fill in your biodata'}
      onCancel={navigateToHome}
      submiting={updating}
      error={error}
    />
  )
}

export default BiodataForm
