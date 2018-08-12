import Vue from 'vue'
import Vuex from 'vuex'
import Utils from '@/lib/Utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      {title: 'freeman', done: false, editing: false, id: Utils.guid(), new: false},
      {title: 'tia', done: false, editing: false, id: Utils.guid(), new: false},
    ],
    newTitle: '',
  },
  getters: {

  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    }
  },
  actions: {

  }
})
