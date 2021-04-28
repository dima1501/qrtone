<template lang="pug">
    v-app
        Nuxt
</template>

<script>

export default {
  sockets: {
    // updateOrdersUser(msg) {
    //   this.$store.dispatch('menu/updateOrders', this.$store.state.menu.orders)
    // },
    // async updateOrdersAdmin(msg) {
    //   this.$store.state.auth.user.orders.length = 0

    //   const orders = await axios({
    //     method: "get",
    //     url: "/get-orders"
    //   });

    //   if (orders) {
    //     this.$store.state.auth.user.orders = orders.data
    //   }
    // },
    async updateSocketId(msg) {
        this.$store.dispatch("guest/setSocketId", msg, { root: true });
    },
    async acceptOrder(data) {
        this.$store.state.guest.user.orders.find(e => e.orderId === data).status = 'accepted'
    }
  },
  created() {
      this.$store.dispatch("guest/loadData", this.$route.params.id, { root: true });
  },
  mounted() {
    if (!this.$store.state.guest.user) {
      this.$store.dispatch("guest/checkAuth", this.$route.params.id);
    }
  }
}
</script>

<style lang="scss">
.page {
  display: flex;

  &__sidebar {
    width: 300px;
    flex-shrink: 0;
  }

  &__content {
    flex-grow: 1;
    padding: 30px 50px;
  }
}
</style>

