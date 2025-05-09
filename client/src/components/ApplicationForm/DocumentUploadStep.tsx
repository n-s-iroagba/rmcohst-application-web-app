
import { useState } from 'react';
import DocumentUpload from '@/components/DocumentUpload';

interface DocumentUploadStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentUploadStep({ onNext, onBack }: DocumentUploadStepProps) {
  const [uploadedDocs, setUploadedDocs] = useState({
    waec: false,
    birthCertificate: false
  });

  const handleUploadComplete = (type: 'waec' | 'birthCertificate') => {
    setUploadedDocs(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const isComplete = uploadedDocs.waec && uploadedDocs.birthCertificate;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Required Documents</h2>
      <p className="text-gray-600">Please upload the following documents in PDF format</p>
      
      <DocumentUpload 
        type="waec" 
        onUploadComplete={() => handleUploadComplete('waec')} 
      />
      
      <DocumentUpload 
        type="birthCertificate" 
        onUploadComplete={() => handleUploadComplete('birthCertificate')} 
      />

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isComplete 
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
