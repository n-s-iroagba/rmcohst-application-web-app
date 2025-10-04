import { AlertCircle } from 'lucide-react'

interface ErrorAlerProps {
  message: string
}

const ErrorAlert = ({ message }: ErrorAlerProps) => (
  <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-center max-w-md my-3 mx-auto">
    <div className="flex justify-center mb-4">
      <AlertCircle className="w-12 h-12 text-red-600" />
    </div>
    <h6 className="text-md font-semibold text-red-900 mb-2">{message}</h6>
  </div>
)

export default ErrorAlert
