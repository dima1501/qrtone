<template lang="pug">
  v-app
    .page
      .page__sidebar
        Sidebar
      .page__content
        Nuxt
    AddPlacePopup(v-if="$store.state.view.popup.addPlacePopup.visible")
    AddActionPopup(v-if="$store.state.view.popup.addActionPopup")
    Onboard(v-if="$store.state.auth.user && !$store.state.auth.user.isOnboardCompleted || $store.state.auth.user && $store.state.view.popup.onboardPopup.visible")
    client-only
      notifications(
        group="custom-style"
        position="right bottom"
        classes="my-style"
        :max="6"
        :width="300"
        :duration="4000")
    client-only
      vue-confirm-dialog
</template>

<script>
import moment from 'moment';

export default {
  sockets: {
    async updateSocketId(msg) {
      this.$store.dispatch("auth/setSocketId", {
        socketId: msg,
        place: localStorage.getItem('place')
      }, { root: true });
      const place = localStorage.getItem("place")
      if (place && this.$store.state.auth.user) {
        this.$store.dispatch('lk/loadOrders', { place, items: 0 }, {root: true})
        this.$store.dispatch('lk/loadActions', { place, items: 0 }, {root: true})
      }
    },
    async newOrder(data) {
      this.$notify({ group: 'custom-style', type: 'n-info', title: 'Новый заказ', text: 'Столик #' + data.order.table })
      const notificationsEnabled = localStorage.getItem('notifications')
      if (notificationsEnabled == 'true') {
        new Notification('Новый заказ', { body: 'Столик #' + data.order.table })
      }
      this.$store.state.auth.user.orders.unshift(data.order)
    },
    async acceptOrderAdmin(data) {
      const order = this.$store.state.auth.user.orders.find(e => e.orderId === data.orderId)
      if (order) order.status = 'accepted'
    },
    async newFastAction(data) {
      this.$notify({ group: 'custom-style', type: 'n-info', title: data.notify.replace('@table', data.table) })
      const notificationsEnabled = localStorage.getItem('notifications')
      if (notificationsEnabled == 'true') {
        new Notification(data.notify.replace('@table', data.table) )
      }
      this.$store.state.auth.user.notifications.unshift(data)
    },
    async newReservation(data) {
      this.$notify({ group: 'custom-style', type: 'n-info', title: 'Заявка на бронирование', text: 'На ' + moment(data.reservation.date).format('DD.MM.YYYY') + ', в ' + data.reservation.time + '\nКоличество гостей: ' + data.reservation.guests })
      const notificationsEnabled = localStorage.getItem('notifications')
      if (notificationsEnabled == 'true') {
        new Notification('Бронь', { body: 'На ' + moment(data.reservation.date).format('DD.MM.YYYY') + ', в ' + data.reservation.time + '\nКоличество гостей: ' + data.reservation.guests })
      }
      this.$store.state.auth.user.notifications.unshift(data)
    },
    async acceptFastAction(data) {
      const notify = this.$store.state.auth.user.notifications.find(e => e._id == data._id)
      if (notify) notify.status = 'accepted'
    },
    async newTGUser() {
      this.$store.dispatch("lk/updateTGUsers")
    }
  },
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$store.dispatch("auth/checkAuth")
    }
  }
}
</script>

<style lang="scss">

.vue-notification-wrapper {
  overflow: visible !important;
}

.vc-text {
  margin-bottom: 5px !important;
}

.my-style {
  position: relative;
  padding: 10px 20px;
  box-shadow: 0 0 15px rgb(0 0 0 / 25%);
  border-radius: 8px;
  margin-bottom: 10px;
  margin-right: 10px;
 
  .notification-title {
    color: $color-black;
  }
 
  .notification-content {
    color: $color-black;
  }

  &:before {
    content: '';
    position: absolute;
    left: 5px;
    top: 5px;
    bottom: 5px;
    width: 3px;
    border-radius: 3px;
  }
 
  &.n-info {
    &:before {
      background-color: #eca62d;
    }
  }
  &.n-success {
    &:before {
      background-color: $color-blue;
    }
  }
  &.n-alarm {
    &:before {
      background-color: $color-red;
    }
  }
}

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
    max-width: calc(100% - 300px);
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

.theme--light.v-label {
  color: $color-black;
}

.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 15px;
}


</style>

