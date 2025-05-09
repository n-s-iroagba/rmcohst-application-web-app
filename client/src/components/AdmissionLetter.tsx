import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface AdmissionLetterProps {
  applicationId: string;
}

interface LetterData {
  studentId: string;
  fullName: string;
  program: string;
  letterUrl: string;
  academicYear: string;
  generatedDate: string;
  registrationDeadline: string;
  requirements: string[];
}

export default function AdmissionLetter({ applicationId }: AdmissionLetterProps) {
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
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

  const handleDownload = async () => {
    if (!letterData?.letterUrl) return;

    setDownloading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admission/${applicationId}/letter/download`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `admission_letter_${letterData?.studentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download admission letter');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!letterData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading admission letter...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Admission Letter</h2>
        <p className="text-gray-600">Student ID: {letterData.studentId}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Program Details</h3>
          <p>{letterData.program}</p>
          <p>Academic Year: {letterData.academicYear}</p>
          {letterData.registrationDeadline && (
            <p>Registration Deadline: {new Date(letterData.registrationDeadline).toLocaleDateString()}</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Requirements</h3>
          <ul className="list-disc list-inside">
            {letterData.requirements.map((req, index) => (
              <li key={index} className="text-gray-700">{req}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            data-testid="download-button"
          >
            {downloading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Downloading...
              </>
            ) : (
              'Download PDF'
            )}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Generated: {new Date(letterData.generatedDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}