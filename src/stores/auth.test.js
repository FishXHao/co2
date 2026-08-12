import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock the auth service so no real network call is made.
vi.mock('@/services/auth.service', () => ({
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    fetchMe: vi.fn()
  },
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    fetchMe: vi.fn()
  }
}))

import authService from '@/services/auth.service'
import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts logged out', () => {
    const auth = useAuthStore()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })

  it('login sets user and isLoggedIn on success', async () => {
    authService.login.mockResolvedValue({ user: { username: 'admin' } })
    const auth = useAuthStore()
    await auth.login({ username: 'admin', password: 'password123' })
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.username).toBe('admin')
  })

  it('login sets error and stays logged out on failure', async () => {
    authService.login.mockRejectedValue({ message: '帳號或密碼錯誤' })
    const auth = useAuthStore()
    await expect(
      auth.login({ username: 'x', password: 'y' })
    ).rejects.toBeTruthy()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.error).toBe('帳號或密碼錯誤')
  })

  it('logout clears user state', async () => {
    authService.logout.mockResolvedValue({ success: true })
    const auth = useAuthStore()
    auth.user = { username: 'admin' }
    auth.isLoggedIn = true
    await auth.logout()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.user).toBeNull()
  })
})
