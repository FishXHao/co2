import { defineStore } from 'pinia'
import authService from '@/services/auth.service'

// ⚠ ASSUMPTION: Full auth (logout, users/me) is marked "規劃中" in swagger.
// Login is real. We prefer httpOnly cookies handled by the server and do NOT
// store tokens in localStorage.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null
  }),

  getters: {
    username: (state) => state.user?.username ?? ''
  },

  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      try {
        const data = await authService.login(credentials)
        this.user = data.user ?? null
        this.isLoggedIn = true
        return data
      } catch (e) {
        this.error = e?.message || '登入失敗'
        this.isLoggedIn = false
        this.user = null
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true
      try {
        await authService.logout()
      } finally {
        this.user = null
        this.isLoggedIn = false
        this.isLoading = false
      }
    },

    // ⚠ ASSUMPTION: /api/users/me is planned. Used to restore session on load.
    async fetchMe() {
      this.isLoading = true
      try {
        const user = await authService.fetchMe()
        this.user = user
        this.isLoggedIn = !!user
        return user
      } catch (e) {
        this.user = null
        this.isLoggedIn = false
        return null
      } finally {
        this.isLoading = false
      }
    }
  }
})

export default useAuthStore
