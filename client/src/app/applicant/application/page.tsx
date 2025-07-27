'use client'

import React, { useState } from 'react'
import { useGet } from '@/hooks/useApiQuery'
import { API_ROUTES } from '@/config/routes'
import {Payment} from '@/types/payment'
import { Application, ApplicationStatus } from '@/types/application'
import { 
  CreditCard, User, GraduationCap, FileText, Eye, Send,
  AlertCircle, CheckCircle, Clock, XCircle
} from 'lucide-react'

import { CustomForm } from '@/components/CustomForm'
import { useAuthContext } from '@/context/AuthContext'
import { useRoutes } from '@/hooks/useRoutes'

type ApplicationStep = 'payment' | 'biodata' | 'ssc' | 'program-specific' | 'review' | 'submitted'

const ApplicationPage = () => {

  const [currentStep, setCurrentStep] = useState<ApplicationStep>('biodata')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuthContext()
  const {navigateToSelectProgram}= useRoutes()

  if (!user) return null

  const {
    resourceData: payment,
    loading: isPaymentLoading,
    error: paymentError,
  } = useGet<Payment>(API_ROUTES.PAYMENT.GET_BY_APPLICANT_USER_ID(user.id))

  const applicationId = payment?.applicationId ||null

  const {
    resourceData: application,
    loading,
    error,
  } = useGet<Application>(applicationId ? API_ROUTES.APPLICATION.GET_BY_ID(applicationId) : null)

  const handleStepChange = (step: ApplicationStep) => setCurrentStep(step)

  const handleSubmitApplication = async () => {
    setIsSubmitting(true)
    try {
      // await submitApplication(application.id)
      console.log('Submitting application...')
    } catch (error) {
      console.error('Failed to submit application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT: return <Clock className="h-5 w-5 text-yellow-500" />
      case ApplicationStatus.SUBMITTED: return <CheckCircle className="h-5 w-5 text-blue-500" />
      case ApplicationStatus.UNDER_REVIEW: return <Eye className="h-5 w-5 text-purple-500" />
      case ApplicationStatus.APPROVED: return <CheckCircle className="h-5 w-5 text-green-500" />
      case ApplicationStatus.REJECTED: return <XCircle className="h-5 w-5 text-red-500" />
      case ApplicationStatus.ADMITTED: return <GraduationCap className="h-5 w-5 text-green-600" />
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.DRAFT: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case ApplicationStatus.SUBMITTED: return 'bg-blue-100 text-blue-800 border-blue-200'
      case ApplicationStatus.UNDER_REVIEW: return 'bg-purple-100 text-purple-800 border-purple-200'
      case ApplicationStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200'
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200'
      case ApplicationStatus.ADMITTED: return 'bg-green-100 text-green-900 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading || isPaymentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (error || paymentError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Failed to load application data</p>
          <p className="text-gray-500 text-sm mt-2">{(error || paymentError)?.toString()}</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CreditCard className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Start Your Application</h1>
          <button onClick={navigateToSelectProgram} >Click Here To Begin</button>
        </div>

        
        </div>
      
    )
  }

  if (application.status !== ApplicationStatus.DRAFT) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon(application.status)}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Application</h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(application.status)}`}>
            {getStatusIcon(application.status)}
            <span className="ml-2 font-medium">{application.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'biodata', label: 'Biodata', icon: User },
    { id: 'ssc', label: 'SSC Qualifications', icon: FileText },
    { id: 'program-specific', label: 'Program Requirements', icon: GraduationCap },
    { id: 'review', label: 'Review & Submit', icon: Eye },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Application</h1>
        <p className="text-gray-600">Fill out all required sections to submit your application</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex space-x-4 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
            {steps.map(step => (
              <button
                key={step.id}
                onClick={() => handleStepChange(step.id as ApplicationStep)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                  currentStep === step.id ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg border border-slate-200">
        {/* {currentStep === 'biodata' && <CustomForm />}
        {currentStep === 'ssc' && <CustomForm />}
        {currentStep === 'program-specific' && <CustomForm />} */}
        {currentStep === 'review' && (
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
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
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

            <div className="flex justify-center">
              <button
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold px-8 py-3 rounded-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'review' && (
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              const currentIndex = steps.findIndex(s => s.id === currentStep)
              if (currentIndex > 0) handleStepChange(steps[currentIndex - 1].id as ApplicationStep)
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded transition"
            disabled={currentStep === 'biodata'}
          >
            Previous
          </button>
          <button
            onClick={() => {
              const currentIndex = steps.findIndex(s => s.id === currentStep)
              if (currentIndex < steps.length - 1) handleStepChange(steps[currentIndex + 1].id as ApplicationStep)
            }}
            className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ApplicationPage
