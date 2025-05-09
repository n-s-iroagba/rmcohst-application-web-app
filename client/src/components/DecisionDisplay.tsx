import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface Decision {
  status: 'Accepted' | 'Rejected' | 'Pending';
  details: string;
  acceptanceFeeAmount?: number;
  nextSteps?: string[];
}

interface DecisionDisplayProps {
  applicationId: string;
}

export default function DecisionDisplay({ applicationId }: DecisionDisplayProps) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/decision/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );
        setDecision(response.data);
      } catch (err) {
        setError('Failed to fetch decision');
        console.error('Decision fetch error:', err);
      }
    };

    fetchDecision();
  }, [applicationId, user?.token]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!decision) {
    return <div>Loading decision...</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm" data-testid="decision-display">
      <h2 className="text-2xl font-bold mb-4">Application Decision</h2>
      
      <div className={`p-4 rounded-lg mb-6 ${
        decision.status === 'Accepted' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        <p className="text-xl font-semibold" data-testid="decision-status">
          {decision.status}
        </p>
        <p className="mt-2">{decision.details}</p>
      </div>

      {decision.status === 'Accepted' && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ul className="list-disc list-inside space-y-2">
            {decision.nextSteps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold">Acceptance Fee:</p>
            <p className="text-xl">₦{decision.acceptanceFeeAmount?.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}