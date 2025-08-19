'use client'



import { Payment } from '@/types/payment'
import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    XCircle,
} from 'lucide-react'


interface PaymentStatusInfo {
    hasPaid: boolean
    hasPending: boolean
    hasFailed: boolean
    hasFailedWithoutRetry: boolean
    latestPayment?: Payment
}

export const getPaymentStatusInfo = (payments: Payment[] | undefined): PaymentStatusInfo => {
    if (!payments || payments.length === 0) {
        return {
            hasPaid: false,
            hasPending: false,
            hasFailed: false,
            hasFailedWithoutRetry: false
        }
    }

    const sortedPayments = [...payments].sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )

    const latestPayment = sortedPayments[0]
    const hasPaid = payments.some(p => p.status === 'PAID')
    const hasPending = payments.some(p => p.status === 'PENDING')
    const hasFailed = payments.some(p => p.status === 'FAILED')

    // Check if latest payment failed and no subsequent attempt was made
    const hasFailedWithoutRetry = latestPayment?.status === 'FAILED' && !hasPaid && !hasPending

    return {
        hasPaid,
        hasPending,
        hasFailed,
        hasFailedWithoutRetry,
        latestPayment
    }
}

export const PaymentStatusCard = ({
    title,
    icon: Icon,
    paymentInfo,
    amount,
    linkPath,
    testId
}: {
    title: string
    icon: any
    paymentInfo: PaymentStatusInfo
    amount?: string
    linkPath?: string
    testId?: string
}) => {
    const getStatusConfig = () => {
        if (paymentInfo.hasPaid) {
            return {
                status: 'Paid',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: CheckCircle,
                borderColor: 'border-green-200'
            }
        }

        if (paymentInfo.hasPending) {
            return {
                status: 'Payment Pending',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                icon: Clock,
                borderColor: 'border-yellow-200'
            }
        }

        if (paymentInfo.hasFailedWithoutRetry) {
            return {
                status: 'Payment Failed',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                icon: XCircle,
                borderColor: 'border-red-200'
            }
        }

        return {
            status: 'Not Paid',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: AlertCircle,
            borderColor: 'border-gray-200'
        }
    }

    const config = getStatusConfig()
    const StatusIcon = config.icon

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-2 ${config.borderColor} transition-all duration-300 hover:shadow-md`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{title}</h4>
                        {amount && (
                            <p className="text-sm text-gray-600">{amount}</p>
                        )}
                    </div>
                </div>
                <div className={`p-1.5 rounded-full ${config.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`font-semibold ${config.color}`}>{config.status}</span>
                </div>

                {paymentInfo.latestPayment && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Last Updated:</span>
                        <span className="text-sm text-gray-800">
                            {new Date(paymentInfo.latestPayment.updatedAt || paymentInfo.latestPayment.createdAt || '').toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            {/* Action needed indicator */}
            {(paymentInfo.hasFailedWithoutRetry || (!paymentInfo.hasPaid && !paymentInfo.hasPending)) && linkPath && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                        href={linkPath}
                        data-testid={testId}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${paymentInfo.hasFailedWithoutRetry
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        {paymentInfo.hasFailedWithoutRetry ? 'Retry Payment' : 'Make Payment'}
                    </a>
                </div>
            )}
        </div>
    )
}