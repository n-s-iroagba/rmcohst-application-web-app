'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useGet } from '@/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'
import { Payment } from '@/types/payment'
import { Application, ApplicationStatus } from '@/types/application'
import { 
  CreditCard, User, GraduationCap, FileText, Eye, Send,
  AlertCircle, CheckCircle, Clock, XCircle, LucideIcon
} from 'lucide-react'

import { CustomForm } from '@/components/CustomForm'
import { useAuthContext } from '@/context/AuthContext'
import { useRoutes } from '@/hooks/useRoutes'
import { Spinner } from '@/components/Spinner'
import BiodataForm from '@/components/BiodataForm'

// Strict type definitions
type ApplicationStep = 'biodata' | 'ssc' | 'program-specific' | 'review' | 'submitted'

export interface ApplicationPaymentStatus {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'NO-PAYMENT'
  payment: Payment[]
}

interface StepConfig {
  id: ApplicationStep
  label: string
  icon: LucideIcon
}

interface StatusConfig {
  icon: React.ReactNode
  colorClass: string
}

// Constants
const STEPS: readonly StepConfig[] = [
  { id: 'biodata', label: 'Biodata', icon: User },
  { id: 'ssc', label: 'SSC Qualifications', icon: FileText },
  { id: 'program-specific', label: 'Program Requirements', icon: GraduationCap },
  { id: 'review', label: 'Review & Submit', icon: Eye },
] as const

const ApplicationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('biodata')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { user } = useAuthContext()
  const { navigateToSelectProgram } = useRoutes()

  // Memoized status configurations
  const statusConfigs = useMemo((): Record<ApplicationStatus, StatusConfig> => ({
    [ApplicationStatus.DRAFT]: {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    [ApplicationStatus.SUBMITTED]: {
      icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
      colorClass: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    [ApplicationStatus.UNDER_REVIEW]: {
      icon: <Eye className="h-5 w-5 text-purple-500" />,
      colorClass: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    [ApplicationStatus.APPROVED]: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      colorClass: 'bg-green-100 text-green-800 border-green-200'
    },
    [ApplicationStatus.REJECTED]: {
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      colorClass: 'bg-red-100 text-red-800 border-red-200'
    },
    [ApplicationStatus.ADMITTED]: {
      icon: <GraduationCap className="h-5 w-5 text-green-600" />,
      colorClass: 'bg-green-100 text-green-900 border-green-300'
    },
    [ApplicationStatus.PENDING_APPROVAL]:  {
      icon: <GraduationCap className="h-5 w-5 text-green-600" />,
      colorClass: 'bg-green-100 text-green-900 border-green-300'
    },
  }), [])

  // API calls
  const {
    resourceData: paymentData,
    loading: isPaymentLoading,
    error: paymentError,
  } = useGet<ApplicationPaymentStatus>(
    API_ROUTES.PAYMENT.GET_CURRENT_SESSION_APPLICATION_PAYMENT_STATUS(1)
  )

  // TODO: Fix hardcoded applicationId - should come from payment data or context
  const applicationId = 8
  const {
    resourceData: application,
    loading: isApplicationLoading,
    error: applicationError,
  } = useGet<Application>(
    applicationId ? API_ROUTES.APPLICATION.GET_BY_ID(String(applicationId)) : null
  )

  // Memoized computed values
  const isLoading = useMemo(() => 
    isApplicationLoading || isPaymentLoading, 
    [isApplicationLoading, isPaymentLoading]
  )

  const hasError = useMemo(() => 
    applicationError || paymentError, 
    [applicationError, paymentError]
  )

  // Event handlers
  const handleStepChange = useCallback((step: ApplicationStep) => {
    setCurrentStep(step)
  }, [])

  const handleSubmitApplication = useCallback(async () => {
    if (!application?.id) {
      console.error('No application ID available')
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement actual submission logic
      console.log('Submitting application:', application.id)
      // await submitApplication(application.id)
    } catch (error) {
      console.error('Failed to submit application:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false)
    }
  }, [application?.id])

  const handlePreviousStep = useCallback(() => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep)
    if (currentIndex > 0) {
      handleStepChange(STEPS[currentIndex - 1].id)
    }
  }, [currentStep, handleStepChange])

  // Helper functions
  const getStatusConfig = useCallback((status: ApplicationStatus): StatusConfig => {
    return statusConfigs[status] || {
      icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
      colorClass: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [statusConfigs])

  // Render functions for different states
  const renderLoadingState = () => <Spinner />

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium">Failed to load application data</p>
        <p className="text-gray-500 text-sm mt-2">{hasError?.toString()}</p>
      </div>
    </div>
  )

  const renderPaymentStatusScreen = (
    title: string, 
    showButton: boolean = false, 
    buttonText?: string
  ) => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <CreditCard className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
        {showButton && buttonText && (
          <button 
            className="bg-teal-900 hover:bg-teal-800 text-white px-6 py-2 rounded transition-colors" 
            onClick={navigateToSelectProgram}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )

  const renderStepNavigation = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
        {STEPS.map(step => (
          <button
            key={step.id}
            onClick={() => handleStepChange(step.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
              currentStep === step.id 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <step.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderStepContent = () => {
    if (!application) return null

    switch (currentStep) {
      case 'biodata':
        return <BiodataForm application={application} />
      // case 'ssc':
      //   return <CustomForm />
      // case 'program-specific':
      //   return <CustomForm />
      case 'review':
        return renderReviewStep()
      default:
        return null
    }
  }

  const renderReviewStep = () => (
    <div className="p-8">
      <div className="text-center mb-8">
        <Eye className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Review Your Application</h2>
        <p className="text-gray-600">Please review all your information before submitting</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-slate-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Application Summary</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Personal Information</h4>
              <p className="text-sm text-gray-600">✓ Biodata completed</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Academic Qualifications</h4>
              <p className="text-sm text-gray-600">✓ SSC qualifications added</p>
              <p className="text-sm text-gray-600">✓ Program-specific requirements completed</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
              <p className="text-yellow-700 text-sm">
                Once submitted, you will not be able to modify your application.
                Please ensure all information is correct.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-6">
   

      {currentStep === 'review' && (
        <button
          onClick={handleSubmitApplication}
          disabled={isSubmitting}
          className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold px-8 py-3 rounded-lg transition flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      )}
    </div>
  )

  const renderDraftApplication = () => {
    if (!application) return null

    const statusConfig = getStatusConfig(application.status)

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${statusConfig.colorClass}`}>
            {statusConfig.icon}
            <span className="ml-2 font-medium">
              {application.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Application</h1>
            <p className="text-gray-600">Fill out all required sections to submit your application</p>
          </div>

          {renderStepNavigation()}

          <div className="bg-white rounded-lg shadow-lg border border-slate-200">
            {renderStepContent()}
          </div>

          {renderNavigationButtons()}
        </div>
      </div>
    )
  }

  // Main render logic
  if (isLoading) return renderLoadingState()
  if (hasError) return renderErrorState()

  // Handle different payment statuses
  switch (paymentData?.status) {
    case 'NO-PAYMENT':
      return renderPaymentStatusScreen(
        'Start Your Application',
        true,
        'Click Here To Begin'
      )
    case 'PENDING':
      return renderPaymentStatusScreen(
        'Your Payment is pending, please check back later'
      )
    case 'FAILED':
      return renderPaymentStatusScreen(
        'Your previous attempt to start an application failed, as the payment was reversed',
        true,
        'Click Here To Start Another Application'
      )
    case 'PAID':
      // Handle paid status - check if application exists and its status
      if (application?.status === ApplicationStatus.DRAFT) {
        return renderDraftApplication()
      }
      break
  }

  // Default fallback
  return renderPaymentStatusScreen(
    'Begin your journey to healthcare professionalism',
    true,
    'Click Here To Start Your Application'
  )
}

export default ApplicationPage