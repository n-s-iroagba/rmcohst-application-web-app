
import { useState, useEffect } from 'react';
import { Program, ProgramFilters, ProgramLevel } from '../types/program';

const FACULTIES = ['Health Sciences', 'Medical Laboratory', 'Nursing', 'Pharmacy'];
const LEVELS: ProgramLevel[] = ['OND', 'HND', 'Certificate'];

export default function ProgramSearch() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filters, setFilters] = useState<ProgramFilters>({});
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.faculty) queryParams.append('faculty', filters.faculty);
        if (filters.department) queryParams.append('department', filters.department);
        if (filters.level) queryParams.append('level', filters.level);
        if (filters.searchTerm) queryParams.append('search', filters.searchTerm);

        const response = await fetch(`/api/programs/search?${queryParams}`);
        const data = await response.json();
        setPrograms(data);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, [filters]);

  useEffect(() => {
    if (filters.faculty) {
      // Fetch departments for selected faculty
      fetch(`/api/departments?faculty=${filters.faculty}`)
        .then(res => res.json())
        .then(data => setDepartments(data))
        .catch(console.error);
    } else {
      setDepartments([]);
    }
  }, [filters.faculty]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Faculty</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.faculty || ''}
            onChange={(e) => setFilters({ ...filters, faculty: e.target.value, department: '' })}
          >
            <option value="">All Faculties</option>
            {FACULTIES.map(faculty => (
              <option key={faculty} value={faculty}>{faculty}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.department || ''}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            disabled={!filters.faculty}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={filters.level || ''}
            onChange={(e) => setFilters({ ...filters, level: e.target.value as ProgramLevel })}
          >
            <option value="">All Levels</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Search programs..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map(program => (
            <div key={program.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{program.name}</h3>
              <p className="text-sm text-gray-500">{program.level} • {program.duration}</p>
              <p className="mt-2">{program.description}</p>
              <div className="mt-4">
                <a href={`/programs/${program.id}`} className="text-blue-600 hover:text-blue-800">
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
