'use client'

import React from 'react'
import { Biodata } from '@/types/biodata'
import { useApplication } from '@/hooks/useApplication'

import { FieldType } from '@/types/fields_config'
import { CustomForm } from './CustomForm'

const excludeKeys: (keyof Biodata)[] = ['id', 'applicationId', 'passportPhotograph']

// These fields will use <textarea>
const textareaKeys: (keyof Biodata)[] = ['homeAddress', 'nextOfKinAddress']

const EditBiodataForm = () => {
  const { biodata, biodataErrors, handleChangeBiodata, handleSubmitBiodata } = useApplication()

  if (!biodata) return null
  const biodataFieldsConfig = {
    id: { type: 'number' as FieldType, onChangeHandler: handleChangeBiodata },
    applicationId: { type: 'number' as FieldType, onChangeHandler: handleChangeBiodata },
    lastName: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    middleName: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    surname: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    gender: { type: 'select' as FieldType, onChangeHandler: handleChangeBiodata },
    dateOfBirth: { type: 'date' as FieldType, onChangeHandler: handleChangeBiodata },
    maritalStatus: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    homeAddress: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    nationality: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    stateOfOrigin: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    lga: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    homeTown: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    phoneNumber: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    emailAddress: { type: 'email' as FieldType, onChangeHandler: handleChangeBiodata },
    passportPhotograph: { type: 'file' as FieldType, onChangeHandler: handleChangeBiodata },
    nextOfKinFullName: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    nextOfKinPhoneNumber: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    nextOfKinAddress: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata },
    relationshipWithNextOfKin: { type: 'text' as FieldType, onChangeHandler: handleChangeBiodata }
  }

  return (
  <CustomForm data={biodata} fieldsConfig={biodataFieldsConfig} onSubmit={()=>{}} formLabel={''} onCancel={function (): void {
          throw new Error('Function not implemented.')
      } } submiting={false} error={''}/>
  )
}

export default EditBiodataForm
      