import Vue from 'vue'
import Vuex from 'vuex'
import Utils from '@/lib/Utils'
import Store from '@/lib/Store'
import Config from '@/shared/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      // {title: 'freeman', done: false, editing: false, id: Utils.guid(), new: false},
      // {title: 'tia', done: false, editing: false, id: Utils.guid(), new: false},
    ],
    // newTitle: '',
  },
  getters: {
    sortedItems: (state)  => {
      state.items.sort(function(a, b) {
        if (a.editing || b.editing) {
            return 0;
        }
        return a.title > b.title;
    });

    return state.items;
    }
  },
  mutations: {
    LOAD_ITEMS(state, items) {
      const savedItems = Store.getItem(Config.storageKey);
      if (savedItems !== null) {
        state.items = savedItems;
      } else {
        state.items = Config.defaultItems;
        Store.setItem(Config.storageKey, state.items);
      }
    },
    SAVE_ITEMS(state) {
      Store.setItem(Config.storageKey, state.items);
    },
    ADD_ITEM: (state, title) => {  
        let item = {
            title: '',
            editing: false,
            done: false,
            id: Utils.guid(),
            new: true,
        }
        item.title = title
        state.newTitle = ''
        state.items.push(item)
        // remove style from the newly added item
        setTimeout(() => { 
            item.new = false;
            Store.setItem(Config.storageKey, state.items);
        }, 800);
    },
    REMOVE_ITEM: (state, item) => {       
      state.items.splice(item, 1)
      Store.setItem(Config.storageKey, state.items);
    },
    COMPLETE_ITEM: (state, item) => {
      item.done = !item.done;
      Store.setItem(Config.storageKey, state.items);
    }
  },
  actions: {
    removeItem: (context, item) => {       
      context.commit('REMOVE_ITEM', item)
    },
    addItem: (context, title) => {       
      context.commit('ADD_ITEM', title)
    },
    completeItem: (context, title) => {       
      context.commit('COMPLETE_ITEM', title)
    },
  }
})