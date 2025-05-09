
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadProps {
  type: 'waec' | 'birthCertificate';
  onUploadComplete: (filename: string) => void;
}

const ALLOWED_FILE_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_EXTENSIONS = ['.pdf'];

export default function DocumentUpload({ type, onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileValidation, setFileValidation] = useState({
    size: false,
    type: false,
    virus: false
  });
  const { user } = useAuth();

  const validateFile = (file: File): boolean => {
    setError(null);
    setFileValidation({ size: false, type: false, virus: false });

    // Check file type
    const fileExtension = file.name.toLowerCase().slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
    if (!ALLOWED_FILE_EXTENSIONS.includes(`.${fileExtension}`)) {
      setError('Only PDF files are allowed');
      return false;
    }
    setFileValidation(prev => ({ ...prev, type: true }));

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return false;
    }
    setFileValidation(prev => ({ ...prev, size: true }));

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;
    
    generatePreview(file);

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
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percentCompleted);
          }
        }
      );

      setFileValidation(prev => ({ ...prev, virus: true }));
      onUploadComplete(response.data.filename);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [versions, setVersions] = useState<Array<{id: string, timestamp: Date}>>([]);

  useEffect(() => {
    if (previewUrl) {
      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const generatePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <div className="mt-4">
      <label 
        htmlFor={`${type}-upload`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {type === 'waec' ? 'WAEC Certificate' : 'Birth Certificate'}
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <input
          id={`${type}-upload`}
          type="file"
          accept=".pdf"
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
        {uploading && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-32 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" data-testid="upload-error">
          {error}
        </p>
      )}
      <div className="mt-2 space-y-1">
        <div className={`text-sm ${fileValidation.type ? 'text-green-600' : 'text-gray-500'}`}>
          ✓ Valid file type
        </div>
        <div className={`text-sm ${fileValidation.size ? 'text-green-600' : 'text-gray-500'}`}>
          ✓ File size under 5MB
        </div>
        <div className={`text-sm ${fileValidation.virus ? 'text-green-600' : 'text-gray-500'}`}>
          ✓ File verified
        </div>
      </div>
    </div>
  );
}
