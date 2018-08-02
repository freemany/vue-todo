<template>
  <div id="app" class="container">
      <ul class="list-group">
        <TodoItem v-for="(item, index) in sortedItems" :item="item" :key="index"></TodoItem>
      </ul>
      <div class="form-inline pull-left clearfix">
        <label class="sr-only" for="inlineFormInputName2">Title</label>
        <input type="text" class="form-control mb-2 mr-sm-2" id="inlineFormInputName2" placeholder="todo" v-model="newTitle">
        <button type="submit" class="btn btn-primary mb-2" @click="addItem()">Add</button>
      </div>
  </div>
</template>

<script>
import TodoItem from './components/TodoItem'
import Utils from './lib/Utils'
import Store from './lib/Store'
import EventBus from './shared/EventBus'
import Config from './shared/config'

export default {
  name: 'app',
  components: {
    TodoItem
  },
  props: {
            story$: null,
            store: null,
  },
        created: function() {
            const store = new Store();
            const items = store.getItem(Config.storageKey);
            if (items !== null) {
                this.items = items;
            }
            const that = this;
            EventBus.$on('item:save', function() {
                store.setItem(Config.storageKey, that.items);
            });
        },
        data: function() {
               
          return {
            items: [
                {title: 'freeman', done: false, editing: false, id: Utils.guid(), new: false},
                {title: 'tia', done: false, editing: false, id: Utils.guid(), new: false},
            ],
            newTitle: '',
          }
        },
        methods: {
            addItem: function() {
                let item = {
                    title: '',
                    editing: false,
                    done: false,
                    id: Utils.guid(),
                    new: true,
                }
                item.title = this.newTitle;
                this.newTitle = '';
                this.items.push(item);
                // remove style from the newly added item
                setTimeout(() => {
                    item.new = false;
                    EventBus.$emit('item:save');
                }, 800);
            }
        },
        computed: {
            sortedItems: function() {
                const sorted = this.items.sort(function(a, b) {
                    if (a.editing || b.editing) {
                        return 0;
                    }
                    return a.title > b.title;
                });

                return this.items;
            }
        }
}
</script>

<style>
   @import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
    .done {
      text-decoration: line-through;
    }
    .newly {
      background: #99cb84;
    }
</style>
