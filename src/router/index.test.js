import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createAppRouter } from './index'

// Route guard tests. We stub the auth store state via a fresh Pinia + spy on
// the store within each scenario using the router guard behavior.
import { useAuthStore } from '@/stores/auth'

describe('router guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('redirects to login when accessing a protected route while logged out', async () => {
    const router = createAppRouter()
    await router.push('/account')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/account')
  })

  it('allows a logged-in user to reach a protected route', async () => {
    const router = createAppRouter()
    const auth = useAuthStore()
    auth.isLoggedIn = true
    auth.user = { username: 'admin' }
    await router.push('/account')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('account')
  })

  it('redirects a logged-in user away from guest-only login page', async () => {
    const router = createAppRouter()
    const auth = useAuthStore()
    auth.isLoggedIn = true
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('resolves unknown paths to the not-found view', async () => {
    const router = createAppRouter()
    await router.push('/this-does-not-exist')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
