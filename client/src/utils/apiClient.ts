import axios, { AxiosResponse, type AxiosInstance, type AxiosRequestConfig } from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://rmcohst.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1')

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
    // Don't set Content-Type here. Let Axios detect it.
  }
})

// Generic response wrapper
type ApiResponse<T> = Promise<T>

/**
 * Generic GET request
 */
export async function get<T>(path: string, config?: AxiosRequestConfig): ApiResponse<T> {
  const response: AxiosResponse<T> = await apiClient.get(path, config)
  return response.data
}

/**
 * Generic POST request (FormData supported)
 */
export async function post<Req, Res>(
  path: string,
  data: Req,
  config: AxiosRequestConfig = {}
): ApiResponse<Res> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData

  const response: AxiosResponse<Res> = await apiClient.post(path, data, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    }
  })

  return response.data
}

/**
 * Generic PATCH request (FormData supported)
 */
export async function patch<Req, Res>(
  path: string,
  data: Req,
  config: AxiosRequestConfig = {}
): ApiResponse<Res> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData

  const response: AxiosResponse<Res> = await apiClient.patch(path, data, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    }
  })

  return response.data
}

/**
 * Generic DELETE request
 */
export async function remove<Res>(path: string, config?: AxiosRequestConfig): ApiResponse<Res> {
  const response: AxiosResponse<Res> = await apiClient.delete(path, config)
  return response.data
}

export default apiClient
