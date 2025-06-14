"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Shield, GraduationCap } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext" // Import useAuth

type UserType = "applicant" | "admin" | "hoa" | "super-admin"

// This mapping helps determine the redirect path based on the actual role from the backend
const roleRedirectPaths: Record<string, string> = {
  APPLICANT: "/dashboard/applicant",
  ADMIN: "/dashboard/admin",
  HEAD_OF_ADMISSIONS: "/dashboard/hoa",
  SUPER_ADMIN: "/dashboard/super-admin",
}

export default function LoginPage() {
  const [selectedUserTypeUI, setSelectedUserTypeUI] = useState<UserType>("applicant") // For UI selection
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // For displaying login errors
  const router = useRouter()
  const auth = useAuth()

  const userTypeConfig = {
    applicant: {
      title: "Student Portal",
      subtitle: "Access your application dashboard",
      icon: GraduationCap,
      gradient: "from-blue-600 to-blue-800",
    },
    admin: {
      title: "Staff Portal",
      subtitle: "Admissions officer access",
      icon: User,
      gradient: "from-red-600 to-red-800",
    },
    hoa: {
      title: "Management Portal",
      subtitle: "Head of admissions access",
      icon: Shield,
      gradient: "from-purple-600 to-purple-800",
    },
    "super-admin": {
      title: "System Portal",
      subtitle: "Super administrator access",
      icon: Shield,
      gradient: "from-gray-700 to-gray-900",
    },
  }

  const currentUIConfig = userTypeConfig[selectedUserTypeUI]
  const IconComponent = currentUIConfig.icon

  useEffect(() => {
    if (auth.user) {
      const redirectPath = roleRedirectPaths[auth.user.role] || "/dashboard/applicant" // Default redirect
      router.push(redirectPath)
    }
  }, [auth.user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Clear previous errors

    await auth.login({ email: formData.email, password: formData.password })
    // Error handling and redirection are now managed by useAuth and the useEffect above
    // auth.error will be set by AuthProvider if login fails
    setLoading(false) // AuthProvider will set its own loading state, this is for the button
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative flex min-h-screen">
        <div
          className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${currentUIConfig.gradient} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="animate-float">
              <IconComponent className="w-16 h-16 mb-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Remington College</h1>
            <p className="text-xl mb-8 text-white/90">Health Sciences and Technology</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Secure and reliable platform</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Real-time application tracking</span>
              </div>
            </div>
          </div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-32 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-6">Choose your portal to continue</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(userTypeConfig).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedUserTypeUI(type as UserType)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedUserTypeUI === type
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{config.title}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <IconComponent className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">{currentUIConfig.title}</h3>
                <p className="text-gray-600 text-sm">{currentUIConfig.subtitle}</p>
              </div>

              {auth.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
                  {auth.error}
                </div>
              )}
              {error && ( // Display local errors if any (e.g. validation before submit)
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    href="/auth/forgot-password" // Consider making this path dynamic or a config
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || auth.loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    loading || auth.loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${currentUIConfig.gradient} hover:shadow-lg transform hover:-translate-y-0.5`
                  }`}
                >
                  {loading || auth.loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {selectedUserTypeUI === "applicant" && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/applicant/register" // Changed from /auth/register to match file structure
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Apply Now
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
