<template lang="pug">
  .sidebar(v-if="$store.state.auth.user")
    .sidebar__name QRTone
    nuxt-link(:to="localePath('/lk/settings')").sidebar__settings
    .sidebar__company
      // .sidebar__company-logo(v-bind:style="{ backgroundImage: 'url(' + ($store.state.auth.user.photo ? '../../uploads/' + $store.state.auth.user.photo : '' ) + ')' }")
      .sidebar__company-logo(v-if="$store.state.auth.user.photo" v-bind:style="{ backgroundImage: 'url(../../uploads/' + $store.state.auth.user.photo +')' }")
      .sidebar__company-name {{ $store.state.auth.user.name }}
    nav.sidebar__nav
      nuxt-link(:to="localePath('/lk/orders')").sidebar__nav-item
        .sidebar__nav-icon
        .sidebar__nav-name Дэшборд
      nuxt-link(:to="localePath('/lk/menu')").sidebar__nav-item
        .sidebar__nav-icon
        .sidebar__nav-name Меню
      nuxt-link(:to="localePath('/lk/qr')").sidebar__nav-item
        .sidebar__nav-icon
        .sidebar__nav-name QR-коды
      nuxt-link(:to="localePath('/lk/telegram')").sidebar__nav-item
        .sidebar__nav-icon
        .sidebar__nav-name Телеграм бот
</template>

<script>

export default {
  name: 'Sidebar',
  methods: {
  }
}
</script>


<style lang="scss">
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  background-color: #00293B;
  border-radius: 0 40px 40px 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px;

  &__name {
    color: #fff;
    font-weight: 400;
    font-size: 22px;
    line-height: 34px;
    letter-spacing: -0.1px;
    margin-bottom: 40px;
  }

  &__settings {
    position: absolute;
    top: 24px;
    right: 26px;
    width: 16px;
    height: 16px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('../../static/gear.svg');
    transition: transform .3s;

    &:hover {
      transform: rotate(180deg);
    }
  }

  &__company {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;

    &-logo {
      margin-bottom: 17px;
      width: 90px;
      height: 90px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    &-name {
      font-family: Inter, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      text-align: center;
      letter-spacing: -0.3px;
      color: #FFF;
    }
  }

  &__nav {

    &-item {
      margin-bottom: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
    }

    &-icon {
      margin-bottom: 12px;
    }

    &-name {
      font-family: Inter, sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 20px;
      text-align: center;
      letter-spacing: -0.3px;
      color: #FFF;
    }
  }
}
</style>
