<template lang="pug">
  v-app
    .p-error
      .p-error__video
        video(:src="require('~/static/travolta.mp4')" autoplay loop muted)
      .p-error__content
        .p-error__num 404
        .p-error__title Page not found
        nuxt-link(:to="localePath('/')").p-error__link Back to home
</template>
<script>
export default {
  name: 'error',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 20px;
}

.p-error {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  height: 100%; 
  &__video {
    video {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      object-fit: cover;
      width: 100%;
      height: 100%;
      opacity: 0.7;
    }
  }
  &__content {
    position: relative;
    z-index: 2;
    color: #fff;
    text-align: center;
    padding-top: 100px;
  }
  &__title {
    font-size: 36px;
    font-weight: lighter;
    margin-bottom: 15px;
  }
  &__num {
    font-weight: bold;
    font-size: 170px;
    line-height: 1;
  }
  &__link {
    color: $color-blue;
    text-decoration: none;
    font-size: 18px;
  }
}
</style>
