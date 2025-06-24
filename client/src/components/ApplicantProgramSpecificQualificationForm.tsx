'use client'

import React from 'react'
import { applicantProgramSpecificRequirements } from '@/types/applicantProgramSpecificRequirements'
import { useApplication } from '@/hooks/useApplication'
import { DynamicFormTextFields } from '@/helpers/formFields'
import { CustomForm } from './CustomForm'

const excludeKeys: (keyof applicantProgramSpecificRequirements)[] = [
  'id',
  'applicationId',
  'passportPhotograph'
]

// These fields will use <textarea>
const textareaKeys: (keyof applicantProgramSpecificRequirements)[] = [
  'homeAddress',
  'nextOfKinAddress'
]

const EditapplicantProgramSpecificRequirementsForm = () => {
  const { applicantProgramSpecificRequirements } = useApplication()

  if (!applicantProgramSpecificRequirements) return null

  return (
    <CustomForm
      data={applicantProgramSpecificRequirements}
      fieldsConfig={undefined}
      handlers={undefined}
      onSubmit={function (e: React.FormEvent): void {
        throw new Error('Function not implemented.')
      }}
    />
  )
}

export default EditapplicantProgramSpecificRequirementsForm
