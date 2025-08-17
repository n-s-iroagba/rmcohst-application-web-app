import axios, {
  AxiosResponse,
  AxiosInstance,
  AxiosRequestConfig
} from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://rmcohst.onrender.com/api'
    : 'http://localhost:3000/api')

const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

type ApiResponse<T> = Promise<T>

/**
 * Generic GET
 */
export async function get<T>(path: string, config?: AxiosRequestConfig): ApiResponse<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.get(path, config)
    return response.data
  } catch (error) {
    console.error('GET error:', error)
    throw error
  }
}

/**
 * Helper to prepare headers for FormData
 */
function prepareHeaders(
  config: AxiosRequestConfig,
  isFormData: boolean
): AxiosRequestConfig['headers'] {
  return {
    Accept: 'application/json',
    ...(config.headers || {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' })
  }
}

/**
 * Generic POST (supports FormData)
 */
export async function post<Req, Res>(
  path: string,
  data: Req,
  config: AxiosRequestConfig = {}
): ApiResponse<Res> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
  try {
    const response: AxiosResponse<Res> = await apiClient.post(path, data, {
      ...config,
      headers: prepareHeaders(config, isFormData)
    })
    return response.data
  } catch (error) {
    console.error('POST error:', error)
    throw error
  }
}

/**
 * Generic PATCH (supports FormData)
 */
export async function patch<Req, Res>(
  path: string,
  data: Req,
  config: AxiosRequestConfig = {}
): ApiResponse<Res> {
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
  try {
    const response: AxiosResponse<Res> = await apiClient.patch(path, data, {
      ...config,
      headers: prepareHeaders(config, isFormData)
    })
    return response.data
  } catch (error) {
    console.error('PATCH error:', error)
    throw error
  }
}

/**
 * Generic DELETE
 */
export async function remove<Res>(
  path: string,
  config?: AxiosRequestConfig
): ApiResponse<Res> {
  try {
    const response: AxiosResponse<Res> = await apiClient.delete(path, config)
    return response.data
  } catch (error) {
    console.error('DELETE error:', error)
    throw error
  }
}

export default apiClient
