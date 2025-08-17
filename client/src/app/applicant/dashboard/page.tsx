'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Spinner } from '@/components/Spinner'
import dynamic from 'next/dynamic'
import { AlertTriangle, CheckCircle, Clock, FileText, CreditCard } from 'lucide-react'

import { useAuthContext } from '@/context/AuthContext'
import { useGet } from '@/hooks/useApiQuery'
import { Application, ApplicationStatus } from '@/types/application'
import TodoAlert from '@/components/TodoAlert'
import ErrorAlert from '@/components/ErrorAlert'
import { Payment } from '@/types/payment'
import { API_ROUTES } from '@/config/routes'
import { ApplicationTestIds } from '@/test/testIds'

import { AdmissionSession } from '@/components/SessionList'
import { motion } from 'framer-motion'

// Dynamic imports for components that might have SSR issues




// Dynamic import for react-icons to avoid SSR issues
const FiXCircle = dynamic(() => import('react-icons/fi').then(mod => ({ default: mod.FiXCircle })), {
  ssr: false,
})

const Todo = () => {
  const [mounted, setMounted] = useState(false)
  const { user, loading: authLoading, error: authError } = useAuthContext()
  
  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    error: sessionError,
    loading: sessionLoading,
    resourceData: session
  } = useGet<AdmissionSession>(API_ROUTES.SESSION.CURRENT)

  const {
    resourceData: payments,
    error: paymentError,
    loading: paymentLoading
  } = useGet<Payment[]>(user ? API_ROUTES.PAYMENT.GET_CURRENT_SESSION_APPLICATION_PAYMENTS(user.id) : null)

  const {
    resourceData: application,
    error: applicationError,
    loading: applicationLoading
  } = useGet<Application>(user ? API_ROUTES.APPLICATION.GET_BY_APPLICANT_ID(user.id) : null)

  // Get acceptance fee payments specifically
  const {
    resourceData: acceptanceFeePayments,
    error: acceptanceFeeError,
    loading: acceptanceFeeLoading
  } = useGet<Payment[]>(user ? API_ROUTES.PAYMENT.GET_ACCEPTANCE_FEE_PAYMENTS(user.id) : null)

  const todos: ReactNode[] = []
  
  // Animation variants - only use if framer-motion is available
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

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

  // Helper function to get status color and icon
  const getStatusDisplay = (status: ApplicationStatus) => {
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

  // Check payment statuses
  if (payments) {
    const hasPaid = payments.some((p) => p.status === 'PAID')
    const hasPending = payments.some((p) => p.status === 'PENDING')
    const hasFailed = payments.some((p) => p.status === 'FAILED')

    if (!hasPaid) {
      if (hasPending) {
        todos.push(
          <TodoAlert
            testId={ApplicationTestIds.navigateToPayments}
            key="pending-payment"
            message="You have pending payments awaiting confirmation"
            link="/applicant/payments"
            heading="Pending Payment"
          />
        )
      } else if (hasFailed && !hasPending) {
        todos.push(
          <TodoAlert
            testId={ApplicationTestIds.navigateToPayments}
            key="failed-payment"
            message="Your recent payment attempt failed. Please retry."
            link="/applicant/payments"
            heading="Failed Payment"
          />
        )
      }
    }
  } else if (!payments || !application) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.startApplication}
        key="no-application"
        message="You do not have any applications. Select Program, Make payment and complete application."
        link="/applicant/programs"
        heading="Start Application Process"
      />
    )
  }

  // Check application status
  if (application && application.status === ApplicationStatus.DRAFT) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.navigateToCompleteApplication}
        key="incomplete-application"
        message="You have an incomplete application, click to continue application."
        link="/applicant/application"
        heading="Continue Application Process"
      />
    )
  }

  // Check acceptance fee payment for approved/admitted applications
  if (application && (application.status === ApplicationStatus.APPROVED || application.status === ApplicationStatus.ADMITTED)) {
    const hasAcceptanceFeePaid = acceptanceFeePayments?.some((p) => p.status === 'PAID')
    const hasPendingAcceptanceFee = acceptanceFeePayments?.some((p) => p.status === 'PENDING')
    const hasFailedAcceptanceFee = acceptanceFeePayments?.some((p) => p.status === 'FAILED')

    if (!hasAcceptanceFeePaid) {
      if (hasPendingAcceptanceFee) {
        todos.push(
          <TodoAlert
            testId="pending-acceptance-fee"
            key="pending-acceptance-fee"
            message="Your acceptance fee payment is being processed"
            link="/applicant/acceptance-fee"
            heading="Pending Acceptance Fee"
          />
        )
      } else if (hasFailedAcceptanceFee || !acceptanceFeePayments?.length) {
        todos.push(
          // <PaymentButton paymentType={PaymentType.ACCEPTANCE_FEE} applicantUserId={Number(user.id)} programId={application.programId}/>
        )
      }
    }
  }

  if (authLoading || paymentLoading || sessionLoading || applicationLoading || acceptanceFeeLoading) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
    )
  }

  if (applicationError || sessionError || authError || paymentError || acceptanceFeeError) {
    return <ErrorAlert message={applicationError || paymentError || acceptanceFeeError || authError || sessionError} />
  }

  // Don't render animations until component is mounted
  if (!mounted) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {user?.username}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">Applicant Dashboard</h3>
        </div>
        <div>Current Admission Session: {session?.name}</div>

        {/* Application Status Card */}
        {application && (
          <div className="mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Status
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application Status */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusDisplay(application.status).bgColor}`}>
                    {(() => {
                      const StatusIcon = getStatusDisplay(application.status).icon
                      return <StatusIcon className={`w-4 h-4 ${getStatusDisplay(application.status).color}`} />
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Status</p>
                    <p className={`font-semibold ${getStatusDisplay(application.status).color}`}>
                      {getStatusDisplay(application.status).text}
                    </p>
                  </div>
                </div>

                {/* Acceptance Fee Status */}
                {( application.status === ApplicationStatus.ADMITTED) && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      acceptanceFeePayments?.some(p => p.status === 'PAID') 
                        ? 'bg-green-100' 
                        : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      <CreditCard className={`w-4 h-4 ${
                        acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'text-green-600'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Acceptance Fee</p>
                      <p className={`font-semibold ${
                        acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'text-green-600'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'Paid'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'Pending'
                          : 'Not Paid'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Submitted Date */}
                {application.submittedAt && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {application.status === ApplicationStatus.REJECTED && application.rejectionReason && (
                  <div className="md:col-span-2 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Todo Items - Without Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500"
              >
                {todo}
              </div>
            ))
          ) : (
            <div className="col-span-full p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
              <p className="text-blue-700 font-medium text-sm sm:text-base">
                🎉 All caught up! No pending tasks
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {user?.username}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">Applicant Dashboard</h3>
        </div>
        <div>Current Admission Session: {session?.name}</div>

        {/* Application Status Card */}
        {application && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Application Status
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Application Status */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getStatusDisplay(application.status).bgColor}`}>
                    {(() => {
                      const StatusIcon = getStatusDisplay(application.status).icon
                      return <StatusIcon className={`w-4 h-4 ${getStatusDisplay(application.status).color}`} />
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application Status</p>
                    <p className={`font-semibold ${getStatusDisplay(application.status).color}`}>
                      {getStatusDisplay(application.status).text}
                    </p>
                  </div>
                </div>

                {/* Acceptance Fee Status */}
                {( application.status === ApplicationStatus.ADMITTED) && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      acceptanceFeePayments?.some(p => p.status === 'PAID') 
                        ? 'bg-green-100' 
                        : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}>
                      <CreditCard className={`w-4 h-4 ${
                        acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'text-green-600'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Acceptance Fee</p>
                      <p className={`font-semibold ${
                        acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'text-green-600'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {acceptanceFeePayments?.some(p => p.status === 'PAID')
                          ? 'Paid'
                          : acceptanceFeePayments?.some(p => p.status === 'PENDING')
                          ? 'Pending'
                          : 'Not Paid'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Submitted Date */}
                {application.submittedAt && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Submitted</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {application.status === ApplicationStatus.REJECTED && application.rejectionReason && (
                  <div className="md:col-span-2 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Todo Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        >
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500"
              >
                {todo}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
              <p className="text-blue-700 font-medium text-sm sm:text-base">
                🎉 All caught up! No pending tasks
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default Todo