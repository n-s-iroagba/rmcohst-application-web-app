'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/Spinner'
import { useGet } from '@/hooks/useApiQuery'
import { FullProgram,} from '@/types/program'
import { API_ROUTES } from '@/config/routes'
import { Grade } from '@/types/program_ssc_requirement'
import { useAuthContext } from '@/context/AuthContext'
import { PaymentType } from '../../../../components/PaystackButton'



export interface PaystackInitTransactionResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

// Dynamic import for the payment button component
const PaymentButton = dynamic(() => import('../../../../components/PaystackButton'), {
  ssr: false,
  loading: () => <Spinner/>
})

export default function ProgramDetailsPage() {
  const router = useRouter()
  const { user } = useAuthContext()
  const programId = useParams().id as string

  const {
    resourceData: program,
    error,
    loading
  } = useGet<FullProgram>(API_ROUTES.PROGRAM.GET_BY_ID(programId))

  if (loading) return <Spinner />
  if (error) return <p className="text-danger">Failed to load program details.</p>
  if (!program) return null

  const ssc = program.sscRequirements
  const getGradeText = (grade: Grade) => `${grade} or better`

  return (
    <div className="container py-4">
      <button onClick={() => router.back()} className="mb-3">
        &larr; Back
      </button>

      <div className="shadow-sm mb-4">
        <div>
          <h2>Program: {program.name}</h2>
          <p className="text-muted">
            Department: {program.department.name} &middot; Faculty: {program.department.faculty?.name}
          </p>
          <p>
            <strong>Level:</strong> {program.level}
          </p>
          <p>
            <strong>Duration:</strong> {program.duration} {program.durationType.toLowerCase()}
          </p>
          <p>
            <strong>Application Fee:</strong> ₦{program.applicationFeeInNaira}
          </p>
          <p>
            <strong>Acceptance Fee:</strong> ₦{program.acceptanceFeeInNaira}
          </p>
          {program.description && (
            <p>
              <strong>Description:</strong> {program.description}
            </p>
          )}
        </div>
      </div>

      <div className="shadow-sm mb-4">
        <div>
          <strong>SSC Requirements</strong>
        </div>
        <div>
          <p><strong>Max Sittings:</strong> {ssc.maximumNumberOfSittings}</p>
          <p><strong>Qualification Types:</strong> {ssc.qualificationTypes.join(', ')}</p>
          <ul>
            <li>Subject 1 (ID: {ssc.firstSubjectId}) - Grade: {getGradeText(ssc.firstSubjectGrade)}</li>
            <li>Subject 2 (ID: {ssc.secondSubjectId}) - Grade: {getGradeText(ssc.secondSubjectGrade)}</li>
            <li>
              Subject 3 (ID: {ssc.thirdSubjectId}) - Grade: {getGradeText(ssc.thirdSubjectGrade)}
              {ssc.alternateThirdSubjectId && <> or ID: {ssc.alternateThirdSubjectId}</>}
            </li>
            <li>
              Subject 4 (ID: {ssc.fourthSubjectId}) - Grade: {getGradeText(ssc.fourthSubjectGrade)}
              {ssc.alternateFourthSubjectId && <> or ID: {ssc.alternateFourthSubjectId}</>}
            </li>
            <li>
              Subject 5 (ID: {ssc.fifthSubjectId}) - Grade: {getGradeText(ssc.fifthSubjectGrade)}
              {ssc.alternateFifthSubjectId && <> or ID: {ssc.alternateFifthSubjectId}</>}
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <PaymentButton
          paymentType={PaymentType.APPLICATION_FEE}
          programId={program.id}
          applicantUserId={Number(user.id)}
        />
      </div>
    </div>
  )
}
