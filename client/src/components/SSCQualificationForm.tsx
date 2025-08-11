'use client'

import React, { useEffect } from 'react'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'
import { Application } from '@/types/application'
import { API_ROUTES } from '@/config/routes'
import { useGet, usePut } from '@/hooks/useApiQuery'
import { Biodata } from '@/types/biodata'
import { SSCQualificationFormData } from '@/types/applicant_ssc_qualification'
import { SSCSubject } from '@/types/ssc_subject'
import { Grade } from '@/types/program_ssc_requirement'

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

    setFieldsConfig({
      numberOfSittings: {
        type: 'text',
        onChangeHandler: changeHandlers['text']
      },
      certificateTypes: {
        type: 'checkbox'
        // fieldGroup: {
        //   groupKey: 'certificateTypes',
        //   fields: []
        //   a
        // }
      },
      certificates: {
        type: 'file'
        // fieldGroup: {
        //   groupKey: 'certificates',
        //   fields: subjects.map(subject => ({
        //     name: subject.id.toString(),
        //     label: subject.name,
        //     options: []
        //   }))
        // }
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

  useEffect(() => {
    testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, 'signup-form')
  }, [])

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
