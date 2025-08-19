'use client'

import ErrorAlert from '@/components/ErrorAlert'
import { AdmissionSession } from '@/components/SessionList'
import { Spinner } from '@/components/Spinner'
import { useAuthContext } from '@/context/AuthContext'
import { useGet } from '@/hooks/useApiQuery'
import { Application, ApplicationStatus } from '@/types/application'
import { Payment } from '@/types/payment'
import { motion } from 'framer-motion'
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    FileText,
    GraduationCap,
    XCircle
} from 'lucide-react'
import { API_ROUTES } from '../../../constants/apiRoutes'
import { getStatusDisplay } from '../../../helpers/getStatusDisplay'

const MyAdmissionStatus = () => {
    const { user, loading: authLoading, error: authError } = useAuthContext()

    const {
        error: sessionError,
        loading: sessionLoading,
        resourceData: session
    } = useGet<AdmissionSession>(API_ROUTES.SESSION.CURRENT)

    const {
        resourceData: application,
        error: applicationError,
        loading: applicationLoading
    } = useGet<Application>(user ? API_ROUTES.APPLICATION.GET_BY_APPLICANT_ID : null)

    const {
        resourceData: acceptanceFeePayments,
        error: acceptanceFeeError,
        loading: acceptanceFeeLoading
    } = useGet<Payment[]>(user ? API_ROUTES.PAYMENT.GET_ACCEPTANCE_FEE_PAYMENTS(user.id) : null)

    // Animation variants
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    // Get acceptance fee payment status
    const getAcceptanceFeeStatus = () => {
        if (!acceptanceFeePayments || acceptanceFeePayments.length === 0) {
            return {
                status: 'not_paid',
                text: 'Not Paid',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                icon: XCircle,
                actionNeeded: true
            }
        }

        const hasPaid = acceptanceFeePayments.some((p) => p.status === 'PAID')
        const hasPending = acceptanceFeePayments.some((p) => p.status === 'PENDING')
        const hasFailed = acceptanceFeePayments.some((p) => p.status === 'FAILED')

        if (hasPaid) {
            return {
                status: 'paid',
                text: 'Paid',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                icon: CheckCircle,
                actionNeeded: false
            }
        }

        if (hasPending) {
            return {
                status: 'pending',
                text: 'Payment Pending',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                icon: Clock,
                actionNeeded: false
            }
        }

        return {
            status: 'failed',
            text: 'Payment Failed',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            icon: XCircle,
            actionNeeded: true
        }
    }

    if (authLoading || sessionLoading || applicationLoading || acceptanceFeeLoading) {
        return (
            <div className="flex justify-center items-center h-screen px-4">
                <Spinner className="w-8 h-8 text-blue-600" />
            </div>
        )
    }

    if (applicationError || sessionError || authError || acceptanceFeeError) {
        return <ErrorAlert message={applicationError || acceptanceFeeError || authError || sessionError} />
    }

    // If no application exists
    if (!application) {
        return (
            <div className="w-full">
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
                        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                        <span className="break-words">My Admission Status</span>
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Application Found</h3>
                    <p className="text-gray-600 mb-4">You haven't submitted an application yet.</p>
                    <a
                        href="/applicant/programs"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Start Application
                    </a>
                </div>
            </div>
        )
    }

    const acceptanceFeeStatus = getAcceptanceFeeStatus()
    const isAdmittedOrApproved = application.status === ApplicationStatus.ADMITTED || application.status === ApplicationStatus.APPROVED

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <span className="break-words">My Admission Status</span>
                </h2>
                {session && (
                    <p className="text-sm text-gray-600">
                        Admission Session: <span className="font-medium">{session.name}</span>
                    </p>
                )}
            </div>

            <div className="space-y-6">
                {/* Session Information */}
                {session && (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Admission Session Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Session Name</p>
                                <p className="font-semibold text-gray-800">{session.name}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Application Status */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Application Status
                    </h3>

                    <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getStatusDisplay(application.status).bgColor}`}>
                            {(() => {
                                const StatusIcon = getStatusDisplay(application.status).icon
                                return <StatusIcon className={`w-10 h-10 ${getStatusDisplay(application.status).color}`} />
                            })()}
                        </div>
                        <h4 className={`text-2xl font-bold mb-2 ${getStatusDisplay(application.status).color}`}>
                            {getStatusDisplay(application.status).text}
                        </h4>
                        {application.submittedAt && (
                            <p className="text-sm text-gray-600">
                                Submitted on {new Date(application.submittedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>

                    {/* Rejection Reason */}
                    {application.status === ApplicationStatus.REJECTED && application.rejectionReason && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                                    <p className="text-sm text-red-800">{application.rejectionReason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <p className="text-sm text-gray-600">Application ID</p>
                            <p className="font-semibold text-gray-800">{application.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Program</p>
                            <p className="font-semibold text-gray-800">{application.programId}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Acceptance Fee Status - Only show if admitted or approved */}
                {isAdmittedOrApproved && (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className={`bg-white p-6 rounded-2xl shadow-sm border-2 ${acceptanceFeeStatus.borderColor}`}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Acceptance Fee Status
                        </h3>

                        <div className="text-center mb-6">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${acceptanceFeeStatus.bgColor}`}>
                                <acceptanceFeeStatus.icon className={`w-8 h-8 ${acceptanceFeeStatus.color}`} />
                            </div>
                            <h4 className={`text-xl font-bold mb-2 ${acceptanceFeeStatus.color}`}>
                                {acceptanceFeeStatus.text}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {acceptanceFeeStatus.status === 'paid'
                                    ? 'Your admission is confirmed!'
                                    : acceptanceFeeStatus.status === 'pending'
                                        ? 'Payment is being processed'
                                        : 'Payment required to confirm admission'
                                }
                            </p>
                        </div>

                        {/* Payment Details */}
                        {acceptanceFeePayments && acceptanceFeePayments.length > 0 && (
                            <div className="space-y-3 mb-6">
                                <h5 className="font-medium text-gray-800">Recent Payments:</h5>
                                {acceptanceFeePayments
                                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                                    .slice(0, 3)
                                    .map((payment, index) => (
                                        <div key={payment.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${payment.status === 'PAID' ? 'bg-green-500' :
                                                    payment.status === 'PENDING' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {payment.status === 'PAID' ? 'Paid' :
                                                            payment.status === 'PENDING' ? 'Pending' :
                                                                'Failed'}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(payment.createdAt || '').toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {payment.amount && (
                                                <p className="text-sm font-semibold text-gray-800">
                                                    ₦{payment.amount.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Action Button */}
                        {acceptanceFeeStatus.actionNeeded && (
                            <div className="text-center">
                                <a
                                    href="/applicant/payments"
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${acceptanceFeeStatus.status === 'failed'
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    {acceptanceFeeStatus.status === 'failed' ? 'Retry Payment' : 'Pay Acceptance Fee'}
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Congratulations Message for Admitted Students with Paid Fee */}
                {application.status === ApplicationStatus.ADMITTED && acceptanceFeeStatus.status === 'paid' && (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 text-center"
                    >
                        <GraduationCap className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Congratulations!</h3>
                        <p className="text-green-700 text-lg">
                            Your admission is fully confirmed. Welcome to our institution!
                        </p>
                        <p className="text-green-600 text-sm mt-2">
                            You will receive further instructions via email regarding orientation and enrollment.
                        </p>
                    </motion.div>
                )}

                {/* Next Steps for Admitted Students */}
                {application.status === ApplicationStatus.ADMITTED && acceptanceFeeStatus.status !== 'paid' && (
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200"
                    >
                        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Next Steps
                        </h3>
                        <div className="space-y-2 text-blue-700">
                            <p>• Pay your acceptance fee to confirm your admission</p>
                            <p>• Keep checking your email for important updates</p>
                            <p>• Prepare required documents for enrollment</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default MyAdmissionStatus