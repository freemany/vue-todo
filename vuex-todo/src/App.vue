<template>
  <div class="container">
      <ul class="list-group">
        <TodoItem v-for="(item, index) in sortedItems" :item="item" :key="index"></TodoItem>
      </ul>
      <div class="form-inline pull-left clearfix">
        <label class="sr-only" for="inlineFormInputName2">Title</label>
        <input type="text" class="form-control mb-2 mr-sm-2" id="inlineFormInputName2" placeholder="todo" v-model="newTitle">
        <button type="submit" class="btn btn-primary mb-2" @click="createItem()">Add</button>
      </div>
  </div>
</template>

<script>
import TodoItem from '@/components/TodoItem'
import Utils from '@/lib/Utils'
import Store from '@/lib/Store'
import Config from '@/shared/config'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import MyEventManager from '@/shared/MyEventManager'

export default {
  name: 'app',
  components: {
    TodoItem
  },
  data() {
    return {
        newTitle: ''
    }
  },
  props: {
            story$: null,
            store: null,
  },
        created: function() { 
            this.LOAD_ITEMS();
            MyEventManager.on('stats:todo:item_remove', (id) => {
                   this.removeById(id);

                   return true;
            });
        },
        methods: {
            ...mapMutations([
                'LOAD_ITEMS', 'removeById'
            ]),
            ...mapActions([                  
                'addItem'
            ]),
            createItem() {
              const pItem = this.addItem(this.newTitle)
              pItem.then((item) => {
                MyEventManager.trigger('stats:todo:item_add', [item]);
              })
              this.newTitle = '';
            }
        },
        computed: {
            items: {
              set: function() {
                  return {...mapState([
                         'items'
                  ])}
              },
              get: function() {
                  return this.$store.state.items
              }
            },
            ...mapGetters([
                'sortedItems'
            ]),
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
