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
            form.m-form(@submit.prevent="checkForm")
              //- .m-form__input(:class="{ 'focused': isEmailFocused }")
                input(type="text" placeholder="Введите ваш email адрес" v-model="email" @input="checkForm" :class="{ 'validation-failed': emailValidationErrors[0] }" @focus="isEmailFocused = true" @blur="isEmailFocused = false")
                .m-form__error.error-label {{ emailValidationErrors[0] }}
              .m-form__btn
                button(type="submit" to="auth/registration").button.-short.-black Начать бесплатно
            p.m-welcome__note Попробуйте QRTONE бесплатно в течение 14 дней, кредитная карта не требуется.<br>Вводя свой email, вы соглашаетесь получать маркетинговые электронные письма от QRTone.
          .m-welcome__media
            video(src="video2.mp4" autoplay muted loop)

</template>

<script>
export default {
  layout: 'public',
  data() {
    return {
      emailValidationErrors: [],
      email: null,
      isButtonClicked: false,
      isEmailFocused: false
    }
  },
  methods: {
    checkForm: function (e) {
      this.emailValidationErrors = [];

      if (e.type == 'submit') {
        this.isButtonClicked = true
      }

      if (this.isButtonClicked) {
        if (!this.email) {
          this.emailValidationErrors.push('Укажите электронную почту.');
        } else if (!this.validEmail(this.email)) {
          this.emailValidationErrors.push('Укажите корректный адрес электронной почты.');
        } 
      }
      
      if (!this.emailValidationErrors.length) {
        return true;
      }

      e.preventDefault();
    },
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
}
</script>

<style lang="scss">
@import '../assets/default.scss';
@import '../assets/buttons.scss';
@import '../assets/m-header.scss';
@import '../assets/m-welcome.scss';
@import '../assets/m-form.scss';



</style>

