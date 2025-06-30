'use client'

import React, { useEffect, useState } from 'react'
import { CustomForm } from './CustomForm'
import { GraduationCap } from 'lucide-react'
import { FieldsConfig } from '@/types/fields_config'
import { ApplicationProgramSpecificQualification } from '@/types/applicant_program_specific_qualification'

interface Props {
  initialData?: Partial<ApplicationProgramSpecificQualification>
  onSubmit: (data: ApplicationProgramSpecificQualification) => Promise<void>
  onCancel: () => void
  errors?: Partial<Record<keyof ApplicationProgramSpecificQualification, string>>
}

const defaultData: ApplicationProgramSpecificQualification = {
  id: 0,
  applicationId: 0,
  qualificationType: '',
  grade: '',
  certificates: {} as File,
  createdAt: new Date(),
  updatedAt: new Date()
}

const ApplicantProgramSpecificQualificationForm: React.FC<Props> = ({
  initialData = {},
  onSubmit,
  onCancel,
  errors = {}
}) => {
  const [formData, setFormData] = useState<ApplicationProgramSpecificQualification>({
    ...defaultData,
    ...initialData
  })
  const [submiting, setSubmiting] = useState<boolean>(false)
  const [error,setError] = useState<string>('')

  // Convert input value based on type
  const handleFieldChange =
    (field: keyof ApplicationProgramSpecificQualification) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'file'
          ? (e.target as HTMLInputElement).files?.[0] || ({} as File)
          : e.target.type === 'number'
          ? parseInt(e.target.value)
          : e.target.value

      setFormData((prev) => ({
        ...prev,
        [field]: value
      }))
    }

  const fieldsConfig: FieldsConfig<ApplicationProgramSpecificQualification> = {
    id: {
      type: 'text',
      onChangeHandler: handleFieldChange('id')
    },
    applicationId: {
      type: 'text',
      onChangeHandler: handleFieldChange('applicationId')
    },
    qualificationType: {
      type: 'select',
      options: ['HND', 'OND'],
      onChangeHandler: handleFieldChange('qualificationType')
    },
    grade: {
      type: 'text',
      onChangeHandler: handleFieldChange('grade')
    },
    certificates: {
      type: 'file',
      onChangeHandler: handleFieldChange('certificates')
    },
    createdAt: {
      type: 'text',
      onChangeHandler: handleFieldChange('createdAt')
    },
    updatedAt: {
      type: 'text',
      onChangeHandler: handleFieldChange('updatedAt')
    }
  }

  const handleSubmit = async () => {
    setSubmiting
    await onSubmit(formData)
  }

  return (
    <CustomForm
      data={formData}
      errors={errors}
      fieldsConfig={fieldsConfig}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submiting={submiting}
      submitButtonLabel="Save Qualification"
      cancelButtonLabel="Cancel"
      formLabel='Enter your qualifications'
      icon={<GraduationCap size={48} />} error={error}    />
  )
}

export default ApplicantProgramSpecificQualificationForm
