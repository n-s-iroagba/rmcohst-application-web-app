"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  Download,
  Filter,
  Eye,
} from "lucide-react"

export default function HeadOfAdmissionsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const overviewStats = [
    { label: "Total Applications", value: "2,847", change: "+12%", icon: FileText, color: "blue" },
    { label: "Admission Rate", value: "68%", change: "+5%", icon: TrendingUp, color: "green" },
    { label: "Active Programs", value: "24", change: "0%", icon: GraduationCap, color: "purple" },
    { label: "Staff Members", value: "18", change: "+2", icon: Users, color: "orange" },
  ]

  const programStats = [
    { program: "Computer Science", applications: 456, admitted: 298, rate: "65%" },
    { program: "Nursing", applications: 389, admitted: 278, rate: "71%" },
    { program: "Engineering", applications: 334, admitted: 201, rate: "60%" },
    { program: "Business Admin", applications: 298, admitted: 209, rate: "70%" },
    { program: "Medicine", applications: 567, admitted: 340, rate: "60%" },
  ]

  const recentActivities = [
    { action: "Application approved", user: "Dr. Sarah Johnson", time: "2 hours ago", type: "approval" },
    { action: "New application received", user: "System", time: "3 hours ago", type: "new" },
    { action: "Document verified", user: "John Smith", time: "5 hours ago", type: "verification" },
    { action: "Interview scheduled", user: "Dr. Mike Wilson", time: "1 day ago", type: "interview" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Head of Admissions Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of admissions performance and analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="current">Current Session</option>
              <option value="previous">Previous Session</option>
              <option value="all">All Time</option>
            </select>
            <button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-red-700 transition-all">
              Generate Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span
                  className={`text-sm font-semibold ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Program Performance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Program Performance</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Program</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Applications</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Admitted</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Rate</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {programStats.map((program, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-sm font-medium text-gray-900">{program.program}</td>
                        <td className="py-4 text-sm text-gray-600">{program.applications}</td>
                        <td className="py-4 text-sm text-gray-600">{program.admitted}</td>
                        <td className="py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {program.rate}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Trends</h2>
              <div className="h-64 bg-gradient-to-r from-blue-100 to-red-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chart visualization would be implemented here</p>
                  <p className="text-sm text-gray-500">Using libraries like Chart.js or Recharts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "approval"
                          ? "bg-green-500"
                          : activity.type === "new"
                            ? "bg-blue-500"
                            : activity.type === "verification"
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Users className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium">Manage Capacity</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Schedule Interview</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <FileText className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Generate Report</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium">System Settings</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Application Portal</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Delayed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
