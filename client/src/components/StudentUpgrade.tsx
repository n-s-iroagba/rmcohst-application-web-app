
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface StudentProfile {
  studentId: string;
  enrollmentDate: string;
  department: string;
  level: string;
  status: string;
}

interface StudentUpgradeProps {
  applicationId: string;
}

export default function StudentUpgrade({ applicationId }: StudentUpgradeProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/student/upgrade/${applicationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      setProfile(response.data);
      router.push('/student/dashboard');
    } catch (err) {
      setError('Failed to upgrade to student profile');
      console.error('Profile upgrade error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm" data-testid="student-upgrade">
      {!profile ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Complete Your Enrollment</h2>
          <p className="mb-6">Click below to activate your student profile and begin your academic journey.</p>
          
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            data-testid="upgrade-button"
          >
            {loading ? 'Processing...' : 'Activate Student Profile'}
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Remington College!</h2>
          <div className="space-y-4">
            <p><span className="font-semibold">Student ID:</span> {profile.studentId}</p>
            <p><span className="font-semibold">Enrollment Date:</span> {new Date(profile.enrollmentDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Department:</span> {profile.department}</p>
            <p><span className="font-semibold">Level:</span> {profile.level}</p>
            <p><span className="font-semibold">Status:</span> {profile.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
