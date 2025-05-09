
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface Timeline {
  status: string;
  date: string;
}

interface StatusTrackerProps {
  applicationId: string;
}

export default function StatusTracker({ applicationId }: StatusTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/status/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );
        
        setCurrentStatus(response.data.currentStatus);
        setTimeline(response.data.timeline);
      } catch (err) {
        setError('Failed to fetch status');
        console.error('Status fetch error:', err);
      }
    };

    const interval = setInterval(fetchStatus, 30000); // Poll every 30 seconds
    fetchStatus(); // Initial fetch

    return () => clearInterval(interval);
  }, [applicationId, user?.token]);

  return (
    <div className="p-4 border rounded-lg shadow-sm" data-testid="status-tracker">
      <h2 className="text-xl font-semibold mb-4">Application Status</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">Current Status:</p>
        <p className="text-lg font-medium" data-testid="current-status">
          {currentStatus}
        </p>
      </div>

      <div data-testid="status-timeline">
        <h3 className="font-medium mb-3">Timeline</h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 mr-3" />
              <div>
                <p className="font-medium">{item.status}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
