<template lang="pug">
  v-app
    Nuxt
    CookiesAgreement(v-if="!isCookiesAgeed" @closePopup="closePopup()")
</template>

<script>

export default {
  data() {
    return {
      isCookiesAgeed: true
    }
  },
  sockets: {
    async updateSocketId(msg) {
        this.$store.dispatch("guest/setSocketId", msg, { root: true });
    },
    async acceptOrder(data) {
        this.$store.state.guest.user.orders.find(e => e.orderId === data).status = 'accepted'
    }
  },
  created() {
      // this.$store.dispatch("guest/loadData", {id: this.$route.params.id, place: this.$route.query.place }, { root: true })
  },
  mounted() {
    this.$store.dispatch("guest/setSocketId", this.$socket.id, { root: true });
    if (!this.$store.state.guest.user) {
      this.$store.dispatch("guest/checkAuth", this.$route.params.id);
    }
    this.isCookiesAgeed = this.$route.params.id == 'Dimas_diner' ? true : localStorage.getItem('cookie')
  },
  methods: {
    closePopup() {
      localStorage.setItem('cookie', true)
      this.isCookiesAgeed = true
    }
  }
}
</script>

<style lang="scss">
@import '../assets/sorder.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.v-application {
  font-family: $body-font-family;
}

body {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
}
html {
    overflow-y: scroll;
    overflow-x: hidden;
}

.slick-next {
  right: 5px !important;
  z-index: 3 !important;
}

.slick-prev {
  left: 5px !important;
  z-index: 3 !important;
}

img {
  // image-rendering: -webkit-optimize-contrast;
}

</style>

