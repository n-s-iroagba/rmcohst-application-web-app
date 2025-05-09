import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:5000/api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export const authApi = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post<{ user: User; token: string }>(`${API_URL}/auth/register`, data);
      localStorage.setItem('token', response.data.token);
      return { data: response.data, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return { data: null, error: error.response.data };
      }
      return { data: null, error: { message: 'Registration failed' } };
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      return { data: response.data, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return { data: null, error: error.response.data };
      }
      return { data: null, error: { message: 'Login failed' } };
    }
  },

  validateToken: async () => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  }
};