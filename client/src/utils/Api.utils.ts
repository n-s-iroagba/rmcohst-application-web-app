import axios, { AxiosRequestConfig, Method } from 'axios';

// Choose base URL based on environment
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.yourdomain.com' // Replace with your production API URL
    : 'http://localhost:5000';     // Replace with your local dev API URL

const axiosInstance = axios.create({
  baseURL,
});

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
  config?: AxiosRequestConfig
): Promise<U> {
  const response = await axiosInstance.request<U>({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
}

/**
 * Axios PATCH request for file uploads using FormData.
 * @param url - Relative path (not full URL).
 * @param formData - FormData object containing file and other fields.
 * @returns A Promise of the response data of type U.
 */
export async function uploadFilePatch<U>(
  url: string,
  formData: FormData
): Promise<U> {
  const response = await axiosInstance.patch<U>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
