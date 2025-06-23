import { Application, ApplicationStatus } from "@/types/application";
import { Search, Calendar, GraduationCap } from "lucide-react";
import { useState } from "react";

const ApplicationList: React.FC<{
  applications: Application[];
  onSelectApplication: (application: Application) => void;
  selectedId?: number;
}> = ({ applications, onSelectApplication, selectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.biodata.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.biodata.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.biodata.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'ALL')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
        </select>
      </div>

      {/* Application List */}
      <div className="flex-1 overflow-y-auto">
        {filteredApplications.map((application) => (
          <div
            key={application.id}
            onClick={() => onSelectApplication(application)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === application.id ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900">
                  {application.biodata.firstName} {application.biodata.surname}
                </h3>
                <p className="text-sm text-gray-500">{application.biodata.emailAddress}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(application.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <GraduationCap className="w-3 h-3 mr-1" />
                {application.sscQualifications.length} Qualifications
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};