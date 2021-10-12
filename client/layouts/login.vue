<template lang="pug">
v-app
    client-only
        kinesis-container
            .login
                .login__bg
                .login__inner
                    .login__form
                        Nuxt
                    .login__media
                        kinesis-element(:strength="7" type="depth")
                            .m-welcome__media
                                kinesis-element(:strength="7" type="depth")
                                    img.m-welcome__media-qr(:src="require(`~/static/main-qr-white.png`)")
                                kinesis-element(:strength="7" type="depth")
                                    .m-welcome__media-text Отсканируйте для просмотра демо меню или <a href='https://toffee.menu/m/toffee_menu?t=1' target="_blank">перейдите по ссылке</a>

    client-only
        notifications(
            group="custom-style"
            position="right bottom"
            classes="my-style"
            :max="6"
            :width="300"
            :duration="4000")
</template>

<script>

export default {
  
}
</script>

<style lang="scss">
@import '../assets/m-welcome.scss';

.login {
    position: relative;
    min-height: 100vh;
    &__bg {
        background-color: #F4FFD3;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 258px;
    }
    &__inner {
        position: relative;
        max-width: 1080px;
        margin: 0 auto;
        display: flex;
        padding: 70px 0 30px 0;
        min-height: 100vh;
        @media screen and (min-width: 768px) {
            align-items: flex-start;
            padding-top: 86px;
        }
    }
    &__form {
        max-width: 90%;
        flex-grow: 1;
        background-color: #fff;
        padding: 40px 15px;
        margin: 0 auto;
        @media screen and (min-width: 1024px) {
            padding: 55px 100px;
            max-width: 550px;
        }
    }
    &__media {
        display: none;
        @media screen and (min-width: 1024px) {
            display: block;
            flex-shrink: 0;
            width: 340px;
            margin-left: auto;
        }
    }
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active
{
 -webkit-box-shadow: 0 0 0 30px white inset !important;
}

.auth {
    &__title {
        margin-bottom: 32px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        
    }
    &__logo {
        font-size: 18px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 40px;
        text-align: center;
        @media screen and (min-width: 768px) {
            margin-bottom: 32px;
        }
    }
    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__restore {
        text-align: center;
        color: $color-blue;
        text-decoration: none;
        font-size: 14px;
        display: block;
        margin-top: 20px;
        &-text {
            text-align: center;
            font-size: 14px;
            margin-bottom: 15px;
        }
    }
}

</style>

