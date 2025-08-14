'use client'

import React, { useEffect } from 'react'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'

import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { FileChangeEvent, useGet, usePut } from '@/hooks/useApiQuery'
import { SSCQualificationFormData } from '@/types/applicant_ssc_qualification'
import { SSCSubject } from '@/types/ssc_subject'
import { Grade } from '@/types/program_ssc_requirement'
import { Certificate } from 'crypto'
import { ChangeHandler, FieldType } from '@/types/fields_config'
export enum QualificationType {
  WAEC = 'WAEC',
  NECO = 'NECO',
  NABTEB = 'NABTEB',
  GCE = 'GCE',
}

interface Props {
  application?: Application
}

const SSCQualificationForm: React.FC<Props> = ({ application }) => {
  const { navigateToHome } = useRoutes()

  const { resourceData: subjects } = useGet<SSCSubject[]>(API_ROUTES.SUBJECT.LIST)

  const {
    putResource: sscQualification,
    changeHandlers,
    handlePut,
    updating,
    apiError
  } = usePut<SSCQualificationFormData>(
    application?.sscQualification?.id
      ? API_ROUTES.SSC_QUALIFICATION.UPDATE(application.sscQualification.id)
      : null,
    application?.sscQualification as SSCQualificationFormData
  )

  const { setFieldsConfig } = useFieldConfigContext<SSCQualificationFormData>()
  const grades = Object.values(Grade)
  const certificates = Object.values(QualificationType)

  useEffect(() => {
    if (!subjects) return

    const subjectOptions = subjects.map((subject) => ({
      id: subject.id,
      label: subject.name
    }))
    const gradeOptions = grades.map((grade) => ({
      id: grade,
      label: grade
    }))
     const certificationOpitons = certificates.map((certificate) => ({
      id: certificate,
      label: certificate
    }))
     const certificateFileFields =  Array.from({ length: sscQualification.numberOfSittings||1 }, (_, index) => {
    const sittingNumber = index + 1
    return {
      name: `certificateFile${sittingNumber}`,
      label: `Certificate File - Sitting ${sittingNumber}`,
    }})
    

    setFieldsConfig({
      numberOfSittings: {
        type: 'text',
        onChangeHandler: changeHandlers['text']
      },
      certificateTypes: {
        type: 'checkbox',
        options:certificationOpitons
      },
      certificates: {
        type: 'fileArray',
        fieldGroup: {
          // groupKey: 'certificates',
          fields: certificateFileFields,
          onChangeHandler:changeHandlers['fileArray'] as (e:FileChangeEvent)=>void
        }
      },
      firstSubjectId: {
        type: 'select',
        options: subjectOptions,
        onChangeHandler: changeHandlers['select']
      },
      firstSubjectGrade: {
        type: 'select',
        options: gradeOptions,
        onChangeHandler: changeHandlers['select']
      },
      secondSubjectId: {
        type: 'select',
        options: subjectOptions,
        onChangeHandler: changeHandlers['select']
      },
      secondSubjectGrade: {
        type: 'select',
        options: gradeOptions,
        onChangeHandler: changeHandlers['select']
      },
      thirdSubjectId: {
        type: 'select',
        options: subjectOptions,
        onChangeHandler: changeHandlers['select']
      },
      thirdSubjectGrade: {
        type: 'select',
        options: gradeOptions,
        onChangeHandler: changeHandlers['select']
      },
      fourthSubjectId: {
        type: 'select',
        options: subjectOptions,
        onChangeHandler: changeHandlers['select']
      },
      fourthSubjectGrade: {
        type: 'select',
        options: gradeOptions,
        onChangeHandler: changeHandlers['select']
      },
      fifthSubjectId: {
        type: 'select',
        options: subjectOptions,
        onChangeHandler: changeHandlers['select']
      },
      fifthSubjectGrade: {
        type: 'select',
        options: gradeOptions,
        onChangeHandler: changeHandlers['select']
      }
    })
  }, [subjects, changeHandlers, setFieldsConfig])


  return (
    sscQualification && (
      <CustomForm
        data={sscQualification}
        submitHandler={handlePut}
        formLabel="Fill in O'level Qualification"
        onCancel={navigateToHome}
        submiting={updating}
        error={apiError}
      />
    )
  )
}

export default SSCQualificationForm
