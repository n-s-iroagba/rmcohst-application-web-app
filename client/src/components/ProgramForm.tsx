'use client'

import { API_ROUTES } from '@/constants/apiRoutes'
import { FullProgram } from '@/types/program'
import { Grade } from '@/types/program_ssc_requirement'
import { SSCSubject } from '@/types/ssc_subject'
import React, { useState } from 'react'

import { useGet } from '../hooks/useApiQuery'
import { DepartmentWithFaculty } from '../types/department'
import { QualificationType } from './SSCQualificationForm'

// ... your existing enums and interfaces ...

interface Props {
    program?: FullProgram
    onSubmit: (data: any) => void
    onCancel?: () => void
}

export enum ProgramLevel {
    OND = 'OND',
    HND = 'HND',
    CERTIFICATE = 'Certificate'
}

export enum DurationType {
    WEEK = 'WEEK',
    MONTH = 'MONTH',
    YEAR = 'YEAR'
}

// Define proper form data type
interface FormData {
    // Basic Program Info
    departmentId: string | number
    name: string
    level: ProgramLevel
    durationType: string
    duration: number
    applicationFeeInNaira: number
    acceptanceFeeInNaira: number
    description: string
    isActive: boolean

    // SSC Requirements
    sscRequirements: {
        tag: string
        maximumNumberOfSittings: string
        qualificationTypes: string[]
        firstSubject: string
        firstSubjectGrade: Grade
        secondSubject: string
        secondSubjectGrade: Grade
        thirdSubject: string
        alternateThirdSubject: string
        thirdSubjectGrade: Grade
        fourthSubject: string
        alternateFourthSubject: string
        fourthSubjectGrade: Grade
        fifthSubject: string | null
        alternateFifthSubject: string
        fifthSubjectGrade: Grade
    }

    // Specific Requirements
    hasSpecificRequirements: boolean
    specificRequirements: {
        tag: string
        qualificationTypes: string[]
        minimumGrade: string
    }
}

const ProgramForm: React.FC<Props> = ({ program, onSubmit, onCancel }) => {
    const { resourceData: subjects } = useGet<SSCSubject[]>(API_ROUTES.SUBJECT.LIST)
    const { resourceData: departments } = useGet<DepartmentWithFaculty[]>(API_ROUTES.DEPARTMENT.LIST)

    const grades = Object.values(Grade)
    const certificates = Object.values(QualificationType)
    const levels = Object.values(ProgramLevel)
    const durationTypes = Object.values(DurationType)

    const [formData, setFormData] = useState<FormData>({
        // Basic Program Info
        departmentId: program?.departmentId || '',
        name: program?.name || '',
        level: program?.level || ProgramLevel.OND,
        durationType: program?.durationType || DurationType.YEAR,
        duration: program?.duration || 4,
        applicationFeeInNaira: program?.applicationFeeInNaira || 0,
        acceptanceFeeInNaira: program?.acceptanceFeeInNaira || 0,
        description: program?.description || '',
        isActive: program?.isActive ?? true,

        // SSC Requirements
        sscRequirements: {
            tag: program?.sscRequirements?.tag || '',
            maximumNumberOfSittings: program?.sscRequirements?.maximumNumberOfSittings || '1',
            qualificationTypes: program?.sscRequirements?.qualificationTypes || [],
            firstSubject: program?.sscRequirements?.firstSubject || '',
            firstSubjectGrade: program?.sscRequirements?.firstSubjectGrade || Grade.C6,
            secondSubject: program?.sscRequirements?.secondSubject || '',
            secondSubjectGrade: program?.sscRequirements?.secondSubjectGrade || Grade.C6,
            thirdSubject: program?.sscRequirements?.thirdSubject || '',
            alternateThirdSubject: program?.sscRequirements?.alternateThirdSubject || '',
            thirdSubjectGrade: program?.sscRequirements?.thirdSubjectGrade || Grade.C6,
            fourthSubject: program?.sscRequirements?.fourthSubject || '',
            alternateFourthSubject: program?.sscRequirements?.alternateFourthSubject || '',
            fourthSubjectGrade: program?.sscRequirements?.fourthSubjectGrade || Grade.C6,
            fifthSubject: program?.sscRequirements?.fifthSubject || '',
            alternateFifthSubject: program?.sscRequirements?.alternateFifthSubject || '',
            fifthSubjectGrade: program?.sscRequirements?.fifthSubjectGrade || Grade.C6,
        },

        // Specific Requirements
        hasSpecificRequirements: !!program?.specificRequirements,
        specificRequirements: {
            tag: program?.specificRequirements?.tag || '',
            qualificationTypes: program?.specificRequirements?.qualificationTypes || [],
            minimumGrade: program?.specificRequirements?.minimumGrade || '',
        },
    })

    // Type-safe input change handler
    const handleInputChange = (
        section: 'sscRequirements' | 'specificRequirements',
        field: string,
        value: any
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    // Type-safe array toggle handler
    const handleArrayToggle = (
        section: 'sscRequirements' | 'specificRequirements',
        field: 'qualificationTypes',
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: prev[section][field].includes(value)
                    ? prev[section][field].filter(item => item !== value)
                    : [...prev[section][field], value]
            }
        }))
    }

    // Handler for basic form fields
    const handleBasicFieldChange = (field: keyof Omit<FormData, 'sscRequirements' | 'specificRequirements' | 'hasSpecificRequirements'>, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handler for hasSpecificRequirements toggle
    const handleSpecificRequirementsToggle = (value: boolean) => {
        setFormData(prev => ({
            ...prev,
            hasSpecificRequirements: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            specificRequirements: formData.hasSpecificRequirements ? formData.specificRequirements : null
        }

        onSubmit(submitData)
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {program ? 'Edit Program' : 'Create New Program'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Configure program details, SSC requirements, and specific requirements
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Program Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                            Basic Program Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Department *
                                </label>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => handleBasicFieldChange('departmentId', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments?.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name} - {dept.faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Program Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Program Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleBasicFieldChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    placeholder="Enter program name"
                                    required
                                />
                            </div>

                            {/* Level */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Level *
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleBasicFieldChange('level', e.target.value as ProgramLevel)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    required
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => handleBasicFieldChange('duration', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                        min="1"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Duration Type
                                    </label>
                                    <select
                                        value={formData.durationType}
                                        onChange={(e) => handleBasicFieldChange('durationType', e.target.value as DurationType)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        {durationTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Fees */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Application Fee (₦)
                                </label>
                                <input
                                    type="number"
                                    value={formData.applicationFeeInNaira}
                                    onChange={(e) => handleBasicFieldChange('applicationFeeInNaira', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Acceptance Fee (₦)
                                </label>
                                <input
                                    type="number"
                                    value={formData.acceptanceFeeInNaira}
                                    onChange={(e) => handleBasicFieldChange('acceptanceFeeInNaira', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleBasicFieldChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    placeholder="Program description..."
                                />
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => handleBasicFieldChange('isActive', e.target.checked)}
                                        className="rounded border-slate-300 text-crimson-600 focus:ring-crimson-500"
                                    />
                                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                        Program is active and accepting applications
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SSC Requirements */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                            SSC Requirements
                        </h2>

                        <div className="space-y-6">
                            {/* Tag and Maximum Sittings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Requirement Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sscRequirements.tag}
                                        onChange={(e) => handleInputChange('sscRequirements', 'tag', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                        placeholder="e.g., SCIENCE_REQUIREMENTS"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Maximum Number of Sittings
                                    </label>
                                    <select
                                        value={formData.sscRequirements.maximumNumberOfSittings}
                                        onChange={(e) => handleInputChange('sscRequirements', 'maximumNumberOfSittings', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                    >
                                        <option value="1">1 Sitting</option>
                                        <option value="2">2 Sittings</option>
                                    </select>
                                </div>
                            </div>

                            {/* Qualification Types */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Accepted Qualification Types
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {certificates.map(cert => (
                                        <label key={cert} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.sscRequirements.qualificationTypes.includes(cert)}
                                                onChange={() => handleArrayToggle('sscRequirements', 'qualificationTypes', cert)}
                                                className="rounded border-slate-300 text-crimson-600 focus:ring-crimson-500"
                                            />
                                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Subject Requirements - Updated with proper handlers */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Subject Requirements</h3>

                                {/* First Subject */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            First Subject *
                                        </label>
                                        <select
                                            value={formData.sscRequirements.firstSubject}
                                            onChange={(e) => handleInputChange('sscRequirements', 'firstSubject', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects?.map(subject => (
                                                <option key={subject.id} value={subject.name}>{subject.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Minimum Grade
                                        </label>
                                        <select
                                            value={formData.sscRequirements.firstSubjectGrade}
                                            onChange={(e) => handleInputChange('sscRequirements', 'firstSubjectGrade', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                        >
                                            {grades.map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Add similar pattern for other subjects... */}
                                {/* Second Subject */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Second Subject *
                                        </label>
                                        <select
                                            value={formData.sscRequirements.secondSubject}
                                            onChange={(e) => handleInputChange('sscRequirements', 'secondSubject', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects?.map(subject => (
                                                <option key={subject.id} value={subject.name}>{subject.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Minimum Grade
                                        </label>
                                        <select
                                            value={formData.sscRequirements.secondSubjectGrade}
                                            onChange={(e) => handleInputChange('sscRequirements', 'secondSubjectGrade', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                        >
                                            {grades.map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Continue with other subjects using the same pattern... */}
                            </div>
                        </div>
                    </div>

                    {/* Specific Requirements Toggle */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                Specific Requirements
                            </h2>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.hasSpecificRequirements}
                                    onChange={(e) => handleSpecificRequirementsToggle(e.target.checked)}
                                    className="rounded border-slate-300 text-crimson-600 focus:ring-crimson-500"
                                />
                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                    Enable Specific Requirements
                                </span>
                            </label>
                        </div>

                        {formData.hasSpecificRequirements && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Requirement Tag
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.specificRequirements.tag}
                                            onChange={(e) => handleInputChange('specificRequirements', 'tag', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                            placeholder="e.g., DIRECT_ENTRY_REQUIREMENTS"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Minimum Grade
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.specificRequirements.minimumGrade}
                                            onChange={(e) => handleInputChange('specificRequirements', 'minimumGrade', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-crimson-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                            placeholder="e.g., Upper Credit"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Accepted Qualification Types
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {certificates.map(cert => (
                                            <label key={cert} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.specificRequirements.qualificationTypes.includes(cert)}
                                                    onChange={() => handleArrayToggle('specificRequirements', 'qualificationTypes', cert)}
                                                    className="rounded border-slate-300 text-crimson-600 focus:ring-crimson-500"
                                                />
                                                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">{cert}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-crimson-600 hover:bg-crimson-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                        >
                            {program ? 'Update Program' : 'Create Program'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProgramForm