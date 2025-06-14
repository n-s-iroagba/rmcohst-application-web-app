// Ensure this file (client/src/services/application.service.ts) has these named exports:
// getMyApplications, getMyApplication, submitFinalApplication, getApplicationDetailsForAdmin
import type { Application } from "@/types/application"
import { apiClient } from "@/utils/Api.utils"

interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

interface PaginatedApplicationsResponse {
  applications: Application[] // Or ApplicationAttributes[] depending on what admin list needs
  total: number
  page: number
  limit: number
  totalPages?: number
}

export const getMyApplications = async (): Promise<ApiResponse<Application[]>> => {
  try {
    const response = await apiClient.get<{ data: Application[] }>("/applications/my-applications")
    return { data: response.data.data }
  } catch (error: any) {
    return { data: [], error: error.response?.data?.message || "Failed to fetch your applications." }
  }
}

// This might be the one for the review page, fetching a single detailed application
export const getMyApplication = async (): Promise<ApiResponse<Application>> => {
  try {
    // Endpoint should return the single, most relevant, fully populated application for the current user
    const response = await apiClient.get<{ data: Application }>("/applications/my-current-detailed")
    return { data: response.data.data }
  } catch (error: any) {
    return {
      data: {} as Application,
      error: error.response?.data?.message || "Failed to fetch your current application details.",
    }
  }
}

export const submitFinalApplication = async (
  applicationId: string,
): Promise<ApiResponse<{ message: string; application: Application }>> => {
  try {
    const response = await apiClient.post<{ message: string; data: Application }>(
      `/applications/${applicationId}/submit-final`, // Ensure endpoint matches server
    )
    return { data: { message: response.data.message, application: response.data.data }, message: response.data.message }
  } catch (error: any) {
    return {
      data: { message: "", application: {} as Application },
      error: error.response?.data?.message || "Failed to submit application.",
    }
  }
}

// For admin to get details of a specific application
export const getApplicationDetailsForAdmin = async (applicationId: string): Promise<ApiResponse<Application>> => {
  try {
    // Endpoint should return a fully populated Application object
    const response = await apiClient.get<{ data: Application }>(`/applications/admin/${applicationId}/details`)
    return { data: response.data.data }
  } catch (error: any) {
    return {
      data: {} as Application,
      error: error.response?.data?.message || "Failed to fetch application details for admin.",
    }
  }
}

// Other functions like getAdminApplications, updateApplicationStatus, etc. would go here
// Example:
export const getAdminApplicationsList = async (
  filters: { status?: string; academicSessionId?: string; page?: number; limit?: number } = {},
): Promise<ApiResponse<PaginatedApplicationsResponse>> => {
  try {
    const response = await apiClient.get<{ data: PaginatedApplicationsResponse }>("/applications/admin", {
      params: filters,
    })
    return { data: response.data.data }
  } catch (error: any) {
    return {
      data: { applications: [], total: 0, page: 1, limit: 10 },
      error: error.response?.data?.message || "Failed to fetch admin applications.",
    }
  }
}
