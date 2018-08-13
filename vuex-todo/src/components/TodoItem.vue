<template>
    <li v-bind:class="{'list-group-item': true, clearfix: true, newly: item.new}">
    <span v-if="!item.editing" v-bind:class="{'pull-left': true, done: item.done}" class="pull-left">{{ item.title }}</span>
    <router-view :item="item"></router-view>
    <div class="btn-group pull-right">
      <button @click="completeItem(item)" class="btn btn-primary">{{item.done ? 'Undone' : 'Done'}}</button>
      <button @click="editItem(item)" class="btn btn-default">Edit</button>
      <button @click="deleteItem(item)" class="btn btn-danger">Delete</button>
    </div>
  </li>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TotoItem',
  props: ['item'],
  data: function() {
            return {
                cachedTitle: null
            }
        },
  methods: {
            ...mapActions([                  
                'removeItem',
                'completeItem',
            ]),
            deleteItem: function(item) {
                if (confirm('Do you want to delete this item?')) {
                    this.removeItem(item)
                }
            },
            editItem: function(item) {
                this.$router.push({path: `/edit/${item.id}`});
            },
        }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
