import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

// ─── Axios Instance ────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach access token ─────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response Interceptor — auto refresh on 401 ────────────
let refreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (refreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
            resolve(api(original));
          });
        });
      }
      refreshing = true;
      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        if (typeof document !== 'undefined') {
          const maxAge = 60 * 60 * 24 * 7;
          document.cookie = `accessToken=${encodeURIComponent(newToken)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
        }
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];
        original.headers = { ...original.headers, Authorization: `Bearer ${newToken}` };
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; Path=/; Max-Age=0; SameSite=Lax';
        }
        if (typeof window !== 'undefined') window.location.href = '/login';
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Typed API helpers ────────────────────────────────────

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data.data),
  refresh: () => api.post('/auth/refresh').then(r => r.data),
};

// Dashboard
export const dashboardAPI = {
  getSummary:      () => api.get('/dashboard/summary').then(r => r.data.data),
  getSubscriptions:() => api.get('/dashboard/subscriptions').then(r => r.data.data),
  getScore:        () => api.get('/dashboard/score').then(r => r.data.data),
  getSpendChart:   () => api.get('/dashboard/chart/spend').then(r => r.data.data),
  getEfficiency:   () => api.get('/dashboard/chart/efficiency').then(r => r.data.data),
  getRecommendations: () => api.get('/dashboard/recommendations').then(r => r.data.data),
  getBlockchain:   () => api.get('/dashboard/blockchain').then(r => r.data.data),
};

// Subscriptions
export const subsAPI = {
  list:   (params?: Record<string, unknown>) => api.get('/subscriptions', { params }).then(r => r.data),
  create: (data: unknown) => api.post('/subscriptions', data).then(r => r.data.data),
  update: (id: string, data: unknown) => api.patch(`/subscriptions/${id}`, data).then(r => r.data.data),
  remove: (id: string) => api.delete(`/subscriptions/${id}`).then(r => r.data),
  getScore: (id: string) => api.get(`/subscriptions/${id}/score`).then(r => r.data.data),
};

// Subscription taxonomy (authenticated)
export const taxonomyAPI = {
  categories: (params?: { search?: string; isActive?: boolean }) =>
    api.get('/subscriptions/taxonomy/categories', { params }).then((r) => r.data.data as TaxonomyCategory[]),
  subcategories: (categoryId: string, params?: { search?: string; isActive?: boolean }) =>
    api
      .get(`/subscriptions/taxonomy/categories/${categoryId}/subcategories`, { params })
      .then((r) => r.data.data as TaxonomySubcategory[]),
  providers: (subcategoryId: string, params?: { search?: string; isActive?: boolean; region?: string }) =>
    api
      .get(`/subscriptions/taxonomy/subcategories/${subcategoryId}/providers`, { params })
      .then((r) => r.data.data as TaxonomyProvider[]),
  planTypes: (providerId: string, params?: { search?: string; isActive?: boolean }) =>
    api
      .get(`/subscriptions/taxonomy/providers/${providerId}/plan-types`, { params })
      .then((r) => r.data.data as TaxonomyPlanType[]),
  plans: (planTypeId: string, params?: { search?: string; isActive?: boolean }) =>
    api
      .get(`/subscriptions/taxonomy/plan-types/${planTypeId}/plans`, { params })
      .then((r) => r.data.data as TaxonomyPlan[]),
};

export interface TaxonomyCategory {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  order: number;
  isActive: boolean;
}

export interface TaxonomySubcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string | null;
  order: number;
  isActive: boolean;
}

export interface TaxonomyProvider {
  id: string;
  subcategoryId: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  region: string;
  isActive: boolean;
}

export interface TaxonomyPlanType {
  id: string;
  providerId: string;
  name: string;
  description?: string | null;
  order: number;
  isActive: boolean;
}

export interface TaxonomyPlan {
  id: string;
  planTypeId: string;
  name: string;
  description?: string | null;
  monthlyCost: number;
  billingCycle: string;
  features: string[];
  isActive: boolean;
}

// Analytics
export const analyticsAPI = {
  getSummary:    () => api.get('/analytics/summary').then(r => r.data.data),
  getTrend:      (granularity = 'monthly') => api.get('/analytics/trend', { params: { granularity } }).then(r => r.data.data),
  getCategories: () => api.get('/analytics/categories').then(r => r.data.data),
  getEfficiency: () => api.get('/analytics/efficiency').then(r => r.data.data),
};

// Recommendations
export const recsAPI = {
  list:     () => api.get('/recommendations').then(r => r.data.data),
  generate: () => api.post('/recommendations/generate').then(r => r.data.data),
  markRead: (id: string) => api.patch(`/recommendations/${id}/read`).then(r => r.data),
  dismiss:  (id: string) => api.patch(`/recommendations/${id}/dismiss`).then(r => r.data),
};

// Ledger
export const ledgerAPI = {
  list: (page = 1, pageSize = 20) =>
    api.get('/ledger', { params: { page, pageSize } }).then((r) => ({
      items: r.data.data as LedgerRecordRow[],
      meta: r.data.meta as {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      },
    })),
  verify: (hash: string) => api.get(`/ledger/verify/${hash}`).then((r) => r.data.data),
};

export interface LedgerRecordRow {
  id: string;
  txHash: string;
  blockNumber: string | null;
  status: string;
  amount: number;
  description: string | null;
  createdAt: string;
  userSubscription: { plan: { name: string } } | null;
}

// Notifications
export const notifAPI = {
  list:        () => api.get('/notifications').then(r => r.data),
  unreadCount: () => api.get('/notifications/unread-count').then(r => r.data.data),
  markRead:    (id: string) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllRead: () => api.post('/notifications/mark-all-read').then(r => r.data),
};

// Settings
export const settingsAPI = {
  get:    () => api.get('/settings').then(r => r.data.data),
  update: (data: unknown) => api.patch('/settings', data).then(r => r.data.data),
};

// Usage
export const usageAPI = {
  list:   (page = 1) => api.get('/usage', { params: { page } }).then(r => r.data),
  create: (data: unknown) => api.post('/usage', data).then(r => r.data.data),
};
