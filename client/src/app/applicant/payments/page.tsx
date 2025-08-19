
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    FileText,
    XCircle
} from 'lucide-react'
import ErrorAlert from '../../../components/ErrorAlert'
import { Spinner } from '../../../components/Spinner'
import { API_ROUTES } from '../../../constants/apiRoutes'
import { useGet } from '../../../hooks/useApiQuery'
import { Payment, PaymentStatus, PaymentType } from '../../../types/payment'


const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    const getStatusConfig = () => {
        switch (payment.status) {
            case PaymentStatus.PAID:
                return {
                    icon: CheckCircle,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    text: 'Paid'
                }
            case PaymentStatus.PENDING:
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    text: 'Pending'
                }
            case PaymentStatus.FAILED:
                return {
                    icon: XCircle,
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    text: 'Failed'
                }
            case PaymentStatus.CANCELLED:
                return {
                    icon: AlertCircle,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    text: 'Cancelled'
                }
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    text: payment.status
                }
        }
    }

    const getPaymentTypeConfig = () => {
        switch (payment.paymentType) {
            case PaymentType.APPLICATION_FEE:
                return {
                    text: 'Application Fee',
                    icon: FileText,
                    color: 'text-blue-600'
                }
            case PaymentType.ACCEPTANCE_FEE:
                return {
                    text: 'Acceptance Fee',
                    icon: CreditCard,
                    color: 'text-purple-600'
                }
            default:
                return {
                    text: payment.paymentType,
                    icon: DollarSign,
                    color: 'text-gray-600'
                }
        }
    }

    const statusConfig = getStatusConfig()
    const typeConfig = getPaymentTypeConfig()
    const StatusIcon = statusConfig.icon
    const TypeIcon = typeConfig.icon

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 ${statusConfig.borderColor} hover:shadow-md transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                        <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{typeConfig.text}</h4>
                        <p className="text-sm text-gray-600">₦{payment.amount.toLocaleString()}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.text}
                    </span>
                </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reference:</span>
                    <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {payment.reference}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <div className="flex items-center gap-1 text-sm text-gray-800">
                        <Calendar className="w-4 h-4" />
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                {payment.paidAt && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Paid:</span>
                        <div className="flex items-center gap-1 text-sm text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            {new Date(payment.paidAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                )}

                {payment.cancelledAt && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cancelled:</span>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                            <XCircle className="w-4 h-4" />
                            {new Date(payment.cancelledAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-3">
                        {/* Receipt Download */}
                        {payment.receiptLink && payment.status === PaymentStatus.PAID && (
                            <a
                                href={payment.receiptLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download Receipt
                            </a>
                        )}

                        {/* Verification Button */}
                        <a
                            href={`/applicant/payment/status?reference=${payment.reference}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Verify Status
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentList = ({ id }: { id: number }) => {
    const { resourceData: payments, error, loading } = useGet<Payment[]>(API_ROUTES.PAYMENT.APPLICANT_PAYMENTS(id))

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Spinner className="w-8 h-8 text-blue-600" />
            </div>
        )
    }

    if (error) {
        return <ErrorAlert message={error || 'Error fetching payments'} />
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Payments Found</h3>
                <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
        )
    }

    // Sort payments by creation date (most recent first)
    const sortedPayments = [...payments].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Group payments by type
    const applicationFeePayments = sortedPayments.filter(p => p.paymentType === PaymentType.APPLICATION_FEE)
    const acceptanceFeePayments = sortedPayments.filter(p => p.paymentType === PaymentType.ACCEPTANCE_FEE)

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    Payment History
                </h2>
                <p className="text-gray-600">View all your payment transactions</p>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">Total Payments</p>
                            <p className="text-xl font-bold text-blue-800">{payments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-green-600">Successful</p>
                            <p className="text-xl font-bold text-green-800">
                                {payments.filter(p => p.status === PaymentStatus.PAID).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-600">Pending</p>
                            <p className="text-xl font-bold text-yellow-800">
                                {payments.filter(p => p.status === PaymentStatus.PENDING).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Fee Payments */}
            {applicationFeePayments.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Application Fee Payments
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {applicationFeePayments.map((payment) => (
                            <PaymentCard key={payment.id} payment={payment} />
                        ))}
                    </div>
                </div>
            )}

            {/* Acceptance Fee Payments */}
            {acceptanceFeePayments.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        Acceptance Fee Payments
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {acceptanceFeePayments.map((payment) => (
                            <PaymentCard key={payment.id} payment={payment} />
                        ))}
                    </div>
                </div>
            )}

            {/* All Payments (if no grouping needed) */}
            {applicationFeePayments.length === 0 && acceptanceFeePayments.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedPayments.map((payment) => (
                        <PaymentCard key={payment.id} payment={payment} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default PaymentList