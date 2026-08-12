import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Thin wrapper around the auth store for convenient use in components.
export function useAuth() {
  const store = useAuthStore()
  const { user, isLoggedIn, isLoading, error } = storeToRefs(store)

  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    login: store.login,
    logout: store.logout,
    fetchMe: store.fetchMe
  }
}

export default useAuth
