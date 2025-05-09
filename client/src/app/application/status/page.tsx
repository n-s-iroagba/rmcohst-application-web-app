
'use client';

import StatusTracker from '@/components/StatusTracker';
import { useSearchParams } from 'next/navigation';

export default function StatusPage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Application Status</h1>
      <StatusTracker applicationId={applicationId} />
    </div>
  );
}
