import type { BiodataAttributes, EditBiodataAttributes } from "@/types/biodata"
import { apiClient } from "@/utils/Api.utils" // Ensure apiClient is a named export

interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export const getBiodataByApplicationId = async (applicationId: string): Promise<ApiResponse<BiodataAttributes>> => {
  try {
    const response = await apiClient.get<{ data: BiodataAttributes }>(`/biodata/application/${applicationId}`)
    return { data: response.data.data }
  } catch (error: any) {
    return {
      data: {} as BiodataAttributes,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to fetch biodata for application ${applicationId}`,
    }
  }
}

export const updateBiodataByApplicationId = async (
  applicationId: string,
  data: Partial<EditBiodataAttributes> | FormData,
  isFormData = false,
): Promise<ApiResponse<BiodataAttributes>> => {
  try {
    const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    const response = await apiClient.put<{ data: BiodataAttributes; message?: string }>(
      `/biodata/application/${applicationId}`,
      data,
      config,
    )
    return { data: response.data.data, message: response.data.message }
  } catch (error: any) {
    return {
      data: {} as BiodataAttributes,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to update biodata for application ${applicationId}`,
    }
  }
}
