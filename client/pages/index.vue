<template lang="pug">
  .main
    .m-header
      .m-container
        .m-header__inner
          .m-header__logo toffee.menu
          .m-header__buttons
            .m-header__buttons-item.-xs-hidden
              nuxt-link(:to="localePath('/auth/login')").button.-transp Войти
            .m-header__buttons-item
              nuxt-link(:to="localePath('/auth/registration')").button.-black Регистрация
    .m-welcome
      kinesis-container
        .m-container
          .m-welcome__inner
            .m-welcome__content
              h1.m-welcome__title Электронное меню для ресторанов и кафе
              .m-welcome__text.-mobile Доступно по QR-коду и ссылке
              .m-welcome__text.-mobile Кнопка вызова официанта/попросить счет
              .m-welcome__text
                vue-typer(:text='["Доступно по QR-коду и ссылке", "Кнопка вызова официанта/попросить счет","Уведомления в Telegram", "Заказ к столику","Одна подписка на несколько заведений","Настраиваемые быстрые команды","Генератор QR-кодов с шаблонами для печати","Раздельный стоп-лист для заведений","Работает на любых устройствах","Индексируется в поисковых системах", "Без установки приложения"]')
              form.m-form(@submit.prevent="checkForm")
                //- .m-form__input(:class="{ 'focused': isEmailFocused }")
                  input(type="text" placeholder="Введите ваш email адрес" v-model="email" @input="checkForm" :class="{ 'validation-failed': emailValidationErrors[0] }" @focus="isEmailFocused = true" @blur="isEmailFocused = false")
                  .m-form__error.error-label {{ emailValidationErrors[0] }}
                .m-form__btn
                  nuxt-link(:to="localePath('/auth/registration')").button.-short.-black Начать бесплатно
                  a.m-welcome__try(:href="localePath('/m/toffee_menu?t=1')" target="_blank") Демо меню
              .m-welcome__note Попробуйте toffee.menu бесплатно в течение 14 дней,<br> кредитная карта не требуется.
              //- <br>Вводя свой email, вы соглашаетесь получать маркетинговые электронные письма от toffee.menu.
            kinesis-element(:strength="10" type="depth")
              .m-welcome__media
                img.m-welcome__media-qr(:src="require(`~/static/main-qr-white.png`)")
                .m-welcome__media-text Отсканируйте для просмотра демо меню или <a :href="localePath('/m/toffee_menu?t=1')" target="_blank">перейдите по ссылке</a>
    
    .m-container
      .m-section
        .m-section__title Что такое toffee_menu?
        .m-section__subtitle Сервис предоставляет 2 типа подписки
        .m-section__subtitle 14 дней бесплатного периода с доступом ко всем функциям

        .options
          .options__row
            .options__item.st
              .options__item-type Standart
              .options__item-text Меню с доступом по ссылке и QR-коду. Ссылкой удобно делиться в соц. сетях, а QR-код можно разместить на столиках, так гости будут быстрее получать доступ к меню и делать заказ
              .options__item-link(@click="scrollMeTo('sub')") Подробнее
                v-icon(light) mdi-arrow-right

            .options__item.pr
              .options__item-type Premium
              .options__item-text Включает в себя все возможности стандартной подписки, но QR-коды привязаны к столикам, а уведомления от них приходят в Telegram и на сайт. Так у посетителя появляется возможность быстро сделать заказ или, например, позвать официанта или попросить счет 
              .options__item-link(@click="scrollMeTo('sub')") Подробнее
                v-icon(light) mdi-arrow-right

    .fe-section
      .m-container
        .fe-section__inner
          .fe-section__image
            img.fe-section__image-file(:src="require(`~/static/table-tent.png`)")
          .fe-section__content
            .fe-section__title Удобнее печатного меню
            .fe-section__text Не нужно ждать, пока официант принесет меню
            .fe-section__text Электронное меню можно быстро обновить, нет необходимости перепечатывать меню
            .fe-section__btn
              nuxt-link(:to="localePath('/m/toffee_menu?t=1')" target="_blank").button.-black Посмотреть пример меню

    .fe-section.-white
      .m-container
        .fe-section__inner.-reverse
          .fe-section__content
            .fe-section__title Быстрый запуск
            .fe-section__text Создайте электронное меню без ожидания менеджера и участия специалистов
            .fe-section__text Просто следуйте инструкциям после регистрации
            .fe-section__btn
              nuxt-link(:to="localePath('/auth/registration')" target="_blank").button.-black Начать бесплатно
          .fe-section__image
            img.fe-section__image-file(:src="require(`~/static/create-icon.jpg`)")

    .steps
      .m-container
        .steps__title Несколько простых шагов
        .steps__inner
          .steps__item
            .steps__item-number 1
            .steps__item-title Регистрация
            .steps__item-text Бесплатный пробный период 14 дней
          .steps__item
            .steps__item-number 2
            .steps__item-title Настройка
            .steps__item-text Следуя инструкции после регистрации, заполните необходимые данные для начала работы
          .steps__item
            .steps__item-number 3
            .steps__item-title Заполнение меню
            .steps__item-text Создайте позиции, загрузите фотографии и напишите описание
          .steps__item
            .steps__item-number 4
            .steps__item-title Меню создано
            .steps__item-text Осталось разместить QR-коды или поделиться ссылкой

    .faq
      .m-container
        .faq__title FAQ
        .faq__inner
          .faq__item
            .faq__item-title Чем это лучше печатного меню?
            .faq__item-text Электронное меню доступно гостю сразу, не нужно ждать официанта. Его не нужно перепечатывать в случае изменений, достаточно отредактировать позицию на сайте. 
          .faq__item
            .faq__item-title Как будет выглядеть меню?
            .faq__item-text Посмотреть пример заполненного меню можно посмотреть по <a href="https://toffee.menu/m/toffee_menu?t=1" target="_blank">ссылке</a>
          .faq__item
            .faq__item-title А что если у меня несколько заведений?
            .faq__item-text Можно создать неограниченное количество заведений. Для каждого из них будут созданы ссылки и QR-коды, а отображение позиций меню можно настроить отдельно для каждого из заведений
          .faq__item
            .faq__item-title Как гости будут открывать меню?
            .faq__item-text Для каждого из созданных заведений можно скачать QR-код, распечатать его и разместить на столиках в заведении. Гости смогут сканировать qr-код камерой смартфона, чтобы открыть меню. Также будет сгенерирована ссылка, которую можно разместить в соц. сетях
          .faq__item
            .faq__item-title Как работает Telegram бот?
            .faq__item-text В него приходят уведомления о заказах, бронировании и быстрых командах. В админке toffee.menu можно настроить, с каких столиков будут приходить уведомления
          .faq__item
            .faq__item-title Что за быстрые команды?
            .faq__item-text Это команды, которые доступны гостю всего в два клика. По умолчанию созданы "Позвать официанта" и "Попросить счет", можно редактировать и создавать новые

    .subs(ref="sub")
      .subs__title Выберите подписку
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
                .subs__list-item-text Стилизация QR-кода под ваш стиль и настраиваемые шаблоны для печати
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

      .subs__note Полный возврат средств в первые 7 дней после покупки.<br> По всем вопросам пишите на <a href="mailto:admin@toffee.menu">admin@toffee.menu</a>

    footer.footer
      .m-container
        .footer__inner
          .footer__item
            a(href="https://t.me/toffee_menu")
              img(src="/icon-telegram.svg")
          .footer__item
            a(href="https://www.instagram.com/toffee.menu")
              img(src="/icon-instagram.svg")
        .footer__inner
          .footer__item
            a(href="mailto:admin@toffee.menu").footer__item-text admin@toffee.menu
          .footer__item
            a(href="tel:+7(995)626-84-72").footer__item-text +7(995)626-84-72
        .footer__inner
          .footer__item
            nuxt-link(:to="localePath('/docs/cookie')").footer__item-text Пользовательское соглашение
          .footer__item
            nuxt-link(:to="localePath('/docs/privacy_policy')").footer__item-text Политика конфиденциальности
        .footer__inner
          .footer__item
            nuxt-link(:to="localePath('/docs/privacy_policy')").footer__item-text Использование файлов cookie
        .footer__inner
          .footer__item
            .footer__item-text © 2021 Все права защищены

    CookiesAgreement(v-if="!isCookiesAgreed" @closePopup="closePopup()")


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
      loading: false,
      isCookiesAgreed: true
    }
  },
  mounted() {
    this.isCookiesAgreed = this.$route.params.id == 'toffee.menu' ? true : localStorage.getItem('cookie')
  },
  methods: {
    scrollMeTo(refName) {
      const element = this.$refs[refName];
      window.scrollTo({
        top: element.offsetTop - 20,
        behavior: 'smooth'
      });
    },
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
    },
    closePopup() {
      localStorage.setItem('cookie', true)
      this.isCookiesAgreed = true
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

.m-section {
  padding: 0 0 30px 0;
  @media screen and (min-width: 768px) {
    padding: 0 0 60px 0;
  }
  &__title {
    text-align: center;
    font-size: 28px;
    color: $color-black;
    @media screen and (min-width: 768px) {
      font-size: 38px;
    }
  }
  &__subtitle {
    color: $color-black;
    text-align: center;
    font-size: 16px;
    line-height: 1.2;
    margin-bottom: 10px;
    @media screen and (min-width: 768px) {
      font-size: 20px;
    }
  }
}

.options {
  margin-top: 30px;
  @media screen and (min-width: 768px) {
    margin-top: 40px;
    margin-bottom: 30px;
  }
  &__row {
    @media screen and (min-width: 768px) {
      display: flex;
      justify-content: center;
    }
  }
  &__item {
    background-color: #f2f2f2;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto 20px;
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 768px) {
      padding: 35px;
      margin: 0 20px 0 0;
      &:last-child {
        margin-right: 0;
      }
    }
    &.st {
      border-bottom: 3px solid #fda076;
    }
    &.pr {
      border-bottom: 3px solid #7476da;
    }
    

    &-type {
      color: $color-black;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 18px;
      margin-bottom: 15px;
    }
    &-text {
      color: $color-black;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 15px;
    }
    &-link {
      color: $color-black;
      font-weight: bold;
      cursor: pointer;
      line-height: 25px;
      transition: opacity .3s;
      margin-top: auto;
      &:hover {
        opacity: 0.8;
        .v-icon {
          transform: translateX(10px);
        }
      }
      .v-icon {
        font-size: 20px;
        margin-left: 10px;  
        color: $color-black;
        transition: transform .3s;
      }
    }
  }
}

.fe-section {
  background-color: #f2f2f2;
  margin-bottom: 30px;
  &.-white {
    background-color: #fff;
  }
  @media screen and (min-width: 768px) {
    margin-bottom: 50px;
  }
  &__inner {
    padding: 15px 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    @media screen and (min-width: 768px) {
      padding: 30px 0;
      flex-direction: row;
    }
    &.-reverse {
      flex-direction: column-reverse;
      @media screen and (min-width: 768px) {
        flex-direction: row;
      }
    }
  }
  &__content {
    flex-shrink: 0;
  }
  &__image {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    &-file {
      width: 100%;
      max-width: 360px;
      height: auto;
    }
    @media screen and (min-width: 768px) {
      margin: 0 20px;
      &-file {
        max-width: 100%;
      }
    }
  }
  &__title {
    color: $color-black;
    margin-bottom: 10px;
    font-size: 32px;
    line-height: 1.20;
    @media screen and (min-width: 1024px) {
      font-size: 36px;
    }
  }
  &__text {
    color: $color-black;
    font-size: 16px;
    margin-bottom: 10px;
    line-height: 1.3;
    font-weight: 300;
    max-width: 345px;
    @media screen and (min-width: 768px) {
      font-size: 18px;
    }
  }
  &__btn {
    display: inline-block;
    margin-top: 20px;
  }
}

.steps {
  padding: 20px 0;
  @media screen and (min-width: 768px) {
    padding: 50px 0;
  }
  &__title {
    font-size: 28px;
    line-height: 1.2;
    margin-bottom: 20px;
    text-align: center;
    @media screen and (min-width: 768px) {
      font-size: 36px;
      margin-bottom: 40px;
    }
  }
  &__inner {
    margin-top: 20px;
    @media screen and (min-width: 768px) {
      display: flex;
    }
  }
  &__item {
    position: relative;
    text-align: center;
    padding: 0 5px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    @media screen and (min-width: 768px) {
      margin-bottom: 0;
    } 
    &-number {
      text-align: center;
      font-size: 28px;
      color: $color-blue;
      @media screen and (min-width: 768px) {
        margin-bottom: 5px;
      }
      @media screen and (min-width: 1024px) {
        margin-bottom: 10px;
      }
    }
    &-title {
      font-size: 18px;
      margin-bottom: 10px;
      color: $color-black;
      line-height: 1.2;
      @media screen and (min-width: 1024px) {
        font-size: 20px;
      }
    }
    &-text {
      line-height: 1.3;
      color: $color-black;
      font-weight: 300;
      font-size: 14px;
      max-width: 310px;
      margin: 0 auto;
      @media screen and (min-width: 768px) {
        max-width: 100%;
      }
      @media screen and (min-width: 1024px) {
        font-size: 16px;
      }
    }
  }
}

.faq {
  padding: 30px 0;
  @media screen and (min-width: 768px) {
      padding: 50px 0;
    }
  &__inner {
    @media screen and (min-width: 768px) {
      display: flex;
      flex-wrap: wrap;
    }
  }
  &__title {
    font-size: 28px;
    line-height: 1.2;
    margin-bottom: 20px;
    text-align: center;
    @media screen and (min-width: 768px) {
      font-size: 36px;
      margin-bottom: 40px;
    }
  }
  &__item {
    margin-bottom: 30px;
    color: $color-black;
    @media screen and (min-width: 768px) {
      padding-right: 30px;
      width: 50%;
    }
    &-title {
      font-size: 20px;
      line-height: 1.3;
      margin-bottom: 10px;
    }
    &-text {
      font-weight: 300;
    }
  }
}

.fade-enter-active {
  animation: go .2s;
}

@keyframes go {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

