import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Filter,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  School,
  Building,
  GraduationCap,
  Shuffle,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Shield
} from 'lucide-react'

// Types
interface Officer {
  id: string
  user: {
    id: string
    lastName: string
    lastName: string
    email: string
  }
  role: string
  isActive: boolean
  currentAssignments?: number
  totalAssignments?: number
}

interface AssignmentPreview {
  totalAvailable: number
  assignedCount: number
  unassignedCount: number
  targetName?: string
  officerName?: string
}

interface AssignmentRequest {
  officerId: string
  assignmentType: 'faculty' | 'department' | 'program' | 'random'
  count: number
  targetId?: string
  academicSessionId?: string
}

interface AssignmentResult {
  success: boolean
  assignedCount: number
  totalRequested: number
  assignedApplications: any[]
  errors: string[]
  message: string
}

interface Faculty {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
  facultyId: string
}

interface Program {
  id: string
  name: string
  departmentId: string
}

type AssignmentType = 'faculty' | 'department' | 'program' | 'random'
type AssignmentStep = 'select_officer' | 'configure' | 'preview' | 'result'

// Custom Hook for Application Assignment Logic
const useApplicationAssignment = () => {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null)
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('random')
  const [targetId, setTargetId] = useState<string>('')
  const [count, setCount] = useState<number>(5)
  const [preview, setPreview] = useState<AssignmentPreview | null>(null)
  const [result, setResult] = useState<AssignmentResult | null>(null)
  const [step, setStep] = useState<AssignmentStep>('select_officer')
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data - replace with actual API calls
  const [faculties] = useState<Faculty[]>([
    { id: '1', name: 'Faculty of Engineering' },
    { id: '2', name: 'Faculty of Medicine' },
    { id: '3', name: 'Faculty of Arts & Sciences' },
    { id: '4', name: 'Faculty of Business' }
  ])

  const [departments] = useState<Department[]>([
    { id: '1', name: 'Computer Science', facultyId: '1' },
    { id: '2', name: 'Mechanical Engineering', facultyId: '1' },
    { id: '3', name: 'Surgery', facultyId: '2' },
    { id: '4', name: 'Pediatrics', facultyId: '2' },
    { id: '5', name: 'English Literature', facultyId: '3' },
    { id: '6', name: 'Business Administration', facultyId: '4' }
  ])

  const [programs] = useState<Program[]>([
    { id: '1', name: 'BSc Computer Science', departmentId: '1' },
    { id: '2', name: 'MSc Computer Science', departmentId: '1' },
    { id: '3', name: 'BEng Mechanical Engineering', departmentId: '2' },
    { id: '4', name: 'MD Surgery', departmentId: '3' },
    { id: '5', name: 'MD Pediatrics', departmentId: '4' },
    { id: '6', name: 'BA English Literature', departmentId: '5' },
    { id: '7', name: 'MBA Business Administration', departmentId: '6' }
  ])

  const loadOfficers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockOfficers: Officer[] = [
        {
          id: '1',
          user: { id: '1', lastName: 'John', lastName: 'Doe', email: 'john.doe@university.edu' },
          role: 'SENIOR_ADMISSION_OFFICER',
          isActive: true,
          currentAssignments: 45,
          totalAssignments: 120
        },
        {
          id: '2',
          user: {
            id: '2',
            lastName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@university.edu'
          },
          role: 'ADMISSION_OFFICER',
          isActive: true,
          currentAssignments: 32,
          totalAssignments: 89
        },
        {
          id: '3',
          user: {
            id: '3',
            lastName: 'Michael',
            lastName: 'Johnson',
            email: 'mike.johnson@university.edu'
          },
          role: 'ADMISSION_OFFICER',
          isActive: true,
          currentAssignments: 28,
          totalAssignments: 75
        },
        {
          id: '4',
          user: {
            id: '4',
            lastName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@university.edu'
          },
          role: 'JUNIOR_ADMISSION_OFFICER',
          isActive: true,
          currentAssignments: 15,
          totalAssignments: 45
        }
      ]
      setOfficers(mockOfficers)
    } catch (err) {
      setError('Failed to load admission officers')
      console.error('Error loading officers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPreview = useCallback(async () => {
    if (!selectedOfficer) return

    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      let targetName = ''
      let totalAvailable = 0

      switch (assignmentType) {
        case 'faculty':
          const faculty = faculties.find((f) => f.id === targetId)
          targetName = faculty?.name || 'Unknown Faculty'
          totalAvailable = Math.floor(Math.random() * 50) + 20
          break
        case 'department':
          const department = departments.find((d) => d.id === targetId)
          targetName = department?.name || 'Unknown Department'
          totalAvailable = Math.floor(Math.random() * 30) + 10
          break
        case 'program':
          const program = programs.find((p) => p.id === targetId)
          targetName = program?.name || 'Unknown Program'
          totalAvailable = Math.floor(Math.random() * 20) + 5
          break
        case 'random':
          targetName = 'Random Assignment'
          totalAvailable = Math.floor(Math.random() * 100) + 50
          break
      }

      const assignedCount = Math.min(count, totalAvailable)
      const unassignedCount = totalAvailable - assignedCount

      setPreview({
        totalAvailable,
        assignedCount,
        unassignedCount,
        targetName,
        officerName: `${selectedOfficer.user.lastName} ${selectedOfficer.user.lastName}`
      })
    } catch (err) {
      setError('Failed to load assignment preview')
      console.error('Error loading preview:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedOfficer, assignmentType, targetId, count, faculties, departments, programs])

  const executeAssignment = useCallback(async () => {
    if (!selectedOfficer || !preview) return

    setAssigning(true)
    setError(null)
    try {
      const request: AssignmentRequest = {
        officerId: selectedOfficer.id,
        assignmentType,
        count,
        targetId: assignmentType !== 'random' ? targetId : undefined
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success/failure
      const success = Math.random() > 0.1 // 90% success rate

      if (success) {
        setResult({
          success: true,
          assignedCount: preview.assignedCount,
          totalRequested: count,
          assignedApplications: [],
          errors: [],
          message: `Successfully assigned ${preview.assignedCount} applications to ${preview.officerName}`
        })
        setStep('result')
      } else {
        throw new Error('Assignment failed due to server error')
      }
    } catch (err) {
      setResult({
        success: false,
        assignedCount: 0,
        totalRequested: count,
        assignedApplications: [],
        errors: [err instanceof Error ? err.message : 'Unknown error occurred'],
        message: 'Assignment failed'
      })
      setStep('result')
    } finally {
      setAssigning(false)
    }
  }, [selectedOfficer, preview, assignmentType, count, targetId])

  const resetAssignment = useCallback(() => {
    setSelectedOfficer(null)
    setAssignmentType('random')
    setTargetId('')
    setCount(5)
    setPreview(null)
    setResult(null)
    setStep('select_officer')
    setError(null)
  }, [])

  const nextStep = useCallback(() => {
    switch (step) {
      case 'select_officer':
        if (selectedOfficer) setStep('configure')
        break
      case 'configure':
        setStep('preview')
        break
      case 'preview':
        executeAssignment()
        break
    }
  }, [step, selectedOfficer, executeAssignment])

  const prevStep = useCallback(() => {
    switch (step) {
      case 'configure':
        setStep('select_officer')
        break
      case 'preview':
        setStep('configure')
        break
      case 'result':
        setStep('preview')
        break
    }
  }, [step])

  return {
    // State
    officers,
    selectedOfficer,
    assignmentType,
    targetId,
    count,
    preview,
    result,
    step,
    loading,
    assigning,
    error,
    faculties,
    departments,
    programs,
    // Actions
    setSelectedOfficer,
    setAssignmentType,
    setTargetId,
    setCount,
    loadOfficers,
    loadPreview,
    executeAssignment,
    resetAssignment,
    nextStep,
    prevStep
  }
}

// Officer Selection Component
const OfficerSelection: React.FC<{
  officers: Officer[]
  selectedOfficer: Officer | null
  onSelect: (officer: Officer) => void
  loading: boolean
}> = ({ officers, selectedOfficer, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        <span className="ml-3 text-gray-600">Loading admission officers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Admission Officer</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {officers.map((officer) => (
          <div
            key={officer.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedOfficer?.id === officer.id
                ? 'border-slate-500 bg-slate-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(officer)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {officer.user.lastName} {officer.user.lastName}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    {officer.user.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Shield className="h-3 w-3" />
                    {officer.role.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {officer.currentAssignments || 0} / {officer.totalAssignments || 0}
                </div>
                <div className="text-xs text-gray-500">Current / Total</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Assignment Configuration Component
const AssignmentConfiguration: React.FC<{
  assignmentType: AssignmentType
  targetId: string
  count: number
  faculties: Faculty[]
  departments: Department[]
  programs: Program[]
  onAssignmentTypeChange: (type: AssignmentType) => void
  onTargetIdChange: (id: string) => void
  onCountChange: (count: number) => void
}> = ({
  assignmentType,
  targetId,
  count,
  faculties,
  departments,
  programs,
  onAssignmentTypeChange,
  onTargetIdChange,
  onCountChange
}) => {
  const getTargetOptions = () => {
    switch (assignmentType) {
      case 'faculty':
        return faculties
      case 'department':
        return departments
      case 'program':
        return programs
      default:
        return []
    }
  }

  const getIcon = () => {
    switch (assignmentType) {
      case 'faculty':
        return <School className="h-5 w-5" />
      case 'department':
        return <Building className="h-5 w-5" />
      case 'program':
        return <GraduationCap className="h-5 w-5" />
      case 'random':
        return <Shuffle className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-gray-900">Configure Assignment</h3>
      </div>

      {/* Assignment Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Assignment Type</label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { value: 'faculty', label: 'Faculty', icon: <School className="h-4 w-4" /> },
            { value: 'department', label: 'Department', icon: <Building className="h-4 w-4" /> },
            { value: 'program', label: 'Program', icon: <GraduationCap className="h-4 w-4" /> },
            { value: 'random', label: 'Random', icon: <Shuffle className="h-4 w-4" /> }
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              className={`p-3 rounded-lg border-2 transition-all ${
                assignmentType === type.value
                  ? 'border-slate-500 bg-slate-50 text-slate-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              onClick={() => {
                onAssignmentTypeChange(type.value as AssignmentType)
                onTargetIdChange('')
              }}
            >
              <div className="flex flex-col items-center gap-2">
                {type.icon}
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Target Selection */}
      {assignmentType !== 'random' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select {assignmentType.charAt(0).toUpperCase() + assignmentType.slice(1)}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getIcon()}
            </div>
            <select
              value={targetId}
              onChange={(e) => onTargetIdChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              required
            >
              <option value="">Select {assignmentType}...</option>
              {getTargetOptions().map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Count Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Applications to Assign
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => onCountChange(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          min="1"
          max="100"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        />
        <p className="mt-1 text-sm text-gray-500">Maximum 100 applications per assignment</p>
      </div>
    </div>
  )
}

// Assignment Preview Component
const AssignmentPreview: React.FC<{
  preview: AssignmentPreview | null
  loading: boolean
}> = ({ preview, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        <span className="ml-3 text-gray-600">Loading assignment preview...</span>
      </div>
    )
  }

  if (!preview) {
    return <div className="text-center py-12 text-gray-500">No preview available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-gray-900">Assignment Preview</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Assignment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Officer:</span>
                <span className="font-medium">{preview.officerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium">{preview.targetName}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Assignment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Available:</span>
                <span className="font-medium">{preview.totalAvailable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Will be Assigned:</span>
                <span className="font-medium text-green-600">{preview.assignedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-medium">{preview.unassignedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {preview.assignedCount < preview.totalAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Partial Assignment</h4>
              <p className="text-sm text-yellow-700">
                Only {preview.assignedCount} out of {preview.totalAvailable} available applications
                will be assigned.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Assignment Result Component
const AssignmentResult: React.FC<{
  result: AssignmentResult | null
  onReset: () => void
}> = ({ result, onReset }) => {
  if (!result) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        {result.success ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Assignment Successful!</h3>
            <p className="text-gray-600">{result.message}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Assignment Failed</h3>
            <p className="text-gray-600">{result.message}</p>
            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Assignment Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Requested:</span>
            <span className="font-medium">{result.totalRequested}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Assigned:</span>
            <span className={`font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.assignedCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Create New Assignment
        </button>
      </div>
    </div>
  )
}

// Main Component
const ApplicationAssignmentInterface: React.FC = () => {
  const {
    officers,
    selectedOfficer,
    assignmentType,
    targetId,
    count,
    preview,
    result,
    step,
    loading,
    assigning,
    error,
    faculties,
    departments,
    programs,
    setSelectedOfficer,
    setAssignmentType,
    setTargetId,
    setCount,
    loadOfficers,
    loadPreview,
    resetAssignment,
    nextStep,
    prevStep
  } = useApplicationAssignment()

  useEffect(() => {
    loadOfficers()
  }, [loadOfficers])

  useEffect(() => {
    if (step === 'preview') {
      loadPreview()
    }
  }, [step, loadPreview])

  const canProceed = () => {
    switch (step) {
      case 'select_officer':
        return selectedOfficer !== null
      case 'configure':
        return assignmentType === 'random' || targetId !== ''
      case 'preview':
        return preview !== null
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'select_officer':
        return 'Select Officer'
      case 'configure':
        return 'Configure Assignment'
      case 'preview':
        return 'Preview Assignment'
      case 'result':
        return 'Assignment Result'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Assignment System</h1>
        <p className="text-gray-600">
          Assign applications to admission officers based on faculty, department, program, or
          randomly
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['select_officer', 'configure', 'preview', 'result'].map((stepName, index) => (
            <div key={stepName} className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName
                    ? 'bg-slate-600 text-white'
                    : ['select_officer', 'configure', 'preview', 'result'].indexOf(step) > index
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    ['select_officer', 'configure', 'preview', 'result'].indexOf(step) > index
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">{getStepTitle()}</h2>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-8">
        {step === 'select_officer' && (
          <OfficerSelection
            officers={officers}
            selectedOfficer={selectedOfficer}
            onSelect={setSelectedOfficer}
            loading={loading}
          />
        )}

        {step === 'configure' && (
          <AssignmentConfiguration
            assignmentType={assignmentType}
            targetId={targetId}
            count={count}
            faculties={faculties}
            departments={departments}
            programs={programs}
            onAssignmentTypeChange={setAssignmentType}
            onTargetIdChange={setTargetId}
            onCountChange={setCount}
          />
        )}

        {step === 'preview' && <AssignmentPreview preview={preview} loading={loading} />}

        {step === 'result' && <AssignmentResult result={result} onReset={resetAssignment} />}
      </div>

      {/* Navigation Buttons */}
      {step !== 'result' && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 'select_officer'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              step === 'select_officer'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed() || loading || assigning}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
              canProceed() && !loading && !assigning
                ? 'bg-slate-600 text-white hover:bg-slate-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {assigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : step === 'preview' ? (
              <>
                <Send className="h-4 w-4" />
                Execute Assignment
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ApplicationAssignmentInterface
