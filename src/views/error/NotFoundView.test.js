import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import NotFoundView from './NotFoundView.vue'

describe('NotFoundView', () => {
  it('renders 404 messaging and a link home', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        stubs: { RouterLink: RouterLinkStub }
      }
    })
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('找不到頁面')
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({ name: 'home' })
  })
})
