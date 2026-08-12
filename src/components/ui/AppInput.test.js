import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from './AppInput.vue'

describe('AppInput', () => {
  it('renders the label and associates it with the input', () => {
    const wrapper = mount(AppInput, { props: { label: '帳號' } })
    const input = wrapper.find('input')
    const label = wrapper.find('label')
    expect(label.text()).toContain('帳號')
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AppInput, { props: { label: '帳號' } })
    await wrapper.find('input').setValue('admin')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['admin'])
  })

  it('sets aria-invalid and describedby when error present', () => {
    const wrapper = mount(AppInput, {
      props: { label: '密碼', error: '必填' }
    })
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    const describedBy = input.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const errorEl = wrapper.find('[role="alert"]')
    expect(errorEl.text()).toContain('必填')
    expect(describedBy).toContain(errorEl.attributes('id'))
  })

  it('marks required fields', () => {
    const wrapper = mount(AppInput, {
      props: { label: '帳號', required: true }
    })
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })
})
