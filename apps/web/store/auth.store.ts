import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>
  logout: () => Promise<void>
  setTokens: (token: string, refreshToken: string) => void
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await authApi.login(email, password)
          localStorage.setItem('pedizi:token', data.accessToken)
          localStorage.setItem('pedizi:refresh', data.refreshToken)
          localStorage.setItem('pedizi:userId', data.user.id)

          set({
            user: data.user,
            token: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const result = await authApi.register(data)
          localStorage.setItem('pedizi:token', result.accessToken)
          localStorage.setItem('pedizi:refresh', result.refreshToken)
          localStorage.setItem('pedizi:userId', result.user.id)

          set({
            user: result.user,
            token: result.accessToken,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {}
        localStorage.removeItem('pedizi:token')
        localStorage.removeItem('pedizi:refresh')
        localStorage.removeItem('pedizi:userId')
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      setTokens: (token, refreshToken) => {
        localStorage.setItem('pedizi:token', token)
        localStorage.setItem('pedizi:refresh', refreshToken)
        set({ token, refreshToken, isAuthenticated: true })
      },

      loadUser: async () => {
        const token = localStorage.getItem('pedizi:token')
        if (!token) return
        try {
          const user = await authApi.me()
          set({ user, isAuthenticated: true })
        } catch {
          get().logout()
        }
      },
    }),
    {
      name: 'pedizi:auth',
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
