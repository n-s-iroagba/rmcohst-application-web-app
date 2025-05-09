
'use client';

import AcceptanceFeePayment from '@/components/AcceptanceFeePayment';
import { useSearchParams } from 'next/navigation';

export default function AcceptanceFeePage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';
  const ACCEPTANCE_FEE_AMOUNT = 50000; // ₦50,000

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Acceptance Fee Payment</h1>
      <AcceptanceFeePayment 
        applicationId={applicationId}
        amount={ACCEPTANCE_FEE_AMOUNT}
      />
    </div>
  );
}
