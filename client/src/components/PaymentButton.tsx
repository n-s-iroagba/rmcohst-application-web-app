'use client'


import PaystackPop from '@paystack/inline-js'
import { useRouter } from 'next/navigation'
import React from 'react'
import { API_ROUTES } from '../constants/apiRoutes'
import { usePost } from '../hooks/useApiQuery'
import { ApplicationTestIds } from '../test/testIds/applicationTestIds'
import { PaymentType } from '../types/payment'

export type PaymentButtonProps = {
  paymentType: PaymentType

  applicantUserId: number
  programId: number
}

export interface InitializePaymentResponse {
  access_code: string
  reference: string
  authorizationUrl: string
}


export default function PaymentButton({

  paymentType,
  programId,
  applicantUserId
}: PaymentButtonProps) {
  const router = useRouter()
  const { handlePost, posting } = usePost<
    PaymentButtonProps,
    { status: boolean; message: string; access_code: string; reference: string }
  >(API_ROUTES.PAYMENT.INITIALIZE_GATEWAY, { paymentType, programId, applicantUserId })


  const initiateTransaction = async (e: React.MouseEvent<HTMLButtonElement>) => {


    try {
      const response = await handlePost(e)
      console.log('paystack response', response)
      if (response?.access_code) {
        const popup = new PaystackPop()
        popup.resumeTransaction(response.access_code)
        console.log('PAYSSSSSSSSSTACK', response)
        router.push(`/applicant/payments/details/?reference=${response.reference}`)
      }
    } catch (error) {
      console.error('Transaction initiation failed:', error)
    }
  }

  return (
    <button onClick={initiateTransaction}
      data-testId={ApplicationTestIds.initiatePayment}
      disabled={posting}>
      {posting ? 'Processing...' : 'Apply'}
    </button>
  )
}
