<template>
<div class="container jumbotron">
    <ul class="list-group">
        <li class="list-group-item" v-for="(item, index) in items" :key="index">{{item.name}}</li>
    </ul>
    <h5 v-if="items.length">There are {{items.length}} items</h5>
    <button class="btn btn-primary btn-default" @click="countList">Answer</button>
</div>
</template>

<script>
import MyEventManager from '@/shared/MyEventManager'

export default {
  name: 'foo',
  mounted() {
     MyEventManager.on('deputy:foo:list_item:add', (item) => {
          this.items.push(item)
     });
  },
  data() {
      return {
          items: [
              {name: 'foo'}
          ],
      }
  },
  methods: {
      countList()  {
          alert('item no.: ' + this.items.length);
           MyEventManager.trigger('deputy:foo:list_item:count', [this.items.length]);
      }
  }
}
</script>