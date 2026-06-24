import apiClient from './client';
import type {
  ApiResponse,
  Cake,
  Category,
  Filling,
  Fruit,
  NamedEntity,
  NamedResourceKey,
  Nut,
  Order,
  OrderStatus,
  Size,
  Tier,
} from '../types/api';

async function getData<T>(url: string): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url);
  return response.data.data;
}

async function postData<T>(url: string, body: unknown): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, body);
  return response.data.data;
}

async function putData<T>(url: string, body: unknown): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, body);
  return response.data.data;
}

async function deleteData(url: string): Promise<void> {
  await apiClient.delete(url);
}

export const categoriesApi = {
  getAll: () => getData<Category[]>('/categories'),
  create: (body: Partial<Category>) => postData<Category>('/categories', body),
  update: (id: string, body: Partial<Category>) =>
    putData<Category>(`/categories/${id}`, body),
  remove: (id: string) => deleteData(`/categories/${id}`),
};

export const cakesApi = {
  getAll: () => getData<Cake[]>('/cakes'),
  create: (body: Partial<Cake>) => postData<Cake>('/cakes', body),
  update: (id: string, body: Partial<Cake>) => putData<Cake>(`/cakes/${id}`, body),
  remove: (id: string) => deleteData(`/cakes/${id}`),
};

export function createNamedResourceApi(resource: NamedResourceKey) {
  return {
    getAll: () => getData<NamedEntity[]>(`/${resource}`),
    create: (body: Partial<NamedEntity>) => postData<NamedEntity>(`/${resource}`, body),
    update: (id: string, body: Partial<NamedEntity>) =>
      putData<NamedEntity>(`/${resource}/${id}`, body),
    remove: (id: string) => deleteData(`/${resource}/${id}`),
  };
}

export const fruitsApi = createNamedResourceApi('fruits') as {
  getAll: () => Promise<Fruit[]>;
  create: (body: Partial<Fruit>) => Promise<Fruit>;
  update: (id: string, body: Partial<Fruit>) => Promise<Fruit>;
  remove: (id: string) => Promise<void>;
};

export const nutsApi = createNamedResourceApi('nuts') as {
  getAll: () => Promise<Nut[]>;
  create: (body: Partial<Nut>) => Promise<Nut>;
  update: (id: string, body: Partial<Nut>) => Promise<Nut>;
  remove: (id: string) => Promise<void>;
};

export const fillingsApi = createNamedResourceApi('fillings') as {
  getAll: () => Promise<Filling[]>;
  create: (body: Partial<Filling>) => Promise<Filling>;
  update: (id: string, body: Partial<Filling>) => Promise<Filling>;
  remove: (id: string) => Promise<void>;
};

export const sizesApi = {
  getAll: () => getData<Size[]>('/sizes'),
  create: (body: Partial<Size>) => postData<Size>('/sizes', body),
  update: (id: string, body: Partial<Size>) => putData<Size>(`/sizes/${id}`, body),
  remove: (id: string) => deleteData(`/sizes/${id}`),
};

export const tiersApi = {
  getAll: () => getData<Tier[]>('/tiers'),
  create: (body: Partial<Tier>) => postData<Tier>('/tiers', body),
  update: (id: string, body: Partial<Tier>) => putData<Tier>(`/tiers/${id}`, body),
  remove: (id: string) => deleteData(`/tiers/${id}`),
};

export const ordersApi = {
  getAll: () => getData<Order[]>('/orders'),
  updateStatus: async (id: string, status: OrderStatus) => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, {
      status,
    });
    return response.data.data;
  },
};
