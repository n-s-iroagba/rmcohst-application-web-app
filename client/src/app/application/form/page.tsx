"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, GraduationCap, FileText, Save, Send, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

interface FormData {
  // Personal Information
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  nationality: string
  stateOfOrigin: string
  lga: string
  homeTown: string

  // Contact Information
  phoneNumber: string
  emailAddress: string
  homeAddress: string

  // Next of Kin
  nextOfKinName: string
  nextOfKinPhone: string
  nextOfKinAddress: string
  nextOfKinRelationship: string

  // Academic Information
  programChoice: string
  previousEducation: string
  institutionAttended: string
  graduationYear: string

  // Additional Information
  hasDisability: boolean
  disabilityDetails: string
  hasHealthCondition: boolean
  healthConditionDetails: string
}

export default function ApplicationForm() {
  const [currentSection, setCurrentSection] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    nationality: "Nigerian",
    stateOfOrigin: "",
    lga: "",
    homeTown: "",
    phoneNumber: "",
    emailAddress: "",
    homeAddress: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinAddress: "",
    nextOfKinRelationship: "",
    programChoice: "",
    previousEducation: "",
    institutionAttended: "",
    graduationYear: "",
    hasDisability: false,
    disabilityDetails: "",
    hasHealthCondition: false,
    healthConditionDetails: "",
  })

  const sections = [
    {
      title: "Personal Information",
      icon: User,
      description: "Basic personal details",
    },
    {
      title: "Contact Information",
      icon: Phone,
      description: "Contact details and address",
    },
    {
      title: "Next of Kin",
      icon: User,
      description: "Emergency contact information",
    },
    {
      title: "Academic Background",
      icon: GraduationCap,
      description: "Educational history and program choice",
    },
    {
      title: "Additional Information",
      icon: FileText,
      description: "Health and accessibility information",
    },
  ]

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ]

  const programs = [
    "Nursing",
    "Medical Laboratory Science",
    "Radiography",
    "Physiotherapy",
    "Pharmacy",
    "Public Health",
    "Health Information Management",
    "Environmental Health Science",
  ]

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert("Application saved successfully!")
    }, 1000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/application/documents")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Application Form</h1>
                <p className="text-sm text-gray-500">Complete all sections to proceed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>

              <div className="space-y-2">
                {sections.map((section, index) => {
                  const IconComponent = section.icon
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                        currentSection === index
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-75">{section.description}</div>
                      </div>
                      {currentSection === index && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{sections[currentSection].title}</h2>
                <p className="text-gray-600">{sections[currentSection].description}</p>
              </div>

              {/* Section 0: Personal Information */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => updateFormData("middleName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter middle name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => updateFormData("gender", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                      <select
                        required
                        value={formData.maritalStatus}
                        onChange={(e) => updateFormData("maritalStatus", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                      <input
                        type="text"
                        required
                        value={formData.nationality}
                        onChange={(e) => updateFormData("nationality", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter nationality"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin *</label>
                      <select
                        required
                        value={formData.stateOfOrigin}
                        onChange={(e) => updateFormData("stateOfOrigin", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select state</option>
                        {nigerianStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Local Government Area *</label>
                      <input
                        type="text"
                        required
                        value={formData.lga}
                        onChange={(e) => updateFormData("lga", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter LGA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Home Town *</label>
                      <input
                        type="text"
                        required
                        value={formData.homeTown}
                        onChange={(e) => updateFormData("homeTown", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter home town"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: Contact Information */}
              {currentSection === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.emailAddress}
                        onChange={(e) => updateFormData("emailAddress", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Address *</label>
                    <textarea
                      required
                      value={formData.homeAddress}
                      onChange={(e) => updateFormData("homeAddress", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter your complete home address"
                    />
                  </div>
                </div>
              )}

              {/* Section 2: Next of Kin */}
              {currentSection === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.nextOfKinName}
                        onChange={(e) => updateFormData("nextOfKinName", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter next of kin's full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.nextOfKinPhone}
                        onChange={(e) => updateFormData("nextOfKinPhone", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                    <select
                      required
                      value={formData.nextOfKinRelationship}
                      onChange={(e) => updateFormData("nextOfKinRelationship", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select relationship</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="spouse">Spouse</option>
                      <option value="guardian">Guardian</option>
                      <option value="relative">Relative</option>
                      <option value="friend">Friend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      required
                      value={formData.nextOfKinAddress}
                      onChange={(e) => updateFormData("nextOfKinAddress", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Enter next of kin's complete address"
                    />
                  </div>
                </div>
              )}

              {/* Section 3: Academic Background */}
              {currentSection === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Program Choice *</label>
                    <select
                      required
                      value={formData.programChoice}
                      onChange={(e) => updateFormData("programChoice", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select program</option>
                      {programs.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Previous Education Level *</label>
                      <select
                        required
                        value={formData.previousEducation}
                        onChange={(e) => updateFormData("previousEducation", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select education level</option>
                        <option value="ssce">SSCE/WAEC/NECO</option>
                        <option value="nd">National Diploma (ND)</option>
                        <option value="hnd">Higher National Diploma (HND)</option>
                        <option value="degree">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                      <input
                        type="number"
                        required
                        min="1990"
                        max={new Date().getFullYear()}
                        value={formData.graduationYear}
                        onChange={(e) => updateFormData("graduationYear", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution Attended *</label>
                    <input
                      type="text"
                      required
                      value={formData.institutionAttended}
                      onChange={(e) => updateFormData("institutionAttended", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter name of institution"
                    />
                  </div>
                </div>
              )}

              {/* Section 4: Additional Information */}
              {currentSection === 4 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Important Information</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          This information helps us provide appropriate support and accommodations if needed. All
                          information is kept confidential.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.hasDisability}
                          onChange={(e) => updateFormData("hasDisability", e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I have a disability that may require accommodation
                        </span>
                      </label>
                    </div>

                    {formData.hasDisability && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please describe your disability and any accommodations needed
                        </label>
                        <textarea
                          value={formData.disabilityDetails}
                          onChange={(e) => updateFormData("disabilityDetails", e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Describe your disability and any specific accommodations you may need"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.hasHealthCondition}
                          onChange={(e) => updateFormData("hasHealthCondition", e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I have a health condition that the institution should be aware of
                        </span>
                      </label>
                    </div>

                    {formData.hasHealthCondition && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please describe your health condition
                        </label>
                        <textarea
                          value={formData.healthConditionDetails}
                          onChange={(e) => updateFormData("healthConditionDetails", e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Describe any health conditions we should be aware of"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    currentSection === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {sections.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSection
                          ? "bg-blue-500 w-8"
                          : index < currentSection
                            ? "bg-green-500"
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {currentSection === sections.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-red-600 hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
