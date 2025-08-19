'use client'

import ErrorAlert from '@/components/ErrorAlert'
import { AdmissionSession } from '@/components/SessionList'
import { Spinner } from '@/components/Spinner'
import TodoAlert from '@/components/TodoAlert'
import { useAuthContext } from '@/context/AuthContext'
import { useGet } from '@/hooks/useApiQuery'
import { Application, ApplicationStatus } from '@/types/application'
import { Payment } from '@/types/payment'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  GraduationCap
} from 'lucide-react'
import { ReactNode } from 'react'
import { getPaymentStatusInfo, PaymentStatusCard } from '../../../components/PaymentStatusCard'
import { API_ROUTES } from '../../../constants/apiRoutes'
import { getStatusDisplay } from '../../../helpers/getStatusDisplay'
import { ApplicationTestIds } from '../../../test/testIds/applicationTestIds'



const Dashboard = () => {
  const { user, loading: authLoading, error: authError } = useAuthContext()

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
  } = useGet<Application>(user ? API_ROUTES.APPLICATION.GET_BY_APPLICANT_ID : null)

  const {
    resourceData: acceptanceFeePayments,
    error: acceptanceFeeError,
    loading: acceptanceFeeLoading
  } = useGet<Payment[]>(user ? API_ROUTES.PAYMENT.GET_ACCEPTANCE_FEE_PAYMENTS(user.id) : null)

  // Animation variants
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

  // Get payment status info
  const applicationPaymentInfo = getPaymentStatusInfo(payments)
  const acceptanceFeePaymentInfo = getPaymentStatusInfo(acceptanceFeePayments)

  // Generate todos based on current state
  const todos: ReactNode[] = []

  if (!application && !applicationPaymentInfo.hasPaid) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.startApplication}
        key="no-application"
        message="Start your admission journey by selecting a program and making the application payment."
        link="/applicant/programs"
        heading="Begin Application"
      />
    )
  }

  if (application?.status === ApplicationStatus.DRAFT && applicationPaymentInfo.hasPaid) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.navigateToCompleteApplication}
        key="incomplete-application"
        message="Your application payment is confirmed. Complete your application form to proceed."
        link="/applicant/application"
        heading="Complete Application"
      />
    )
  }

  if (applicationPaymentInfo.hasFailedWithoutRetry) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.navigateToPayments}
        key="failed-payment"
        message="Your application payment failed. Please retry to continue your application."
        link="/applicant/programs"
        heading="Retry Application Payment"
      />
    )
  }
  if (applicationPaymentInfo.hasPending) {
    todos.push(
      <TodoAlert
        testId={ApplicationTestIds.navigateToPayments}
        key="pending-payment"
        message="Your application payment is pending. Please click to verify payment."
        link="/applicant/payments"
        heading="Pending Application Payment"
      />
    )
  }

  if (application?.status === ApplicationStatus.ADMITTED && acceptanceFeePaymentInfo.hasFailedWithoutRetry) {
    todos.push(
      <TodoAlert
        testId="retry-acceptance-fee"
        key="failed-acceptance-fee"
        message="Your acceptance fee payment failed. Please retry to secure your admission."
        link={`/applicant/pay-acceptance-fee/${application.programId}`}
        heading="Retry Acceptance Fee"
      />
    )
  }


  if (application?.status === ApplicationStatus.ADMITTED && acceptanceFeePaymentInfo.hasPending) {
    todos.push(
      <TodoAlert
        testId="pending-acceptance-fee"
        key="pending-acceptance-fee"
        message="Your acceptance fee payment is pending. Please verify to secure your admission."
        link="/applicant/payments"
        heading="Verify Acceptance Fee"
      />
    )
  }

  if (application?.status === ApplicationStatus.ADMITTED && !acceptanceFeePaymentInfo.hasPaid && !acceptanceFeePaymentInfo.hasPending) {
    todos.push(
      <TodoAlert
        testId="pay-acceptance-fee"
        key="unpaid-acceptance-fee"
        message="Congratulations on your admission! Pay your acceptance fee to confirm your enrollment."
        link={`/applicant/pay-acceptance-fee/${application.programId}`}
        heading="Pay Acceptance Fee"
      />
    )
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

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span>Welcome back, {user?.username}!</span>
        </h2>
        <p className="text-lg text-blue-700">Student Dashboard</p>
        {session && (
          <p className="text-sm text-gray-600 mt-1">
            Current Admission Session: <span className="font-medium">{session.name}</span>
          </p>
        )}
      </div>

      {/* Application Status Overview */}
      {application && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Application Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Application Status */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getStatusDisplay(application.status).bgColor}`}>
                  {(() => {
                    const StatusIcon = getStatusDisplay(application.status).icon
                    return <StatusIcon className={`w-8 h-8 ${getStatusDisplay(application.status).color}`} />
                  })()}
                </div>
                <p className="text-sm text-gray-600 mb-1">Application Status</p>
                <p className={`font-bold text-lg ${getStatusDisplay(application.status).color}`}>
                  {getStatusDisplay(application.status).text}
                </p>
                {application.submittedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Progress Steps */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Application Progress</span>
                  <span className="text-sm text-gray-500">
                    {application.status === ApplicationStatus.ADMITTED ? '100%' :
                      application.status === ApplicationStatus.SUBMITTED ? '75%' :
                        application.status === ApplicationStatus.DRAFT ? '25%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${application.status === ApplicationStatus.ADMITTED ? 'bg-green-500 w-full' :
                      application.status === ApplicationStatus.APPROVED ? 'bg-blue-500 w-3/4' :
                        application.status === ApplicationStatus.SUBMITTED ? 'bg-yellow-500 w-1/2' :
                          application.status === ApplicationStatus.DRAFT ? 'bg-orange-500 w-1/4' :
                            'bg-gray-300 w-0'
                      }`}
                  />
                </div>

                {/* Rejection Reason */}
                {application.status === ApplicationStatus.REJECTED && application.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600 font-medium mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-800">{application.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Status Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Application Fee Status */}
        <motion.div variants={itemVariants}>
          <PaymentStatusCard
            title="Application Fee"
            icon={DollarSign}
            paymentInfo={applicationPaymentInfo}
            linkPath="/applicant/payments"
            testId={ApplicationTestIds.navigateToPayments}
          />
        </motion.div>

        {/* Acceptance Fee Status - Only show if admitted or if there are acceptance fee payments */}
        {(application?.status === ApplicationStatus.ADMITTED || acceptanceFeePayments?.length) && (
          <motion.div variants={itemVariants}>
            <PaymentStatusCard
              title="Acceptance Fee"
              icon={GraduationCap}
              paymentInfo={acceptanceFeePaymentInfo}
              linkPath="/applicant/payments"
              testId="navigate-to-acceptance-fee"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Action Items / Todos */}
      {todos.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            Action Required
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {todos.map((todo, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-amber-500"
              >
                {todo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Success Message when all is complete */}
      {todos.length === 0 && application && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">All Set!</h3>
          <p className="text-green-700">
            {application.status === ApplicationStatus.ADMITTED && acceptanceFeePaymentInfo.hasPaid
              ? "Congratulations! Your admission is confirmed and all fees are paid."
              : "You're all caught up with no pending actions required."
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard