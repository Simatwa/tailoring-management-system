import axios from 'axios';
import type { AuthResponse, RegisterFormData, UserProfile, UserMeasurements, ShallowUserOrderDetails, UserOrderDetails, NewOrderData } from './types';

const api = axios.create({
  baseURL: '/api/v1',
});

const djangoApi = axios.create({
  baseURL: '/d',
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBusinessInfo = async () => {
  const response = await api.get('/about');
  return response.data;
};

export const getServicesOffered = async () => {
  const response = await api.get('/services-offered');
  return response.data;
};

export const getLatestWork = async () => {
  const response = await api.get('/latest-work');
  return response.data;
};

export const getFeedbacks = async () => {
  const response = await api.get('/feedbacks');
  return response.data;
};

export const getFAQs = async () => {
  const response = await api.get('/faqs');
  return response.data;
};

export const sendMessage = async (data: { sender: string; email: string; body: string }) => {
  const response = await api.post('/message', data);
  return response.data;
};

// Auth and User Management
export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');

  const response = await api.post<AuthResponse>('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.data.access_token) {
    // Store token
    localStorage.setItem('token', response.data.access_token);
    
    // Login to Django
    await djangoApi.get(`/user/login?token=${response.data.access_token}`);
  }

  return response.data;
};

export const register = async (data: RegisterFormData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await djangoApi.post('/user/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await api.get(`/user/exists?username=${username}`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<UserProfile>) => {
  const response = await api.patch('/profile', data);
  return response.data;
};

export const getMeasurements = async (): Promise<UserMeasurements> => {
  const response = await api.get('/measurements');
  return response.data;
};

export const updateMeasurements = async (data: Partial<UserMeasurements>) => {
  const response = await api.patch('/measurements', data);
  return response.data;
};

// Order Management
export const getOrders = async (): Promise<ShallowUserOrderDetails[]> => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderDetails = async (id: number): Promise<UserOrderDetails> => {
  const response = await api.get(`/order/${id}`);
  return response.data;
};

export const createOrder = async (data: NewOrderData): Promise<UserOrderDetails> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'reference_image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.post('/order', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateOrder = async (id: number, data: Partial<NewOrderData>): Promise<UserOrderDetails> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'reference_image' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.patch(`/order/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteOrder = async (id: number): Promise<{ detail: string }> => {
  const response = await api.delete(`/order/${id}`);
  return response.data;
};