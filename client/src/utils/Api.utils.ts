import axios, { type AxiosInstance, type AxiosRequestConfig, type Method } from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? "https://rmcohst.onrender.com/api/v1" : "http://localhost:5000/api/v1")

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  // You can add other default configurations here, like timeout
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Export the axios instance as apiClient
export const apiClient = axiosInstance // Named export

/**
 * General-purpose Axios request handler.
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - Relative path (not full URL).
 * @param data - Payload for the request.
 * @param config - Optional Axios configuration.
 * @returns A Promise of the response data of type U.
 */
export async function axiosRequest<T, U>(
  method: Method,
  url: string,
  data?: T,
  config?: AxiosRequestConfig,
): Promise<U> {
  const response = await apiClient.request<U>({
    // Use apiClient here
    method,
    url,
    data,
    ...config,
  })
  return response.data
}

/**
 * Axios PATCH request for file uploads using FormData.
 * @param url - Relative path (not full URL).
 * @param formData - FormData object containing file and other fields.
 * @returns A Promise of the response data of type U.
 */
export async function uploadFilePatch<U>(url: string, formData: FormData): Promise<U> {
  const response = await apiClient.patch<U>(url, formData, {
    // Use apiClient here
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}
