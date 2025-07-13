export interface GPUType {
  id: string;
  name: string;
  manufacturer: string;
  memory: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  website: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface GPUPrice {
  id: string;
  gpu_type_id: string;
  provider_id: string;
  price: number;
  currency: string;
  date: string;
  in_stock: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  gpu_type_name: string;
  provider_name: string;
}

export interface CreateGPUTypeRequest {
  name: string;
  manufacturer: string;
  memory: string;
}

export interface CreateProviderRequest {
  name: string;
  website: string;
  country: string;
}

export interface CreateGPUPriceRequest {
  gpu_type_id: string;
  provider_id: string;
  price: number;
  currency: string;
  date: string;
  in_stock: boolean;
  url: string;
}