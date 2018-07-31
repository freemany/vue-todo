<template>
    <span>
    <span v-if="item.editing">
        <input type="text" class="form-control" v-model="item.title" @click="select">
        <div class="btn-group pull right">
          <button @click="saveItem(item)" class="btn btn-primary">Save</button>
          <button @click="cancelItem(item)" class="btn btn-info">Cancel</button>
        </div>
    </span>
  </span>
</template>

<script>
import EventBus from './../shared/EventBus'

export default {
  name: 'TotoEditItem',
  props: ['item'],
        data: function() {
            return {
                cachedTitle: '',
            }
        },
        template: '#todo-edit-item',
        mounted: function() {
            this.cachedTitle = this.item.title;
            if (this.item.editing === true) {
                return;
            }
            const id = this.$route.params.id;
            if (id === this.item.id) {
                this.item.editing = true;
            }
        },
        methods: {
            saveItem: function(item) {
                item.editing = false;
                this.cachedTitle = null;
                EventBus.$emit('item:save');
                this.goHome();
            },
            cancelItem: function(item) {
                item.title = this.cachedTitle;
                item.editing = false;
                this.goHome();
            },
            select: function(e) {
                e.target.select();
            },
            goHome() {
                this.$router.push({path: '/'});
            }
        },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>