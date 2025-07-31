'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useGet } from '@/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { Spinner } from '@/components/Spinner';
import ErrorAlert from '@/components/ErrorAlert';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
 

  const { resourceData, error, loading } = useGet<any>(
    reference ? API_ROUTES.PAYMENT.VERIFY(reference) : ''
  );

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error}/>
  if (!resourceData) return null;

  const payment = resourceData.data;

  return (
    <div className="container py-5">
      <h2 className="mb-4">Payment Verification</h2>

      <div className="shadow p-4 mb-3 bg-white rounded">
        <p><strong>Status:</strong> {payment.status}</p>
        <p><strong>Amount:</strong> ₦{payment.amount / 100}</p>
        <p><strong>Transaction Date:</strong> {new Date(payment.transaction_date).toLocaleString()}</p>
        <p><strong>Reference:</strong> {payment.reference}</p>
        <p><strong>Gateway Response:</strong> {payment.gateway_response}</p>
        <p><strong>Payment Channel:</strong> {payment.channel}</p>
        <p><strong>Customer Email:</strong> {payment.customer.email}</p>
        <p><strong>Bank:</strong> {payment.authorization?.bank}</p>
        <p><strong>Card Type:</strong> {payment.authorization?.card_type}</p>
        <p><strong>Card Brand:</strong> {payment.authorization?.brand}</p>
        <p><strong>Card Last4:</strong> **** **** **** {payment.authorization?.last4}</p>
      </div>
    </div>
  );
}
  // const { user } = useAuthContext()
  // const {navigateToSelectProgram}= useRoutes()



  // const {
  //   resourceData: payment,
  //   loading: isPaymentLoading,
  //   error: paymentError,
  // } = useGet<Payment>(user?API_ROUTES.PAYMENT.GET_BY_APPLICANT_USER_ID(user.id):'')