
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadProps {
  type: 'waec' | 'birthCertificate';
  onUploadComplete: (filename: string) => void;
}

export default function DocumentUpload({ type, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      setUploading(true);
      setError(null);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/upload/${type}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onUploadComplete(response.data.filename);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label 
        htmlFor={`${type}-upload`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {type === 'waec' ? 'WAEC Certificate' : 'Birth Certificate'}
      </label>
      <input
        id={`${type}-upload`}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        data-testid={`${type}-upload`}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {error && (
        <p className="mt-2 text-sm text-red-600" data-testid="upload-error">
          {error}
        </p>
      )}
      {uploading && (
        <p className="mt-2 text-sm text-gray-600">
          Uploading...
        </p>
      )}
    </div>
  );
}
