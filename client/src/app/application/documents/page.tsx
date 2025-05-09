
'use client';

import { useState } from 'react';
import DocumentUpload from '@/components/DocumentUpload';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
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

  const handleContinue = () => {
    if (uploadedDocs.waec && uploadedDocs.birthCertificate) {
      router.push('/application/review');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Required Documents</h1>
      
      <DocumentUpload 
        type="waec" 
        onUploadComplete={() => handleUploadComplete('waec')} 
      />
      
      <DocumentUpload 
        type="birthCertificate" 
        onUploadComplete={() => handleUploadComplete('birthCertificate')} 
      />

      {uploadedDocs.waec && uploadedDocs.birthCertificate && (
        <div className="mt-6" data-testid="upload-success">
          <p className="text-green-600 mb-4">All required documents uploaded successfully!</p>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Continue to Review
          </button>
        </div>
      )}
    </div>
  );
}
