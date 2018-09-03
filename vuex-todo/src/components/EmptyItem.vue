<template>
<div></div>
</template>
<script>
export default {
  name: 'emptyitem',
  mounted() {
      this.$emit('stopedit')
  }
}
</script>