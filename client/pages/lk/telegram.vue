<template lang="pug">
  .telega
    div(v-if="$store.state.auth.user && isAvailable")
      h1.page__title Телеграм бот
      .telegram
          .telegram__content(v-if="$store.state.auth.user.places.length") 
            p Перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR код
            p Введите команду <code>/login</code>
            p Введите код <code>{{$store.state.auth.user.bot_token}}</code>
          .telegram__content(v-else) <span @click="openAddPlacePopup"> Создайте заведение</span>, чтобы начать использовать бота
          .telegram__qr(v-html="qr")
      p.page__note
      div(v-if="$store.state.auth.user.telegram")
        .t-line(v-for="(place, key) of $store.state.auth.user.places" v-bind:key="key") 
          h3.t-line__title {{place.name}}
          div(v-for="(item, key) in $store.state.auth.user.telegram[place._id]" v-bind:key="key").t-line__item
            div.t-line__username {{ item.user.first_name }} {{ item.user.last_name }}

            v-checkbox(@change="toggleNotify($event, item, place)" :input-value="item.notifications == 'all'" label="Уведомления со всех столиков" hide-details="auto" :id="place.id").mt-1

            div(v-if="item.notifications == 'partially' || notificationsToggle")
              
              .tables
                .tables__row
                  .tables__item(v-for="(table, idx) in place.tables" v-bind:key="idx" @click="selectTable(table, item, place)" :class="{ active: item.tables.indexOf(table) > -1 }") {{ formatTable(table) }}
                .tables__note Отметьте столики, с которых должны приходить уведомления

          .t-line__note(v-if="!$store.state.auth.user.telegram[place._id] || !$store.state.auth.user.telegram[place._id].length") Пользователи пока не подключены

    div(v-else)
      h2 Доступно с подпиской Premium 
      nuxt-link(:to="localePath('/lk/settings')") Настройки

</template>

<script>
import QRCode from 'qrcode'
import moment from 'moment'

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
      if ($event) {
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
.telega {
  margin-bottom: 30px;
}
.telegram {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  border-radius: 14px;
  max-width: 440px;
  border: 3px solid #F5F7FB;
  box-shadow: 0 0 20px rgb(0 0 0 / 20%);
  border-radius: 16px;
  margin-top: 20px;

  @media screen and (min-width: 410px) {
    flex-direction: row;
  }

  &__content {
    padding-right: 15px;
  }

  &__qr {
    width: 200px;
    flex-shrink: 0;
  }

  span {
    background-color: rgb(224, 224, 224);
    padding: 2px 5px;
    border-radius: 3px;
  }
}

.t-line {
  padding: 15px 0;
  max-width: 440px;
  &__title {
    margin-bottom: 10px;
  }
  &__item {
    padding: 10px;
    border: 3px solid #F5F7FB;
    box-shadow: 0 0 20px rgb(0 0 0 / 20%);
    border-radius: 16px;
  }
  &__note {
    color: $color-black;
    font-size: 14px;
  }
  &__username {
    margin-bottom: 5px; 
    font-size: 18px;
  }
}

.tables {
  margin-top: 15px;
  &__row {
    display: flex;
    flex-wrap: wrap;
  }
  &__note {
    font-size: 14px;
    color: $color-black;
    line-height: 1.3;
  }
  &__item {
    padding: 3px 10px;
    border: 1px solid rgb(214, 207, 207);
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 5px;
    cursor: pointer;
    transition: color .3s, background-color .3s, border-color .3s;
    &.active {
      color: white;
      background-color: $color-blue;
      border-color: white;
    }
  }
}
</style>
