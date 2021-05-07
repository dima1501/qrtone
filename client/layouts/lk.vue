<template lang="pug">
  v-app
    .page
      .page__sidebar
        Sidebar
      .page__content
        Nuxt
</template>

<script>
import Vue from 'vue'
import Sidebar from '../components/lk/Sidebar.vue'

export default {
  components: {
    Sidebar,
  },
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
      this.$store.dispatch("auth/setSocketId", msg, { root: true });
    },
    async newOrder(data) { 
      this.$store.state.auth.user.orders.push(data.order)
    },
    async acceptOrderAdmin(data) {
      this.$store.state.auth.user.orders.find(e => e.orderId === data.orderId).status = 'accepted'
    }
  },
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$store.dispatch("auth/checkAuth");
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

</style>

