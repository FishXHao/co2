import { defineStore } from 'pinia'

let toastId = 0

// UI store: global loading flag + toast notification queue.
export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    toasts: []
  }),

  actions: {
    setLoading(value) {
      this.isLoading = !!value
    },

    /**
     * Push a toast notification.
     * @param {{ message: string, type?: 'success'|'error'|'warning'|'info', timeout?: number }} opts
     */
    addToast({ message, type = 'info', timeout = 4000 }) {
      const id = ++toastId
      this.toasts.push({ id, message, type })
      if (timeout > 0) {
        setTimeout(() => this.removeToast(id), timeout)
      }
      return id
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    success(message, timeout) {
      return this.addToast({ message, type: 'success', timeout })
    },
    error(message, timeout) {
      return this.addToast({ message, type: 'error', timeout })
    },
    info(message, timeout) {
      return this.addToast({ message, type: 'info', timeout })
    },
    warning(message, timeout) {
      return this.addToast({ message, type: 'warning', timeout })
    }
  }
})

export default useUiStore
