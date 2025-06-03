"use client"

import { useState } from "react"
import {
  Shield,
  Users,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Mail,
  CreditCard,
  UserPlus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"

export default function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const systemStats = [
    { label: "Total Users", value: "3,247", icon: Users, color: "blue", change: "+12%" },
    { label: "System Uptime", value: "99.9%", icon: Activity, color: "green", change: "+0.1%" },
    { label: "Active Sessions", value: "156", icon: Clock, color: "yellow", change: "+8%" },
    { label: "Security Alerts", value: "3", icon: AlertTriangle, color: "red", change: "-2" },
  ]

  const userRoles = [
    { role: "Super Admin", count: 2, permissions: "Full Access" },
    { role: "Head of Admissions", count: 3, permissions: "Admissions Management" },
    { role: "Admission Officer", count: 12, permissions: "Application Review" },
    { role: "Applicants", count: 3230, permissions: "Application Submission" },
  ]

  const systemServices = [
    { service: "Database", status: "healthy", uptime: "99.9%", lastCheck: "2 min ago" },
    { service: "Email Service", status: "warning", uptime: "98.5%", lastCheck: "5 min ago" },
    { service: "Payment Gateway", status: "healthy", uptime: "99.8%", lastCheck: "1 min ago" },
    { service: "File Storage", status: "healthy", uptime: "99.7%", lastCheck: "3 min ago" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Administrator</h1>
            <p className="text-gray-600 mt-2">System management and configuration</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">System Healthy</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              SA
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "users", label: "User Management", icon: Users },
            { id: "system", label: "System Health", icon: Server },
            { id: "audit", label: "Audit Logs", icon: Shield },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeSection === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* System Services Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemServices.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{service.service}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}
                      >
                        {getStatusIcon(service.status)}
                        <span className="ml-1">{service.status}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Uptime: {service.uptime}</p>
                      <p>Last Check: {service.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Section */}
        {activeSection === "users" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Roles & Permissions</h2>
                <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-red-700 transition-all flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userRoles.map((role, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Shield className="w-5 h-5 text-blue-600 mr-3" />
                            <span className="text-sm font-medium text-gray-900">{role.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {role.count.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{role.permissions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* System Health Section */}
        {activeSection === "system" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <Database className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Database</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Status:</span> <span className="text-green-600 font-medium">Healthy</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Connections:</span> <span>45/100</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Storage:</span> <span>2.3GB/10GB</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Email Service</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Status:</span> <span className="text-yellow-600 font-medium">Warning</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Queue:</span> <span>23 pending</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sent Today:</span> <span>1,247</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Payment Gateway</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span>Status:</span> <span className="text-green-600 font-medium">Active</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Success Rate:</span> <span>99.2%</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Today's Revenue:</span> <span>₦2.4M</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium">Maintenance Mode</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium">Auto Backup</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium">Two-Factor Auth</span>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm font-medium">Session Timeout</span>
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
