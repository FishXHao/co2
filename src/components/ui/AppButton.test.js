import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: '送出' } })
    expect(wrapper.text()).toContain('送出')
  })

  it('applies variant and size classes', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'danger', size: 'lg' }
    })
    expect(wrapper.classes()).toContain('app-button--danger')
    expect(wrapper.classes()).toContain('app-button--lg')
  })

  it('is disabled when loading', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('aria-busy')).toBe('true')
  })

  it('is disabled when disabled prop is set', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
