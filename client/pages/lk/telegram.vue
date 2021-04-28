<template lang="pug">
  div(v-if="$store.state.auth.user")
    .telega
        h1.page__title Телеграм бот
        .telegram
            // .telegram__content Чтобы воспользоваться ботом, перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR код. Далее потребуется ввести код <span>123</span>
            .telegram__content Чтобы воспользоваться ботом, перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR код. Далее потребуется ввести код <span>{{$store.state.auth.user.bot_token}}</span>
            .telegram__qr(v-html="qr")
        p.page__note
    div(v-if="$store.state.auth.user.telegram")
      .t-line(v-for="(place, key) in $store.state.auth.user.telegram" v-bind:key="key") 
        div(v-for="(item, key) in place" v-bind:key="key") {{ item.user.first_name }} {{ item.user.last_name }}


</template>

<script>
import QRCode from 'qrcode'

export default {
  layout: 'lk',
  data() {
    return {
      qr: null
    }
  },
  async mounted() {
    const qr = await QRCode.toString(`https://t.me/SafetyMenuBot`)

    this.qr = qr
  },
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
</style>
