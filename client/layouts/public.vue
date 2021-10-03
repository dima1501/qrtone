<template lang="pug">
  v-app
    Nuxt
    
</template>

<script>

export default {
  sockets: {
    async updateSocketId(msg) {
      console.log('update socket id guest')
        this.$store.dispatch("guest/setSocketId", msg, { root: true });
    }
  },
}
</script>

<style lang="scss">
// .page {
//   display: flex;

//   &__sidebar {
//     width: 300px;
//     flex-shrink: 0;
//   }

//   &__content {
//     flex-grow: 1;
//     padding: 30px;
//   }
// }
</style>

