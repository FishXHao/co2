import { defineStore } from 'pinia'
import api from '@/services/api'

// User profile store.
// ⚠ ASSUMPTION: GET /api/users/{userId} is marked "規劃中" in swagger.
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchProfile(userId) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await api.get(`/users/${userId}`)
        this.profile = data?.user ?? data
        return this.profile
      } catch (e) {
        this.error = e?.message || '無法取得使用者資料'
        throw e
      } finally {
        this.isLoading = false
      }
    },

    clear() {
      this.profile = null
      this.error = null
    }
  }
})

export default useUserStore
