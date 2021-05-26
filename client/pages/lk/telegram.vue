<template lang="pug">
  div(v-if="$store.state.auth.user && isAvailable")
    .telega
        h1.page__title Телеграм бот
        .telegram
            .telegram__content(v-if="$store.state.auth.user.places.length") Чтобы воспользоваться ботом, перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR код. Далее потребуется ввести код <span>{{$store.state.auth.user.bot_token}}</span>
            .telegram__content(v-else) <span @click="openAddPlacePopup"> Создайте заведение</span>, чтобы начать использовать бота
            .telegram__qr(v-html="qr")
        p.page__note
    h2 Подключенные пользователи
    div(v-if="$store.state.auth.user.telegram")
      .t-line(v-for="(place, key) of $store.state.auth.user.places" v-bind:key="key" v-if="$store.state.auth.user.telegram[place._id] && $store.state.auth.user.telegram[place._id].length") 
        h3 {{place.name}}
        div(v-for="(item, key) in $store.state.auth.user.telegram[place._id]" v-bind:key="key").t-line__item
          div {{ item.user.first_name }} {{ item.user.last_name }}

          input(type="checkbox" id="notificationsToggle" :checked="item.notifications == 'all'" @change="toggleNotify($event, item, place)")
          label(for="notificationsToggle") Получать уведомления со всех столиков

          div(v-if="item.notifications == 'partially' || notificationsToggle")
            h5 Отметьте столики, с которых должны приходить уведомления
            .tables
              .tables__item(v-for="(table, idx) in place.tables" v-bind:key="idx" @click="selectTable(table, item, place)" :class="{ active: item.tables.indexOf(table) > -1 }") {{ formatTable(table) }}
  div(v-else)
    h2 Доступно с подпиской Premium 
    nuxt-link(:to="localePath('/lk/settings')") Настройки

</template>

<script>
import QRCode from 'qrcode'
import moment from 'moment';

export default {
  layout: 'lk',
  data() {
    return {
      qr: null,
      notificationsToggle: null
    }
  },
  async mounted() {
    const qr = await QRCode.toString(`https://t.me/SafetyMenuBot`)
    this.qr = qr
  },
  computed: {
    isAvailable() {
      const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
      const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
      const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
      return !isStandart && isNotExpired || isTrial
    }
  },
  methods: {
    openAddPlacePopup() {
      this.$store.state.view.popup.addPlacePopup.visible = true
    },
    formatTable(table) {
      if (typeof table == 'number') {
          return table
      } else {
          return table.replace('%20', ' ')
      }
    },
    selectTable(table, item, place) {
      item.notifications = 'partially'
      if (item.tables.indexOf(table) == -1) {
        item.tables.push(table)
      } else {
        item.tables.splice(item.tables.indexOf(table), 1)
      }
      this.$store.dispatch("lk/updateTGTables", {
        placeId: place._id,
        item
      })
    },
    toggleNotify($event, item, place) {
      this.notificationsToggle = !$event.target.checked
      if ($event.target.checked) {
        item.notifications = 'all'
      } else {
        item.notifications = 'partially'
      }
      this.$store.dispatch("lk/updateTGTables", {
          placeId: place._id,
          item
      })
    }
  }
}
</script>

<style lang="scss"> 
.telegram {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #F5F7FB;
  border-radius: 14px;
  max-width: 400px;

  &__content {
    padding-right: 15px;
  }

  &__qr {
    width: 150px;
    flex-shrink: 0;
  }

  span {
    background-color: rgb(224, 224, 224);
    padding: 2px 5px;
    border-radius: 3px;
  }
}

.t-line {
  &__item {
    background-color: rgb(224, 224, 224);
    padding: 10px;
    margin-bottom: 30px;
  }
}

.tables {
  display: flex;
  flex-wrap: wrap;
  &__item {
    padding: 10px;
    border: 2px solid #000;
    margin-right: 10px;
    &.active {
      background-color: $color-blue;
    }
  }
}
</style>
