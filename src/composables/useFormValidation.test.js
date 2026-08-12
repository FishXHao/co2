import { describe, it, expect } from 'vitest'
import { useFormValidation, validators } from './useFormValidation'

describe('validators', () => {
  it('required flags empty values', () => {
    const rule = validators.required()
    expect(rule('')).not.toBe('')
    expect(rule('  ')).not.toBe('')
    expect(rule('x')).toBe('')
  })

  it('email validates format', () => {
    const rule = validators.email()
    expect(rule('bad')).not.toBe('')
    expect(rule('a@b.com')).toBe('')
    expect(rule('')).toBe('') // empty is allowed (use required to enforce)
  })

  it('minLength enforces length', () => {
    const rule = validators.minLength(6)
    expect(rule('123')).not.toBe('')
    expect(rule('123456')).toBe('')
  })
})

describe('useFormValidation', () => {
  it('validateAll returns false and sets errors when invalid', () => {
    const form = useFormValidation(
      { username: '', password: '' },
      {
        username: [validators.required('請輸入帳號')],
        password: [validators.required('請輸入密碼'), validators.minLength(6)]
      }
    )
    expect(form.validateAll()).toBe(false)
    expect(form.errors.username).toBe('請輸入帳號')
    expect(form.firstErrorField.value).toBe('username')
  })

  it('validateAll returns true when all valid', () => {
    const form = useFormValidation(
      { username: 'admin', password: 'secret123' },
      {
        username: [validators.required()],
        password: [validators.required(), validators.minLength(6)]
      }
    )
    expect(form.validateAll()).toBe(true)
    expect(form.isValid.value).toBe(true)
    expect(form.errorSummary.value).toHaveLength(0)
  })

  it('reset restores initial values and clears errors', () => {
    const form = useFormValidation(
      { username: '' },
      { username: [validators.required()] }
    )
    form.values.username = 'x'
    form.validateAll()
    form.reset()
    expect(form.values.username).toBe('')
    expect(form.errors.username).toBe('')
  })
})
