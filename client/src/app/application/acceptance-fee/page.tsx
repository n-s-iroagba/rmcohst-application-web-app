
'use client';

import { useSearchParams } from 'next/navigation';
import AcceptanceFeePayment from '@/components/AcceptanceFeePayment';

export default function AcceptanceFeePage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';
  const amount = 50000; // ₦50,000 acceptance fee

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Acceptance Fee Payment</h1>
      <AcceptanceFeePayment applicationId={applicationId} amount={amount} />
    </div>
  );
}
