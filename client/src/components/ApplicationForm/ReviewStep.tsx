import { useEffect, useState } from 'react';

interface ReviewStepProps {
  onSubmit: () => void;
  onBack: () => void;
  personalInfo: any;
  educationInfo: any;
  programInfo: any;
  documents: {
    waec: boolean;
    birthCertificate: boolean;
  };
}

export default function ReviewStep({ 
  onSubmit, 
  onBack, 
  personalInfo, 
  educationInfo, 
  programInfo, 
  documents 
}: ReviewStepProps) {
  const [isReviewed, setIsReviewed] = useState(false);

  const handleSubmit = () => {
    if (isReviewed) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Application</h2>
      <p className="text-gray-600">Please review your information carefully before submitting</p>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p>{personalInfo.firstName} {personalInfo.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p>{personalInfo.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p>{personalInfo.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{personalInfo.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Educational Background</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Qualification</p>
            <p>{educationInfo.qualification}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">WAEC/NECO Number</p>
            <p>{educationInfo.waecNumber}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Program Selection</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p>{programInfo.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program</p>
            <p>{programInfo.program}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Study Mode</p>
            <p>{programInfo.studyMode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Alternative Program</p>
            <p>{programInfo.alternativeProgram}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Documents</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <span className={documents.waec ? 'text-green-600' : 'text-red-600'}>●</span>
            {' '}WAEC Certificate
          </p>
          <p className="text-sm">
            <span className={documents.birthCertificate ? 'text-green-600' : 'text-red-600'}>●</span>
            {' '}Birth Certificate
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-6">
        <input
          type="checkbox"
          id="review-checkbox"
          checked={isReviewed}
          onChange={(e) => setIsReviewed(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="review-checkbox" className="text-sm text-gray-700">
          I have reviewed all information and confirm it is correct
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isReviewed}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isReviewed 
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}