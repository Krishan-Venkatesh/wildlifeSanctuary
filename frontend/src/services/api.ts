import axios from 'axios';
import { Animal, Caretaker, Habitat, LoginRequest, RegisterRequest, User, DashboardStats, AuthResponse } from '../types/models';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }
};

// Animals API
export const animalsAPI = {
  getAll: async () => {
    const response = await api.get<Animal[]>('/animals');
    return response.data;
  },
  getByCaretakerId: async (caretakerId: string) => {
    const response = await api.get<Animal[]>(`/animals/caretaker/${caretakerId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Animal>(`/animals/${id}`);
    return response.data;
  },
  create: async (data: Omit<Animal, 'id'>) => {
    const response = await api.post<Animal>('/animals', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Animal>) => {
    const response = await api.put<Animal>(`/animals/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/animals/${id}`);
  }
};

// Habitats API
export const habitatsAPI = {
  getAll: async () => {
    const response = await api.get<Habitat[]>('/habitats');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Habitat>(`/habitats/${id}`);
    return response.data;
  },
  create: async (data: Omit<Habitat, 'id'>) => {
    const response = await api.post<Habitat>('/habitats', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Habitat>) => {
    const response = await api.put<Habitat>(`/habitats/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/habitats/${id}`);
  }
};

// Caretakers API
export const caretakersAPI = {
  getAll: async () => {
    const response = await api.get<Caretaker[]>('/caretakers');
    return response.data;
  },
  getByUserId: async (userId: string) => {
    const response = await api.get<Caretaker>(`/caretakers/user/${userId}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Caretaker>(`/caretakers/${id}`);
    return response.data;
  },
  create: async (data: Omit<Caretaker, 'id'>) => {
    const response = await api.post<Caretaker>('/caretakers', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Caretaker>) => {
    const response = await api.put<Caretaker>(`/caretakers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/caretakers/${id}`);
  }
};

// Dashboard API
export const dashboardAPI = {
  getStatistics: async () => {
    const response = await api.get<DashboardStats>('/home/statistics');
    return response.data;
  }
};

export default api; 