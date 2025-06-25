'use client'

import React from 'react'
import { applicantProgramSpecificRequirements } from '@/types/applicantProgramSpecificRequirements'
import { useApplication } from '@/hooks/useApplication'
import { DynamicFormTextFields } from '@/helpers/formFields'
import { CustomForm } from './CustomForm'

const excludeKeys: (keyof applicantProgramSpecificRequirements)[] = [


const ApplicantProgramSpecificRequirementsForm = () => {

  const { applicantProgramSpecificRequirements } = useApplication()

  if (!applicantProgramSpecificRequirements) return null
const appProgramSpecQualFieldsConfig = {
  id: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  applicationId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  qualificationType: { type: 'text' as FieldType, onChangeHandler: onChangeFn },
  gradeId: { type: 'number' as FieldType, onChangeHandler: onChangeFn },
  certificate: { type: 'file' as FieldType, onChangeHandler: onChangeFn },
  createdAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
  updatedAt: { type: 'date' as FieldType, onChangeHandler: onChangeFn },
}

  return (
    <CustomForm
      data={applicantProgramSpecificRequirements}
      fieldsConfig={appProgramSpecQualFieldsConfig }
      handlers={undefined}
      onSubmit={function (e: React.FormEvent): void {
        throw new Error('Function not implemented.')
      }}
    />
  )
}

export default ApplicantProgramSpecificRequirementsForm
