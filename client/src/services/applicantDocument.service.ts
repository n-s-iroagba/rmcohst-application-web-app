// Ensure this file (client/src/services/applicantDocument.service.ts) has these named exports:
// uploadApplicantDocument, getApplicantDocuments, deleteApplicantDocument
import type { ApplicantDocumentAttributes } from "@/types/applicant_document"
import { apiClient } from "@/utils/Api.utils"

interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export const uploadApplicantDocument = async (
  applicationId: string,
  formData: FormData, // FormData should contain the file and documentType
): Promise<ApiResponse<ApplicantDocumentAttributes>> => {
  try {
    // The backend endpoint might be /applications/:applicationId/documents
    // or a dedicated /applicant-documents route that takes applicationId in the body/form-data
    const response = await apiClient.post<{ data: ApplicantDocumentAttributes; message: string }>(
      `/applicant-documents/application/${applicationId}`, // Adjust endpoint as per your server routes
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    )
    return { data: response.data.data, message: response.data.message }
  } catch (error: any) {
    return {
      data: {} as ApplicantDocumentAttributes,
      error: error.response?.data?.message || "Failed to upload document.",
    }
  }
}

export const getApplicantDocuments = async (
  applicationId: string,
): Promise<ApiResponse<ApplicantDocumentAttributes[]>> => {
  try {
    const response = await apiClient.get<{ data: ApplicantDocumentAttributes[] }>(
      `/applicant-documents/application/${applicationId}`, // Adjust endpoint
    )
    return { data: response.data.data }
  } catch (error: any) {
    return { data: [], error: error.response?.data?.message || "Failed to fetch documents." }
  }
}

export const deleteApplicantDocument = async (documentId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/applicant-documents/${documentId}`)
    return { data: { message: response.data.message }, message: response.data.message }
  } catch (error: any) {
    return { data: { message: "" }, error: error.response?.data?.message || "Failed to delete document." }
  }
}
