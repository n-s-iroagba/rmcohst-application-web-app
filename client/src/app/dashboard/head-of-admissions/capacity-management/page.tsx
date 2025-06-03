"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, AlertTriangle, CheckCircle, Edit, X } from "lucide-react"

interface DepartmentCapacity {
  id: string
  name: string
  totalCapacity: number
  currentAdmissions: number
  pendingApplications: number
  availableSlots: number
  utilizationRate: number
  programs: Program[]
}

interface Program {
  id: string
  name: string
  capacity: number
  admitted: number
  pending: number
}

export default function CapacityManagementPage() {
  const [departments, setDepartments] = useState<DepartmentCapacity[]>([])
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartmentCapacities()
  }, [])

  const fetchDepartmentCapacities = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setDepartments([
          {
            id: "1",
            name: "Medical Laboratory Science",
            totalCapacity: 100,
            currentAdmissions: 85,
            pendingApplications: 25,
            availableSlots: 15,
            utilizationRate: 85,
            programs: [
              { id: "1", name: "Medical Laboratory Technology", capacity: 60, admitted: 52, pending: 15 },
              { id: "2", name: "Medical Laboratory Science", capacity: 40, admitted: 33, pending: 10 },
            ],
          },
          {
            id: "2",
            name: "Nursing",
            totalCapacity: 120,
            currentAdmissions: 95,
            pendingApplications: 40,
            availableSlots: 25,
            utilizationRate: 79,
            programs: [
              { id: "3", name: "Nursing Science", capacity: 80, admitted: 65, pending: 25 },
              { id: "4", name: "Midwifery", capacity: 40, admitted: 30, pending: 15 },
            ],
          },
          {
            id: "3",
            name: "Radiography",
            totalCapacity: 60,
            currentAdmissions: 58,
            pendingApplications: 15,
            availableSlots: 2,
            utilizationRate: 97,
            programs: [
              { id: "5", name: "Diagnostic Radiography", capacity: 40, admitted: 39, pending: 10 },
              { id: "6", name: "Therapeutic Radiography", capacity: 20, admitted: 19, pending: 5 },
            ],
          },
        ])
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching capacities:", error)
      setLoading(false)
    }
  }

  const updateDepartmentCapacity = async (departmentId: string, newCapacity: number) => {
    try {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === departmentId
            ? {
                ...dept,
                totalCapacity: newCapacity,
                availableSlots: newCapacity - dept.currentAdmissions,
                utilizationRate: Math.round((dept.currentAdmissions / newCapacity) * 100),
              }
            : dept,
        ),
      )
      setEditingDepartment(null)
    } catch (error) {
      console.error("Error updating capacity:", error)
    }
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 95) return "text-red-600 bg-red-100"
    if (rate >= 80) return "text-yellow-600 bg-yellow-100"
    return "text-green-600 bg-green-100"
  }

  const getUtilizationIcon = (rate: number) => {
    if (rate >= 95) return AlertTriangle
    if (rate >= 80) return TrendingUp
    return CheckCircle
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading capacity data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Capacity Management</h1>
          <p className="text-gray-600">Monitor and manage admission capacities across all departments</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.totalCapacity, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Admissions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.currentAdmissions, 0)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.pendingApplications, 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Slots</p>
                <p className="text-3xl font-bold text-gray-900">
                  {departments.reduce((sum, dept) => sum + dept.availableSlots, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Department Cards */}
        <div className="space-y-6">
          {departments.map((department) => {
            const UtilizationIcon = getUtilizationIcon(department.utilizationRate)
            const isEditing = editingDepartment === department.id

            return (
              <div key={department.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Department Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold text-gray-900">{department.name}</h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUtilizationColor(department.utilizationRate)}`}
                      >
                        <UtilizationIcon className="w-4 h-4 mr-1" />
                        {department.utilizationRate}% Utilized
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue={department.totalCapacity}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                const newCapacity = Number.parseInt((e.target as HTMLInputElement).value)
                                updateDepartmentCapacity(department.id, newCapacity)
                              }
                            }}
                          />
                          <button
                            onClick={() => setEditingDepartment(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingDepartment(department.id)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Capacity
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Capacity Overview */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{department.totalCapacity}</p>
                      <p className="text-sm text-gray-600">Total Capacity</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{department.currentAdmissions}</p>
                      <p className="text-sm text-gray-600">Admitted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{department.pendingApplications}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{department.availableSlots}</p>
                      <p className="text-sm text-gray-600">Available</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          department.utilizationRate >= 95
                            ? "bg-red-500"
                            : department.utilizationRate >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${department.utilizationRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Programs Breakdown */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Program Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {department.programs.map((program) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{program.name}</h5>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">{program.capacity}</p>
                            <p className="text-gray-600">Capacity</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-green-600">{program.admitted}</p>
                            <p className="text-gray-600">Admitted</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-yellow-600">{program.pending}</p>
                            <p className="text-gray-600">Pending</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${(program.admitted / program.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
