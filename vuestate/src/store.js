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
    },
    REMOVE_LINK: (state, link) => {       
      state.links.splice(link, 1)
    },
    REMOVE_ALL: (state) => {                     // Add this
      state.links = []
    }
  },
  actions: {
    removeLink: (context, link) => {       
      context.commit('REMOVE_LINK', link)
    },
    removeAll ({commit}) {                       // Add this
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('REMOVE_ALL')
          resolve()
        }, 1500)
      })
    }
  }
})
