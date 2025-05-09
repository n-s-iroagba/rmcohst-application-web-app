import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface AdmissionLetterData {
  letterUrl: string;
  generatedDate: string;
  validUntil: string;
  studentId: string;
}

interface AdmissionLetterProps {
  applicationId: string;
}

export default function AdmissionLetter({ applicationId }: AdmissionLetterProps) {
  const [letterData, setLetterData] = useState<AdmissionLetterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admission/${applicationId}/letter`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`
            }
          }
        );
        setLetterData(response.data);
      } catch (err) {
        setError('Failed to fetch admission letter');
        console.error('Admission letter fetch error:', err);
      }
    };

    fetchLetter();
  }, [applicationId, user?.token]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!letterData) {
    return <div>Loading admission letter...</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-white" data-testid="admission-letter">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-bold">Admission Letter</h2>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Letter
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <p className="text-gray-600">Student ID</p>
          <p className="text-lg font-medium">{letterData.studentId}</p>
        </div>

        <div>
          <p className="text-gray-600">Program</p>
          <p className="text-lg font-medium">{letterData.program}</p>
        </div>

        <div>
          <p className="text-gray-600">Academic Year</p>
          <p className="text-lg font-medium">{letterData.academicYear}</p>
        </div>

        <div>
          <p className="text-gray-600">Start Date</p>
          <p className="text-lg font-medium">{new Date(letterData.startDate).toLocaleDateString()}</p>
        </div>

        <div>
          <p className="text-gray-600 mb-2">Required Documents</p>
          <ul className="list-disc pl-5 space-y-1">
            {letterData.requirements.map((req, index) => (
              <li key={index} className="text-gray-800">{req}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-500">
            This letter was generated on {new Date(letterData.generatedDate).toLocaleDateString()} 
            and is valid until {new Date(letterData.validUntil).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>

      <div className="mb-6">
        <p className="text-gray-600">Generated Date:</p>
        <p>{new Date(letterData.generatedDate).toLocaleDateString()}</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">Valid Until:</p>
        <p>{new Date(letterData.validUntil).toLocaleDateString()}</p>
      </div>

      <a
        href={letterData.letterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
        data-testid="download-letter"
      >
        Download Admission Letter
      </a>
    </div>
  );
}