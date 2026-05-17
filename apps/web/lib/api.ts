import axios, { AxiosInstance, AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api/v1'

// ── Instância principal do Axios ──────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor: adiciona token JWT automaticamente ───────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pedizi:token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor: trata erro 401 (token expirado) ──────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('pedizi:refresh')
        const userId = localStorage.getItem('pedizi:userId')
        if (!refreshToken || !userId) throw new Error('No refresh token')

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { userId, refreshToken })
        localStorage.setItem('pedizi:token', data.accessToken)
        localStorage.setItem('pedizi:refresh', data.refreshToken)

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

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  me: () => api.get('/auth/me').then((r) => r.data),
}

// ── Restaurantes ──────────────────────────────────────────
export const restaurantsApi = {
  findNearby: (params: { lat?: number; lng?: number; search?: string; page?: number }) =>
    api.get('/restaurants', { params }).then((r) => r.data),

  findById: (id: string) => api.get(`/restaurants/${id}`).then((r) => r.data),

  findBySlug: (slug: string) => api.get(`/restaurants/slug/${slug}`).then((r) => r.data),

  getMenu: (restaurantId: string) =>
    api.get(`/restaurants/${restaurantId}/menu`).then((r) => r.data),
}

// ── Pedidos ───────────────────────────────────────────────
export const ordersApi = {
  create: (data: {
    restaurantId: string
    addressId: string
    items: Array<{ menuItemId: string; quantity: number; notes?: string }>
    paymentMethod: string
    couponCode?: string
    notes?: string
  }) => api.post('/orders', data).then((r) => r.data),

  getMyOrders: (page = 1, limit = 10) =>
    api.get('/orders/my', { params: { page, limit } }).then((r) => r.data),

  getById: (id: string) => api.get(`/orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
}

// ── Pagamentos ────────────────────────────────────────────
export const paymentsApi = {
  createPix: (orderId: string) =>
    api.post('/payments/pix', { orderId }).then((r) => r.data),

  getByOrder: (orderId: string) =>
    api.get(`/payments/order/${orderId}`).then((r) => r.data),

  simulateApprove: (orderId: string) =>
    api.post(`/payments/simulate/approve/${orderId}`).then((r) => r.data),
}

// ── Cupons ────────────────────────────────────────────────
export const couponsApi = {
  validate: (code: string, restaurantId: string, subtotal: number) =>
    api.get('/coupons/validate', { params: { code, restaurantId, subtotal } }).then((r) => r.data),
}

// ── Usuário ───────────────────────────────────────────────
export const usersApi = {
  getProfile: () => api.get('/users/me').then((r) => r.data),

  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/users/me', data).then((r) => r.data),

  getAddresses: () => api.get('/users/me/addresses').then((r) => r.data),

  createAddress: (data: {
    label?: string; street: string; number: string; complement?: string
    neighborhood: string; city: string; state: string; zipCode: string
    latitude?: number; longitude?: number; isDefault?: boolean
  }) => api.post('/users/me/addresses', data).then((r) => r.data),

  deleteAddress: (id: string) => api.delete(`/users/me/addresses/${id}`).then((r) => r.data),
}

// ── Avaliações ────────────────────────────────────────────
export const reviewsApi = {
  create: (data: { orderId: string; restaurantRating: number; courierRating?: number; comment?: string }) =>
    api.post('/reviews', data).then((r) => r.data),

  getByRestaurant: (restaurantId: string, page = 1) =>
    api.get(`/reviews/restaurant/${restaurantId}`, { params: { page } }).then((r) => r.data),
}

// ── Notificações ──────────────────────────────────────────
export const notificationsApi = {
  getAll: (page = 1) => api.get('/notifications', { params: { page } }).then((r) => r.data),

  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),

  markRead: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
}
