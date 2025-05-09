
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StudentUpgradeProps {
  applicationId: string;
}

export default function StudentUpgrade({ applicationId }: StudentUpgradeProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const upgradeToStudent = async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}/upgrade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Upgrade failed');
        }

        const data = await response.json();
        setStudentId(data.studentId);
        router.push('/application/admission');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upgrade failed');
      } finally {
        setLoading(false);
      }
    };

    upgradeToStudent();
  }, [applicationId, router]);

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Processing your enrollment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
      <div className="text-green-600 mb-4">
        <svg
          className="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Enrollment Successful!</h2>
      <p className="text-gray-600 mb-4">
        Your student ID is: <span className="font-mono">{studentId}</span>
      </p>
      <p className="text-sm text-gray-500">
        Redirecting to your admission letter...
      </p>
    </div>
  );
}
