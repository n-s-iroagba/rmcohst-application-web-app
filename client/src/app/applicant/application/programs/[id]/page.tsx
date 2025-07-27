'use client'

import React from 'react'
import { useParams, useRouter,  } from 'next/navigation'

import { Spinner } from '@/components/Spinner'
import { useGet, usePost } from '@/hooks/useApiQuery'
import { Program } from '@/types/program'
import { API_ROUTES } from '@/config/routes'
import { Grade } from '@/types/program_ssc_requirement'
import PaystackPop from '@paystack/inline-js'
import { useAuthContext } from '@/context/AuthContext'

interface ProgramDetailsResponse {
  program: Program
}
export interface PaystackInitTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
export interface PaystackInitTransactionRequest {
 email:string
 amount: number;
}

export default function ProgramDetailsPage() {
  const router = useRouter()
  const {user} = useAuthContext()
  const programId = useParams().id as string
  const {resourceData:program,error,loading} = useGet<Program>(API_ROUTES.PROGRAM.GET_BY_ID(programId))


if (!user?.email) {
  return <p className="text-danger">User not logged in or email missing.</p>;
}

const { handlePost, apiError, posting, postResponse } = usePost<
  PaystackInitTransactionRequest,
  PaystackInitTransactionResponse
>(API_ROUTES.PAYMENT.INITIALIZE_GATEWAY, {
  email: user.email,
  amount: program?.applicationFeeInNaira ?? 0,
});
 
 const popup = new PaystackPop()



  if (loading) return <Spinner />
  if (error) return <p className="text-danger">Failed to load program details.</p>
  if (!program) return null
  if (postResponse) return popup.resumeTransaction(postResponse.data.access_code)
   
  const ssc = program.sscRequirement

  const getGradeText = (grade: Grade) => `${grade} or better`

  return (
    <div className="container py-4">
      <button  onClick={() => router.back()} className="mb-3">
        &larr; Back
      </button>

      <div className="shadow-sm mb-4">
        <div>
          <h2>{program.name}</h2>
          <p className="text-muted">
            Department: {program.department.name} &middot; Faculty: {program.department.faculty?.name}
          </p>
          <p><strong>Level:</strong> {program.level}</p>
          <p><strong>Duration:</strong> {program.duration} {program.durationType.toLowerCase()}</p>
          <p><strong>Application Fee:</strong> ₦{program.applicationFeeInNaira}</p>
          <p><strong>Acceptance Fee:</strong> ₦{program.acceptanceFeeInNaira}</p>
          {program.description && (
            <p><strong>Description:</strong> {program.description}</p>
          )}
        </div>
      </div>

      <div className="shadow-sm mb-4">
        <div><strong>SSC Requirements</strong></div>
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
        <button  onClick={(e)=>handlePost(e)}>
          Apply
        </button>
      </div>
    </div>
  )
}
