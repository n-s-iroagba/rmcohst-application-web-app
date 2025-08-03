
'use client'

import React from 'react'
import PaystackPop from '@paystack/inline-js'
import { usePost } from '@/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

interface PaymentButtonProps {
  email: string
  amount: number
  programId:number
  applicantUserId:number
}

export default function PaymentButton({ email, amount,programId,applicantUserId }: PaymentButtonProps) {
  const router = useRouter()
  const { handlePost, posting } = usePost<
    PaymentButtonProps,
    { status: boolean; message: string; data: { access_code: string,reference:string } }
  >(API_ROUTES.PAYMENT.INITIALIZE_GATEWAY, { email, amount,programId,applicantUserId });
  let r:any;

  const initiateTransaction = async (e: any) => {
    e.preventDefault()
    
    try {
      const response = await handlePost(e)
      if (response?.data?.access_code) {
        const popup = new PaystackPop()
        popup.resumeTransaction(response.data.access_code)
        console.log('PAYSSSSSSSSSTACK',response)
        router.push(`/applicant/payments/status/?reference=${response.data.reference}`)
      }
    } catch (error) {
      console.error('Transaction initiation failed:', error)
    }
  }

  return (
    <button onClick={initiateTransaction} disabled={posting}>
      {posting ? 'Processing...' : 'Apply'}
    </button>
  )
}