'use client'

import React from 'react'
import { useSearchParams, useRouter, useParams } from 'next/navigation'
import { useGet } from '@/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'
import { Spinner } from '@/components/Spinner'
import ErrorAlert from '@/components/ErrorAlert'
import { PaystackVerificationResponse } from '@/types/payment'

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = useParams().reference as string
 // Guard if no reference is present

 

  const { resourceData, error, loading } = useGet<PaystackVerificationResponse>(
    API_ROUTES.PAYMENT.VERIFY(reference)
  )

  if (loading) return <Spinner />
  if (error) return <ErrorAlert message={error} />
  if (!resourceData) return <ErrorAlert message="Payment not found" />

  const payment = resourceData.data

  return (
    <div className="container py-5 max-w-md mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Payment Verification</h2>

      <button
        onClick={() => router.push('/applicant/dashboard')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
      >
        Back to Dashboard
      </button>

      <div className="shadow p-4 mb-3 bg-white rounded">
        <p>
          <strong>Status:</strong> {payment.status}
        </p>
        <p>
          <strong>Amount:</strong> ₦{payment.amount / 100}
        </p>
        <p>
          <strong>Transaction Date:</strong> {new Date(payment.paid_at).toLocaleString()}
        </p>
        <p>
          <strong>Reference:</strong> {payment.reference}
        </p>
        <p>
          <strong>Gateway Response:</strong> {payment.gateway_response}
        </p>
        <p>
          <strong>Payment Channel:</strong> {payment.channel}
        </p>
      </div>
    </div>
  )
}
