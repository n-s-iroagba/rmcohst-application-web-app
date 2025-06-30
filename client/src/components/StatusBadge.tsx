import { ApplicationStatus } from "@/types/application"
import { Clock, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' }
      case 'UNDER_REVIEW':
        return { icon: Eye, color: 'bg-slate-100 text-slate-800', label: 'Under Review' }
      case 'APPROVED':
        return { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' }
      case 'REJECTED':
        return { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' }
      case 'SUBMITTED':
        return { icon: AlertCircle, color: 'bg-orange-100 text-orange-800', label: 'Waitlisted' }
      default:
        return { icon: Clock, color: 'bg-gray-100 text-gray-800', label: 'Unknown' }
    }
  }

  const { icon: Icon, color, label } = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  )
}
export default StatusBadge