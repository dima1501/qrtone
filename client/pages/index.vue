<template lang="pug">
  .main
    .m-header
      .m-container
        .m-header__inner
          .m-header__buttons
            .m-header__buttons-item
              nuxt-link(to="/auth/login").button.-transp Войти
            .m-header__buttons-item
              nuxt-link(to="/auth/registration").button.-black Регистрация
    .m-welcome
      .m-container
        .m-welcome__inner
          .m-welcome__content
            h1.m-welcome__title Электронное QR меню <br>для ресторанов и кафе
            form.m-form
              .m-form__input
                input(type="email" placeholder="Введите ваш email адрес" required)
              .m-form__btn
                .button.-short.-black Начать бесплатно
            p.m-welcome__note Попробуйте QRTONE бесплатно в течение 14 дней, кредитная карта не требуется.<br>Вводя свой email, вы соглашаетесь получать маркетинговые электронные письма от QRTone.
          .m-welcome__media
            video(src="video2.mp4" autoplay muted loop)

</template>

<script>
export default {
  layout: 'main'
}
</script>

<style lang="scss">
@import '../assets/default.scss';
@import '../assets/buttons.scss';
@import '../assets/m-header.scss';
@import '../assets/m-welcome.scss';
@import '../assets/m-form.scss';



</style>

