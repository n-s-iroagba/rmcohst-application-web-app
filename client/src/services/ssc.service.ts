import type { ApplicantSSCQualificationAttributes } from "@/types/applicant_ssc_qualification"
import { apiClient } from "@/utils/Api.utils" // Ensure apiClient is a named export

interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export const getSscQualificationByApplicationId = async (
  applicationId: string,
): Promise<ApiResponse<ApplicantSSCQualificationAttributes>> => {
  try {
    const response = await apiClient.get<{ data: ApplicantSSCQualificationAttributes }>(
      `/ssc/application/${applicationId}`,
    )
    return { data: response.data.data }
  } catch (error: any) {
    return {
      data: {} as ApplicantSSCQualificationAttributes,
      error: error.response?.data?.message || error.response?.data?.error || "Failed to fetch SSC qualification.",
    }
  }
}

export const createOrUpdateSscQualification = async (
  applicationId: string,
  data: FormData,
): Promise<ApiResponse<ApplicantSSCQualificationAttributes>> => {
  try {
    const response = await apiClient.post<{ data: ApplicantSSCQualificationAttributes; message?: string }>(
      `/ssc/application/${applicationId}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    )
    return { data: response.data.data, message: response.data.message }
  } catch (error: any) {
    return {
      data: {} as ApplicantSSCQualificationAttributes,
      error:
        error.response?.data?.message || error.response?.data?.error || "Failed to create/update SSC qualification.",
    }
  }
}
