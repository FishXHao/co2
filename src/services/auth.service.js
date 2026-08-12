import api from './api'

// Auth service - wraps the real authentication endpoints defined in swagger.json.
// POST /api/login, POST /api/logout, GET /api/users/me
export const authService = {
  /**
   * Log in with username + password.
   * @param {{ username: string, password: string }} credentials
   * @returns {Promise<{ success?: boolean, message?: string, user: object }>}
   */
  async login(credentials) {
    const { data } = await api.post('/login', credentials)
    return data
  },

  // ⚠ ASSUMPTION: /api/logout is marked "規劃中" (planned) in swagger.json.
  // We call it and tolerate failure so client state can still be cleared.
  async logout() {
    try {
      const { data } = await api.post('/logout')
      return data
    } catch (e) {
      return { success: true }
    }
  },

  // ⚠ ASSUMPTION: /api/users/me is marked "規劃中" (planned) in swagger.json.
  async fetchMe() {
    const { data } = await api.get('/users/me')
    return data?.user ?? data
  }
}

export default authService
