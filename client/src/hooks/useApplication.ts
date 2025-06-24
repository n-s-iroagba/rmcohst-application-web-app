/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import { Biodata } from '@/types/biodata'
import { formatCamelCase } from '@/utils/formatCamelCase'
import { post } from '@/utils/apiClient'
import { apiRoutes } from '@/constants/apiRoutes'
import { useGetSingle } from './useGet'
import { Application } from '@/types/application'
import { ApplicationProgramSpecificQualification } from '@/types/applicant_program_specific_qualification'

export const useApplication = () => {
  const {
    data: application,
    error: applicationError,
    loading
  } = useGetSingle<Application>(apiRoutes.application.myCurrentApplication)
  const [biodata, setBiodata] = useState<Biodata | null>(null)
  const [applicantProgramSpecificRequirements, setApplicantProgramSpecificRequirements] = useState<
    ApplicationProgramSpecificQualification[]
  >([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [biodataErrors, setBiodataErrors] = useState<Partial<Record<keyof Biodata, string>>>({})
  useEffect(() => {
    if (application) {
      setBiodata(application.biodata)
    }
    if (applicationError) {
      setError(applicationError)
    }
  }, [application, applicationError])
  const requiredFields: (keyof Biodata)[] = [
    'firstName',
    'surname',
    'gender',
    'dateOfBirth',
    'maritalStatus',
    'homeAddress',
    'nationality',
    'stateOfOrigin',
    'lga',
    'homeTown',
    'phoneNumber',
    'emailAddress',
    'passportPhotograph',
    'nextOfKinFullName',
    'nextOfKinPhoneNumber',
    'nextOfKinAddress',
    'relationshipWithNextOfKin'
  ]

  const handleChangeBiodata = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setBiodata((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'dateOfBirth' ? new Date(value) : value
          }
        : null
    )
  }

  const validateBiodata = (): boolean => {
    if (!biodata) return false

    const errors: Partial<Record<keyof Biodata, string>> = {}

    requiredFields.forEach((field) => {
      const value = biodata[field]
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (field === 'emailAddress' && !/^\S+@\S+\.\S+$/.test(value as string))
      ) {
        errors[field] = `${formatCamelCase(field)} is required or invalid`
      }
    })

    setBiodataErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveBiodata = async (formData: Biodata) => {
    const data = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'passportPhotograph' && value instanceof File) {
        data.append(key, value)
      } else {
        data.append(key, String(value))
      }
    })
    if (!biodata) return
    try {
      await post(apiRoutes.biodata.update(biodata.id), data)
    } catch (error) {
      console.error('Reset password error', error)
      setError(error instanceof Error ? error.message : 'Password reset failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitBiodata = async (e: React.FormEvent) => {
    e.preventDefault()
    if (biodata && validateBiodata()) {
      await saveBiodata(biodata)
      alert('Biodata saved successfully')
    }
  }

  return {
    error,
    submitting,
    biodata,
    loading,
    biodataErrors,
    handleChangeBiodata,
    handleSubmitBiodata,
    saveBiodata,
    applicantProgramSpecificRequirements
  }
}
