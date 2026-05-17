import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api/v1'

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pedizi:admin:token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as any
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('pedizi:admin:refresh')
        const userId = localStorage.getItem('pedizi:admin:userId')
        if (!refreshToken || !userId) throw new Error('No refresh token')

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { userId, refreshToken })
        localStorage.setItem('pedizi:admin:token', data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// ── Admin API calls ───────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),

  // Dashboard
  getDashboard: () => api.get('/analytics/admin/dashboard').then((r) => r.data),
  getMonthlyRevenue: () => api.get('/analytics/admin/revenue').then((r) => r.data),
  getTopRestaurants: () => api.get('/analytics/admin/top-restaurants').then((r) => r.data),

  // Pedidos
  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders/restaurant/all', { params }).then((r) => r.data),

  // Restaurantes
  getRestaurants: (params?: { page?: number; search?: string; status?: string }) =>
    api.get('/restaurants', { params }).then((r) => r.data),
  getPendingRestaurants: () => api.get('/admin/restaurants/pending').then((r) => r.data),
  approveRestaurant: (id: string) => api.patch(`/admin/restaurants/${id}/approve`).then((r) => r.data),
  rejectRestaurant: (id: string, reason?: string) => api.patch(`/admin/restaurants/${id}/reject`, { reason }).then((r) => r.data),

  // Usuários
  getUsers: (params?: { page?: number; role?: string; search?: string }) =>
    api.get('/admin/users', { params }).then((r) => r.data),

  // Financeiro
  getFinancials: (period: 'month' | 'year') =>
    api.get('/admin/financials', { params: { period } }).then((r) => r.data),
}
