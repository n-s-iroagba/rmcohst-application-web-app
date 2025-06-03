import { useEffect, useState } from 'react';
import { useFetchList } from '@/hooks/useFetch';

interface Program {
  id: number;
  department: string;
  certificationType: string;
  applicationFeeInNaira: number;
}

export default function ProgramFeeLookup() {
  const { data: programs, loading, error } = useFetchList<Program>(() => '/programs');
  const [types, setTypes] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [fee, setFee] = useState<number | null>(null);

  useEffect(() => {
    if (programs?.length) {
      setTypes([...new Set(programs.map(p => p.certificationType))]);
    }
  }, [programs]);

  useEffect(() => {
    setDepartments(
      selectedType && programs
        ? [...new Set(programs.filter(p => p.certificationType === selectedType)
            .map(p => p.department))]
        : []
    );
    setSelectedDept('');
    setFee(null);
  }, [selectedType, programs]);

  useEffect(() => {
    if (selectedType && selectedDept && programs) {
      const match = programs.find(
        p => p.certificationType === selectedType && p.department === selectedDept
      );
      setFee(match?.applicationFeeInNaira ?? null);
    }
  }, [selectedType, selectedDept, programs]);

      if(loading)  <p className="mb-4 text-gray-500">Loading programs...</p>
      if (error) <p className="mb-4 text-red-500">Error loading programs.</p>
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Program Fee Lookup</h1>


      <div className="mb-4">
        <label className="block text-gray-700">Certification Type</label>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          disabled={loading || !!error}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:opacity-50"
        >
          <option value="">-- Select Type --</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Department</label>
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          disabled={!selectedType || loading || !!error}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:opacity-50"
        >
          <option value="">-- Select Department --</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {fee !== null && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <p className="text-gray-800">Application Fee:</p>
          <p className="text-xl font-medium">₦{fee.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
