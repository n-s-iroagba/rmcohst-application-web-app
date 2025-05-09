import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
        const response = await axios.post(`/api/student/upgrade/${applicationId}`, {
          paymentVerified: true
        });

        setStudentId(response.data.studentId);
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 3000);
      } catch (err) {
        setError('Failed to upgrade to student status. Please contact support.');
        console.error('Upgrade error:', err);
      } finally {
        setLoading(false);
      }
    };

    upgradeToStudent();
  }, [applicationId, router]);

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg">Setting up your student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        Welcome to Remington College!
      </h2>
      <p className="mb-4">
        Your student profile has been created successfully.
        <br />
        Student ID: <strong>{studentId}</strong>
      </p>
      <p className="text-sm text-green-600">
        Redirecting to your student dashboard...
      </p>
    </div>
  );
}