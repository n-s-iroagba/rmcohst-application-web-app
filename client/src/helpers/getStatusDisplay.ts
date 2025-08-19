import { CheckCircle, Clock, FileText } from "lucide-react"
import { FiXCircle } from "react-icons/fi"
import { ApplicationStatus } from "../types/application"

export const getStatusDisplay = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.DRAFT:
      return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: FileText, text: 'Draft' }
    case ApplicationStatus.SUBMITTED:
      return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Clock, text: 'Submitted' }
    case ApplicationStatus.UNDER_REVIEW:
      return { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Clock, text: 'Under Review' }
    case ApplicationStatus.PENDING_APPROVAL:
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock, text: 'Pending Approval' }
    case ApplicationStatus.APPROVED:
      return { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle, text: 'Approved' }
    case ApplicationStatus.REJECTED:
      return { color: 'text-red-600', bgColor: 'bg-red-100', icon: FiXCircle, text: 'Rejected' }
    case ApplicationStatus.ADMITTED:
      return { color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: CheckCircle, text: 'Admitted' }
    default:
      return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: FileText, text: 'Unknown' }
  }
}