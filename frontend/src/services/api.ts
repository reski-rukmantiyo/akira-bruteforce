import axios from 'axios';
import { GPUType, Provider, GPUPrice, CreateGPUTypeRequest, CreateProviderRequest, CreateGPUPriceRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GPU Types API
export const gpuTypesAPI = {
  getAll: () => api.get<GPUType[]>('/gpu-types'),
  create: (data: CreateGPUTypeRequest) => api.post<GPUType>('/gpu-types', data),
  update: (id: string, data: CreateGPUTypeRequest) => api.put<GPUType>(`/gpu-types/${id}`, data),
  delete: (id: string) => api.delete(`/gpu-types/${id}`),
};

// Providers API
export const providersAPI = {
  getAll: () => api.get<Provider[]>('/providers'),
  create: (data: CreateProviderRequest) => api.post<Provider>('/providers', data),
  update: (id: string, data: CreateProviderRequest) => api.put<Provider>(`/providers/${id}`, data),
  delete: (id: string) => api.delete(`/providers/${id}`),
};

// GPU Prices API
export const gpuPricesAPI = {
  getAll: () => api.get<GPUPrice[]>('/gpu-prices'),
  create: (data: CreateGPUPriceRequest) => api.post<GPUPrice>('/gpu-prices', data),
  update: (id: string, data: CreateGPUPriceRequest) => api.put<GPUPrice>(`/gpu-prices/${id}`, data),
  delete: (id: string) => api.delete(`/gpu-prices/${id}`),
};

export default api;