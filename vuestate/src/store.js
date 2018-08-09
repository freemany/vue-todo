import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     title: 'My title',
     links: [
      'http://google.com',
      'http://coursetro.com',
      'http://youtube.com'
     ]
  },
  getters: {
    countLinks: state => state.links.length
  },
  mutations: {
    ADD_LINK: (state, link) => {
      state.links.push(link)
    }
  },
  actions: {

  }
})
