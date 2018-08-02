import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import App from '@/App'

describe('Dummy test', () => {

  it('should render correct content', () => {
    expect('hello').toContain('h')
  })
})

describe('App.vue', () => {

  it('has a created hook', () => {
    expect(typeof App.data).toMatch('function')
  })
  it('is Vue instance', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('is App', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.is(App)).toBe(true)
  })
  it('should render correct content', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.find('div#app').is('div')).toBe(true)
  })
})


