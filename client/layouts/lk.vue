<template lang="pug">
  v-app
    .page
      .page__sidebar
        Sidebar
      .page__content
        Nuxt
      AddPlacePopup(v-if="$store.state.view.popup.addPlacePopup.visible")
      AddActionPopup(v-if="$store.state.view.popup.addActionPopup")
      
</template>

<script>
export default {
  sockets: {
    async updateSocketId(msg) {
      this.$store.dispatch("auth/setSocketId", {
        socketId: msg,
        place: localStorage.getItem('place')
      }, { root: true });
      const place = localStorage.getItem("place")
      if (place) {
        this.$store.dispatch('lk/loadOrders', place, {root: true})
        this.$store.dispatch('lk/loadActions', place, {root: true})
      }
    },
    async newOrder(data) {
      const notificationsEnabled = localStorage.getItem('notifications')
      if (notificationsEnabled == 'true') {
        const  notification = new Notification('Новый заказ', { body: 'Столик ' + data.order.table })
      }
      this.$store.state.auth.user.orders.unshift(data.order)
    },
    async acceptOrderAdmin(data) {
      this.$store.state.auth.user.orders.find(e => e.orderId === data.orderId).status = 'accepted'
    },
    async newFastAction(data) {
      const notificationsEnabled = localStorage.getItem('notifications')
      if (notificationsEnabled == 'true') {
        const notification = new Notification(data.notify.replace('@table', data.table) )
      }
      this.$store.state.auth.user.notifications.unshift(data)
    },
    async acceptFastAction(data) {
      this.$store.state.auth.user.notifications.find(e => e._id == data._id).status = 'accepted'
    },
    async newTGUser() {
      this.$store.dispatch("lk/updateTGUsers")
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
  min-height: 100%;

  &__sidebar {
    width: 300px;
    flex-shrink: 0;
  }

  &__content {
    flex-grow: 1;
    padding: 30px;
    height: 100%;
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

