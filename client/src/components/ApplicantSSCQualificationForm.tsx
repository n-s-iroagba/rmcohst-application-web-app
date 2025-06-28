import React, { useState, useEffect } from 'react'
import { CustomForm } from './CustomForm'
import { GraduationCap } from 'lucide-react'
import { SSCQualificationFormData } from '@/types/applicant_ssc_qualification'
import { SSCSubject } from '@/types/ssc_subject'
import { Grade } from '@/types/program_ssc_requirement'
import { FieldsConfig } from '@/types/fields_config'

// Types based on your service and models


interface ApplicantSSCQualificationFormProps {
  initialData?: Partial<SSCQualificationFormData>
  subjects?: SSCSubject[]
  grades?: Grade[]
  onSubmit: (data: SSCQualificationFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  errors?: Partial<Record<keyof SSCQualificationFormData, string>>
}

const CERTIFICATE_TYPE_OPTIONS = [
  'WAEC',
  'NECO',
  'GCE O-Level',
  'NABTEB',
  'Other'
]

const NUMBER_OF_SITTINGS_OPTIONS = [
  { id: 1, label: 'One Sitting' },
  { id: 2, label: 'Two Sittings' },
  { id: 3, label: 'Three Sittings' }
]

export const ApplicantSSCQualificationForm: React.FC<ApplicantSSCQualificationFormProps> = ({
  initialData = {},
  subjects = [],
  grades = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  errors = {}
}) => {
  const [formData, setFormData] = useState<SSCQualificationFormData>({
    certificateTypes: initialData.certificateTypes || [],
    certificates: initialData.certificates || [],
    numberOfSittings: initialData.numberOfSittings || 1,
    minimumGrade: initialData.minimumGrade || '',
    subjectsAndGrades: initialData.subjectsAndGrades || []
  })

  // Add a new subject-grade pair
  const addSubjectGrade = () => {
    setFormData(prev => ({
      ...prev,
      subjectsAndGrades: [
        ...prev.subjectsAndGrades,
        { subjectId: 0, gradeId: 0 }
      ]
    }))
  }

  // Remove a subject-grade pair
  const removeSubjectGrade = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjectsAndGrades: prev.subjectsAndGrades.filter((_, i) => i !== index)
    }))
  }

  // Handle subject-grade changes
  const handleSubjectGradeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
    field: 'subjectId' | 'gradeId'
  ) => {
    const value = parseInt(e.target.value)
    setFormData(prev => ({
      ...prev,
      subjectsAndGrades: prev.subjectsAndGrades.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Handle certificate type changes (multiple selection)
  const handleCertificateTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      certificateTypes: prev.certificateTypes.includes(value)
        ? prev.certificateTypes.filter(type => type !== value)
        : [...prev.certificateTypes, value]
    }))
  }

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      certificates: files
    }))
  }

  // Handle other field changes
  const handleFieldChange = (field: keyof SSCQualificationFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

  // Submit handler
  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  // Field configuration for CustomForm
  const fieldsConfig: FieldsConfig<SSCQualificationFormData>= {
    certificateTypes: {
      type: 'select',
      options: CERTIFICATE_TYPE_OPTIONS,
      onChangeHandler: handleCertificateTypeChange
    },
    certificates: {
      type: 'file',
      onChangeHandler: handleFileChange
    },
    numberOfSittings: {
      type: 'select',
      options: NUMBER_OF_SITTINGS_OPTIONS,
      onChangeHandler: handleFieldChange('numberOfSittings')
    },
    minimumGrade: {
      type: 'text',
      onChangeHandler: handleFieldChange('minimumGrade')
    },
    subjectsAndGrades: {
      type: 'double-select',
      fieldGroup: {
        groupKey: 'subjectsAndGrades',
        fields: [
          {
            name: 'subjectId',
            label: 'Subject',
            options: subjects.map(subject => ({
              id: subject.id,
              label: subject.name
            }))
          },
          {
            name: 'gradeId',
            label: 'Grade',
            options: grades.map(grade => ({
              id: grade.id,
              label: grade.grade
            }))
          }
        ],
        addHandler: addSubjectGrade,
        removeHandler: removeSubjectGrade,
        onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>, index: number, field: string) => {
          handleSubjectGradeChange(e, index, field as 'subjectId' | 'gradeId')
        }
      }
    }
  }

  // Initialize with at least one subject-grade entry
  useEffect(() => {
    if (formData.subjectsAndGrades.length === 0) {
      addSubjectGrade()
    }
  }, [])

  return (
    <CustomForm
      data={formData}
      errors={errors}
      fieldsConfig={fieldsConfig}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submiting={isSubmitting}
      submitButtonLabel="Save SSC Qualification"
      cancelButtonLabel="Cancel"
      formLabel='Enter your own SSC Qualification'
      icon={<GraduationCap size={48} />}
    />
  )
}

export default ApplicantSSCQualificationForm