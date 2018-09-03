<template>
<p class=""> Bar edit: {{barEdit}}</p>
</template>

<script>
export default {
  name: 'baredit',
        data: function() {
            return {
                barEdit: '',
            }
        },
        mounted: function() {
            const id = this.$route.params.id;
            this.barEdit = id;
        },
        methods: {
        },
}
</script>
<style>
</style>