'use client'

import { CustomForm } from '@/components/CustomForm'
import { API_ROUTES } from '@/constants/apiRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { FileChangeEvent, useGet, usePut } from '@/hooks/useApiQuery'
import { generateComponentFormTestIds } from '@/test/utils/testIdGenerator'
import { ApplicantSSCQualification, SSCQualificationFormData } from '@/types/applicant_ssc_qualification'
import { Application } from '@/types/application'
import { FieldsConfig } from '@/types/fields_config'
import { Grade } from '@/types/program_ssc_requirement'
import { SSCSubject } from '@/types/ssc_subject'
import React, { useEffect } from 'react'
export enum QualificationType {
  WAEC = 'WAEC',
  NECO = 'NECO',
  NABTEB = 'NABTEB',
  GCE = 'GCE',
}

interface Props {
  application?: Application
  handleForward: () => void
  handleBackward: () => void
}

const SSCQualificationForm: React.FC<Props> = ({ application, handleForward, handleBackward }) => {


  const { resourceData: subjects } = useGet<SSCSubject[]>(API_ROUTES.SUBJECT.LIST)

  const {
    putResource: sscQualification,
    changeHandlers,
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

  const config: FieldsConfig<Partial<ApplicantSSCQualification>> = {
    numberOfSittings: {
      type: 'text',

    },
    certificateTypes: {
      type: 'checkbox',

    },
    certificates: {
      type: 'fileArray',

    },
    firstSubjectId: {
      type: 'select',

    },
    firstSubjectGrade: {
      type: 'select',

    },
    secondSubjectId: {
      type: 'select',

    },
    secondSubjectGrade: {
      type: 'select',

    },
    thirdSubjectId: {
      type: 'select',

    },
    thirdSubjectGrade: {
      type: 'select',

    },
    fourthSubjectId: {
      type: 'select',

    },
    fourthSubjectGrade: {
      type: 'select',

    },
    fifthSubjectId: {
      type: 'select',

    },
    fifthSubjectGrade: {
      type: 'select',

    }
  }
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
    const certificateFileFields = Array.from({ length: sscQualification.numberOfSittings || 1 }, (_, index) => {
      const sittingNumber = index + 1
      return {
        name: `certificateFile${sittingNumber}`,
        label: `Certificate File - Sitting ${sittingNumber}`,
      }
    })



    setFieldsConfig({
      numberOfSittings: {
        type: 'text',
        onChangeHandler: changeHandlers['text']
      },
      certificateTypes: {
        type: 'checkbox',
        options: certificationOpitons
      },
      certificates: {
        type: 'fileArray',
        fieldGroup: {
          // groupKey: 'certificates',
          fields: certificateFileFields,
          onChangeHandler: changeHandlers['fileArray'] as (e: FileChangeEvent) => void
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

  }, [subjects, changeHandlers, certificates, grades, sscQualification, setFieldsConfig])

  testIdContext.setContext(generateComponentFormTestIds(config, 'ssc-form'))
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formdata = new FormData()

    // Get form data from the form event
    const form = e.target as HTMLFormElement
    const formDataObj = new FormData(form)

    // Append all form fields to formdata
    for (const [key, value] of formDataObj.entries()) {
      formdata.append(key, value)
    }

    // Specifically append certificate files if they exist
    const numberOfSittings = sscQualification?.numberOfSittings || 1
    for (let i = 1; i <= numberOfSittings; i++) {
      const fileInput = form.querySelector(`input[name="certificateFile${i}"]`) as HTMLInputElement
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        formdata.append(`certificateFile${i}`, fileInput.files[0])
      }
    }
    handleForward()
  }
  return (
    sscQualification && (
      <CustomForm
        data={sscQualification}
        submitHandler={handleSubmit}
        formLabel="Fill in O'level Qualification"
        onCancel={handleBackward}
        submiting={updating}
        error={apiError}
      />
    )
  )
}

export default SSCQualificationForm