<template>
<div class="row" v-if="item.editing">
    <div class="col-lg-2 half-width pull-left">
        <input type="text" class="form-control" v-model="item.title" @click="select">
    </div> 
    <div class="btn-group pull-left">
        <button @click="saveItem(item)" class="btn btn-primary">Save</button>
        <button @click="cancelItem(item)" class="btn btn-info">Cancel</button>
    </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TotoEditItem',
  props: ['item'],
        data: function() {
            return {
                cachedTitle: '',
            }
        },
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
                  ...mapMutations([
                   'SAVE_ITEMS'
            ]),
            saveItem: function(item) {
                item.editing = false;
                this.cachedTitle = null;
                this.SAVE_ITEMS();
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
.half-width { width: 50%}
</style>