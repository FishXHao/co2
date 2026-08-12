import { reactive, computed } from 'vue'

// Lightweight form validation composable.
// Validators are functions returning a string error message or '' when valid.
export const validators = {
  required(message = '此欄位為必填') {
    return (value) =>
      value === null || value === undefined || String(value).trim() === ''
        ? message
        : ''
  },
  minLength(min, message) {
    return (value) =>
      String(value ?? '').length < min
        ? message || `至少需輸入 ${min} 個字元`
        : ''
  },
  maxLength(max, message) {
    return (value) =>
      String(value ?? '').length > max
        ? message || `不可超過 ${max} 個字元`
        : ''
  },
  email(message = '請輸入有效的電子郵件') {
    return (value) => {
      if (!value) return ''
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : message
    }
  },
  pattern(regex, message = '格式不正確') {
    return (value) => (!value || regex.test(value) ? '' : message)
  }
}

/**
 * @param {Record<string, any>} initial - initial field values
 * @param {Record<string, Function[]>} rules - field -> array of validators
 */
export function useFormValidation(initial = {}, rules = {}) {
  const values = reactive({ ...initial })
  const errors = reactive({})
  const touched = reactive({})

  function validateField(field) {
    const fieldRules = rules[field] || []
    for (const rule of fieldRules) {
      const message = rule(values[field], values)
      if (message) {
        errors[field] = message
        return false
      }
    }
    errors[field] = ''
    return true
  }

  function validateAll() {
    let valid = true
    for (const field of Object.keys(rules)) {
      touched[field] = true
      if (!validateField(field)) valid = false
    }
    return valid
  }

  function touch(field) {
    touched[field] = true
    validateField(field)
  }

  function reset() {
    Object.assign(values, initial)
    Object.keys(errors).forEach((k) => (errors[k] = ''))
    Object.keys(touched).forEach((k) => (touched[k] = false))
  }

  const isValid = computed(() =>
    Object.keys(rules).every((field) => {
      const fieldRules = rules[field] || []
      return fieldRules.every((rule) => !rule(values[field], values))
    })
  )

  // Ordered list of current error messages for an error summary region.
  const errorSummary = computed(() =>
    Object.keys(rules)
      .filter((field) => errors[field])
      .map((field) => ({ field, message: errors[field] }))
  )

  // First field (in rules order) currently in error - used for focus management.
  const firstErrorField = computed(() => {
    for (const field of Object.keys(rules)) {
      if (errors[field]) return field
    }
    return null
  })

  return {
    values,
    errors,
    touched,
    isValid,
    errorSummary,
    firstErrorField,
    validateField,
    validateAll,
    touch,
    reset
  }
}

export default useFormValidation
