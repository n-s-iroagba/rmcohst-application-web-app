'use client'

import { Spinner } from '@/components/Spinner'
import { API_ROUTES } from '@/constants/apiRoutes'
import { useAuthContext } from '@/context/AuthContext'
import { useGet } from '@/hooks/useApiQuery'
import { FullProgram, } from '@/types/program'
import { Grade } from '@/types/program_ssc_requirement'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { PaymentType } from '../../../../types/payment'




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
const PaymentButton = dynamic(() => import('../../../../components/PaymentButton'), {
  ssr: false,
  loading: () => <Spinner />
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
  console.log('program', program)
  if (loading) return <Spinner />
  if (error) return <p className="text-danger">Failed to load program details.</p>
  if (!program) return null

  const ssc = program.sscRequirements
  const getGradeText = (grade: Grade) => `${grade} or better`

  return (
    <div className="container py-4">
      <button onClick={() => router.back()} className="mb-3">
        &larr;
        Back
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
          {/* <p><strong>Qualification Types:</strong> {ssc.qualificationTypes.toString()}</p> */}
          <ul>
            <li>Subject 1 : {ssc.firstSubject} - Grade: {getGradeText(ssc.firstSubjectGrade)}</li>
            <li>Subject 2 : {ssc.secondSubject} - Grade: {getGradeText(ssc.secondSubjectGrade)}</li>
            <li>
              Subject 3 :  {ssc.thirdSubject} - Grade: {getGradeText(ssc.thirdSubjectGrade)}
              {ssc.alternateThirdSubject && <> or ID: {ssc.alternateThirdSubject}</>}
            </li>
            <li>
              Subject 4 :  {ssc.fourthSubject} - Grade: {getGradeText(ssc.fourthSubjectGrade)}
              {ssc.alternateFourthSubject && <> or ID: {ssc.alternateFourthSubject}</>}
            </li>
            <li>
              Subject 5 :  {ssc.fifthSubject} - Grade: {getGradeText(ssc.fifthSubjectGrade)}
              {ssc.alternateFifthSubject && <> or ID: {ssc.alternateFifthSubject}</>}
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
