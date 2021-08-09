<template lang="pug">
  .main
    .m-header
      .m-container
        .m-header__inner
          .m-header__logo QRTONE
          .m-header__buttons
            .m-header__buttons-item
              nuxt-link(:to="localePath('/auth/login')").button.-transp Войти
            .m-header__buttons-item
              nuxt-link(:to="localePath('/auth/registration')").button.-black Регистрация
    .m-welcome
      kinesis-container
        .m-container
          .m-welcome__inner
            .m-welcome__content
              h1.m-welcome__title Электронное меню для ресторанов и кафе
              p.m-welcome__text С доступом по QR коду и уведомлениями в telegram
              a.m-welcome__try(href="http://localhost:3000/m/Dimas_diner?t=1" target="_blank") Демо меню
              form.m-form(@submit.prevent="checkForm")
                //- .m-form__input(:class="{ 'focused': isEmailFocused }")
                  input(type="text" placeholder="Введите ваш email адрес" v-model="email" @input="checkForm" :class="{ 'validation-failed': emailValidationErrors[0] }" @focus="isEmailFocused = true" @blur="isEmailFocused = false")
                  .m-form__error.error-label {{ emailValidationErrors[0] }}
                .m-form__btn
                  nuxt-link(:to="localePath('/auth/registration')").button.-short.-black Начать бесплатно
              .m-welcome__note Попробуйте QRTONE бесплатно в течение 14 дней,<br> кредитная карта не требуется.
              //- <br>Вводя свой email, вы соглашаетесь получать маркетинговые электронные письма от QRTone.
            kinesis-element(:strength="10" type="depth")
              .m-welcome__media
                kinesis-element(:strength="10" type="depth")
                  img.m-welcome__media-qr(:src="require(`~/static/main-qr-white.png`)")
                kinesis-element(:strength="10" type="depth")
                  .m-welcome__media-text Отсканируйте для просмотра демо меню или <a href='http://localhost:3000/m/Dimas_diner?t=1' target="_blank">перейдите по ссылке</a>


    .subs
      h2.subs__title Выберите подписку
      .subs__subtitle Подходящую под ваши требования
      .subs__inner
        .subs__item
          h3.subs__item-title Standart
          .subs__item-content
            .subs__list
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Цифровое меню с неограниченным количеством блюд и категорий
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Меню доступно по QR-коду и ссылке
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Адаптивный интерфейс для работы с любых устройств
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Информация о компании индексируется в поисковых системах
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Неограниченное количество заведений
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Раздельный стоп-лист для каждого заведения
              //- .subs__list-item 
              //-     .subs__list-item-icon
              //-         v-icon(light) mdi-checkbox-marked-circle 
              //-     .subs__list-item-text Интерфейс на Русском и Английском языках
              .subs__list-item 
                .subs__list-item-icon
                  v-icon(light) mdi-checkbox-marked-circle 
                .subs__list-item-text Стилизация QR-кода под ваш стиль
              .subs__list-item 
                .subs__list-item-icon
                  v-icon(light) mdi-checkbox-marked-circle 
                .subs__list-item-text Готовые PDF шаблоны для печати
              .subs__list-item 
                .subs__list-item-icon
                  v-icon(light) mdi-checkbox-marked-circle 
                .subs__list-item-text Быстрый запуск без ожидания менеджера
                
            nuxt-link(:to="localePath('/auth/registration')" target="_blank").subs__plan.-blue
              .subs__plan-period 1 месяц
              .subs__plan-price
                .subs__plan-price-value 750₽

            nuxt-link(:to="localePath('/auth/registration')" target="_blank").subs__plan.-orange
              .subs__plan-period 6 месяцев
              .subs__plan-price
                .subs__plan-price-value 4200₽
                .subs__plan-price-sale 700₽/мес

            nuxt-link(:to="localePath('/auth/registration')" target="_blank").subs__plan.-voilet
              .subs__plan-period 12 месяцев
              .subs__plan-price
                .subs__plan-price-value 7800₽
                .subs__plan-price-sale 650₽/мес

        .subs__item
          h3.subs__item-title Premium
          .subs__item-content
            .subs__list
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Все пункты подписки Standart
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Telegram бот для получения уведомлений от посетителей
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Заказ к столику
              .subs__list-item 
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Настраиваемые быстрые команды (Позвать официанта / Попросить счет и тд)
              .subs__list-item 
                      .subs__list-item-icon
                          v-icon(light) mdi-checkbox-marked-circle 
                      .subs__list-item-text Удобная форма бронирования на сайте
              .subs__list-item
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Заполним ваше меню, просто отправьте нам все необходимые данные
              .subs__list-item
                  .subs__list-item-icon
                      v-icon(light) mdi-checkbox-marked-circle 
                  .subs__list-item-text Зарегистрируйте официантов для быстрого получения чаевых через любой сервис

            nuxt-link(:to="localePath('/auth/registration')").subs__plan.-blue
              .subs__plan-period 1 месяц
              .subs__plan-price
                .subs__plan-price-value 1500₽

            nuxt-link(:to="localePath('/auth/registration')").subs__plan.-orange
              .subs__plan-period 6 месяцев
              .subs__plan-price
                .subs__plan-price-value 8400₽
                .subs__plan-price-sale 1400₽/мес

            nuxt-link(:to="localePath('/auth/registration')").subs__plan.-voilet
              .subs__plan-period 12 месяцев
              .subs__plan-price
                .subs__plan-price-value 15600₽
                .subs__plan-price-sale 1300₽/мес

      .subs__note Полный возврат средств в первые 7 дней после покупки.<br> По всем вопросам пишите на <a href="mailto:info@qrtone.com">info@qrtone.com</a>


    footer.footer
      .m-container
        .footer__inner
          .footer__item
            nuxt-link(:to="localePath('/')").footer__item-text Условия использования
          .footer__item
            nuxt-link(:to="localePath('/')").footer__item-text Пользовательское соглашение
        .footer__inner
          .footer__item
            a(href="mailto:info@qrtone.com").footer__item-text info@qrtone.com
          .footer__item
            a(href="https://www.instagram.com/dima.voropaev" target="_blank").footer__item-text Instagram
          .footer__item
            a(href="tel:8(950)046-84-72").footer__item-text 8(950)046-84-72
        .footer__inner
          .footer__item
            .footer__item-text © 2021 Все права защищены. QRTONE


</template>

<script>
export default {
  layout: 'public',
  data() {
    return {
      emailValidationErrors: [],
      email: null,
      isButtonClicked: false,
      isEmailFocused: false,
      loading: false
    }
  },
  
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
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
@import '../assets/subs.scss';
@import '../assets/footer.scss';
</style>

