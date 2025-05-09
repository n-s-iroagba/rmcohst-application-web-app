
'use client';

import StudentUpgrade from '@/components/StudentUpgrade';
import { useSearchParams } from 'next/navigation';

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id') || '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Profile Activation</h1>
      <StudentUpgrade applicationId={applicationId} />
    </div>
  );
}
