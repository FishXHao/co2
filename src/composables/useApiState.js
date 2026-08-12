import { ref } from 'vue'

// Tracks the lifecycle of an async request with a simple status machine.
// status: idle | loading | success | error | empty
export function useApiState() {
  const status = ref('idle')
  const error = ref(null)

  async function run(fn) {
    status.value = 'loading'
    error.value = null
    try {
      const result = await fn()
      status.value =
        result === null || (Array.isArray(result) && result.length === 0)
          ? 'empty'
          : 'success'
      return result
    } catch (e) {
      status.value = 'error'
      error.value = e
      throw e
    }
  }

  function reset() {
    status.value = 'idle'
    error.value = null
  }

  return { status, error, run, reset }
}

export default useApiState
