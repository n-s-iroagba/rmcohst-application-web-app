'use client';

import DecisionDisplay from '@/components/DecisionDisplay';
import { useSearchParams } from 'next/navigation';

export default function DecisionPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Application Decision</h1>
      <DecisionDisplay applicationId={applicationId} />
    </div>
  );
}