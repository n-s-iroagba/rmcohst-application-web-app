import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useFetchItem } from '@/hooks/useFetch';
import { updateBiodata } from '@/services/biodata.service';
import type { EditBiodataAttributes } from '@/types/biodata';

interface EditBiodataFormProps {
  applicationId: number;
  onSuccess?: (updated: EditBiodataAttributes) => void;
}

export default function EditBiodataForm({ applicationId, onSuccess }: EditBiodataFormProps) {
  const { data, loading: fetchLoading, error: fetchError } = useFetchItem<EditBiodataAttributes>(
    () => `/biodata/${applicationId}`
  );

  const [formData, setFormData] = useState<EditBiodataAttributes>({
    id: applicationId,
    applicationId,
    firstName: '',
    middleName: null,
    surname: '',
    gender: '',
    dateOfBirth: undefined,
    maritalStatus: '',
    homeAddress: '',
    nationality: '',
    stateOfOrigin: '',
    lga: '',
    homeTown: '',
    phoneNumber: '',
    emailAddress: '',
    passportPhotograph: undefined,
    nextOfKinFullName: '',
    nextOfKinPhoneNumber: '',
    nextOfKinAddress: '',
    relationshipWithNextOfKin: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        passportPhotograph: undefined,
      });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let updated: EditBiodataAttributes;
      if (file) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== undefined && val !== null && key !== 'passportPhotograph') {
            fd.append(key, val.toString());
          }
        });
        fd.append('passportPhotograph', file);
        updated = await updateBiodata(formData.id, fd, true);
      } else {
        const partial = { ...formData } as Partial<EditBiodataAttributes>;
        delete partial.passportPhotograph;
        updated = await updateBiodata(formData.id, partial);
      }
      onSuccess?.(updated);
    } catch (err) {
      console.error(err);
      setError('Failed to update biodata.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <p className="p-4">Loading biodata...</p>;
  if (fetchError) return <p className="p-4 text-red-500">Error loading biodata.</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Middle Name</label>
        <input
          name="middleName"
          value={formData.middleName || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Surname</label>
        <input
          name="surname"
          value={formData.surname || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Gender</label>
        <select
          name="gender"
          value={formData.gender || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().substr(0,10) : ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Marital Status</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        >
          <option value="">Select Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700">Home Address</label>
        <textarea
          name="homeAddress"
          value={formData.homeAddress || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Nationality</label>
        <input
          name="nationality"
          value={formData.nationality || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">State of Origin</label>
        <input
          name="stateOfOrigin"
          value={formData.stateOfOrigin || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">LGA</label>
        <input
          name="lga"
          value={formData.lga || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Home Town</label>
        <input
          name="homeTown"
          value={formData.homeTown || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Phone Number</label>
        <input
          name="phoneNumber"
          value={formData.phoneNumber || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Email Address</label>
        <input
          name="emailAddress"
          type="email"
          value={formData.emailAddress || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Passport Photograph</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Full Name</label>
        <input
          name="nextOfKinFullName"
          value={formData.nextOfKinFullName || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Phone Number</label>
        <input
          name="nextOfKinPhoneNumber"
          value={formData.nextOfKinPhoneNumber || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Next of Kin Address</label>
        <textarea
          name="nextOfKinAddress"
          value={formData.nextOfKinAddress || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-gray-700">Relationship with Next of Kin</label>
        <input
          name="relationshipWithNextOfKin"
          value={formData.relationshipWithNextOfKin || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
