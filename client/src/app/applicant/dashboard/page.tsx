'use client'

import { ReactNode } from 'react'

import { Spinner } from '@/components/Spinner'
import { motion } from 'framer-motion'
import { FiTruck, FiUser, FiMapPin, FiPackage } from 'react-icons/fi'

import { AlertTriangle } from 'lucide-react'
import { AdmissionSession } from '@/components/SessionCard'
import { useAuthContext } from '@/context/AuthContext'
import { useGet } from '@/hooks/useApiQuery'
import { Application } from '@/types/application'
import TodoAlert from '@/components/TodoAlert'
import ErrorAlert from '@/components/ErrorAlert'
import { Payment } from '@/types/payment'
import { API_ROUTES } from '@/config/routes'
import { ApplicationTestIds } from '@/test/testIds'

const Todo = () => {
  const { user, loading: authLoading, error: authError } = useAuthContext()
  const paymentUrl = user
    ? API_ROUTES.PAYMENT.GET_CURRENT_SESSION_APPLICATION_PAYMENTS(user.id)
    : null

  const {
    error: sessionError,
    loading: sessionLoading,
    resourceData: session
  } = useGet<AdmissionSession>(API_ROUTES.SESSION.CURRENT)

  const {
    resourceData: payments,
    error: paymentrror,
    loading: paymentLoading
  } = useGet<Payment[]>(null)

  const {
    resourceData: application,
    error: applicationError,
    loading: applicationLoading
  } = useGet<Application>(API_ROUTES.APPLICATION.GET_BY_APPLICANT_ID(user.id))

  const todos: ReactNode[] = []
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
            link="/applicants/payments"
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
  } else if (!payments) {
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
  if (application && application.status==='DRAFT'){
      todos.push(  <TodoAlert
       testId={ApplicationTestIds.navigateToCompleteApplication}
        key="incomplete-appplication"
        message="You do not have an incomplete application, click to continue application."
        link="/applicant/application"
        heading="Continue Application Process"
      />
    )
  }


  if (authLoading || paymentLoading || sessionLoading || paymentLoading) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
    )
  }

  if (applicationError || paymentrror || sessionError || authError) {
    return <ErrorAlert message={applicationError || paymentrror || authError || sessionError} />
  }

  return (
    <>
      {/* Mobile-optimized content container */}
      <div className="w-full">
        {/* Header - Responsive text sizing */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />{' '}
            {/* ✅ Lucide */}
            <span className="break-words">Welcome back, {user.username}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">Applicant Dashboard</h3>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:gPrid-cols-4 gap-6 mb-10"
        >
          {todos.length > 0 ? (
            todos.map((todo,index) => (
              <motion.div
              key={index}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500"
              >
                {todo}
              </motion.div>
            ))
          ) : (
            <div className="p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
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
