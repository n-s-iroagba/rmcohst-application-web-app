'use client';

import AdmissionLetter from '@/components/AdmissionLetter';
import { useSearchParams } from 'next/navigation';

export default function AdmissionLetterPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admission Letter</h1>
      <AdmissionLetter applicationId={applicationId} />
    </div>
  );
}