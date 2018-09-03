<template>
<div id="bar-edit">
    <button class="btn btn-default btn-primary" @click="clicked">Click me</button>
    <router-view></router-view>
</div>
</template>

<script>
 export default {
     name: 'bar',
     methods: {
         clicked() {
            // this.$router.push({path: '/bar-edit/' + Math.random()});
            location.hash =  '/bar-edit/' + Math.random();
         }
     }
 }
</script>