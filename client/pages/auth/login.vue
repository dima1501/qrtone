<template lang="pug">
    .auth
        .auth__logo toffee.menu
        h1.auth__title Вход в аккаунт
        .auth__content
            v-form(
            @submit.prevent="fetchCompanyLogin"
            v-model="isCompanyRegistrationValid")
                v-text-field(
                ref="email"
                v-model="loginData.email"
                :rules="emailRules"
                label="Email")
                v-text-field(
                v-model="loginData.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                :label="'Пароль'"
                @click:append="showPassword = !showPassword")
                .auth__buttons.mt-5
                    v-btn(
                    depressed
                    :to="localePath('/auth/registration')"
                    ) Регистрация
                    v-btn(
                        depressed 
                        color="primary"
                        :disabled="!isCompanyRegistrationValid"
                        type="submit"
                    ).e-card__bottom-item Войти
                nuxt-link(:to="localePath('/auth/restore')").auth__restore Восстановить пароль


</template>

<script>
const Isemail = require('isemail')

export default {
    layout: 'login',
    data() {
        return {
            isCompanyRegistrationValid: false,
            showPassword: false,
            loginData: {
                password: '',
                email: '',
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            emailRules: [
                (v) => Isemail.validate(v) || 'Введите адрес электронной почты',
            ],
            passwordRules: [
                (v) => !!v || 'Введите пароль',
                (v) =>
                (v && v.length >= 5) || 'Ошибка в пароле. Минимум 6 символов, одна цифра, один знак. Без символов',
                (v) =>
                /(?=.*[A-Z])/.test(v) ||
                'Ошибка в пароле. Минимум 6 символов, одна цифра, один знак. Без символов',
                (v) =>
                /(?=.*\d)/.test(v) ||
                'Ошибка в пароле. Минимум 6 символов, одна цифра, один знак. Без символов',
            ],
        }
    },
    methods: {
        fetchCompanyLogin() {
            this.$store.dispatch('auth/loginAction', this.loginData)
        },
    },
    mounted() {
        if (!this.$store.state.auth.user) {
            this.$store.dispatch("auth/checkAuth", { page: 'login' })
        } else {
            $nuxt.$router.push($nuxt.localePath({ path: '/lk/settings' }))
        }
    }
}
</script>


<style lang="scss">


</style>

