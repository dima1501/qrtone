<template lang="pug">
    .auth
        .auth__logo toffee.menu
        h1.auth__title Пробная подписка на 14 дней
        .auth__content
            v-form(
            @submit.prevent="fetchCompanyRegistration"
            v-model="isCompanyRegistrationValid")
                v-text-field(
                ref="name"
                v-model="registrationData.name"
                :rules="nameRules"
                label="Название компании"
                required)
                v-text-field(
                ref="email"
                v-model="registrationData.email"
                :rules="emailRules"
                label="Email")
                v-text-field(
                v-model="registrationData.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Пароль"
                @click:append="showPassword = !showPassword")
                .auth__buttons.mt-5
                    v-btn(
                    depressed
                    :to="localePath('/auth/login')"
                    ) Войти
                    v-btn(
                    depressed
                    color="primary"
                    :disabled="!isCompanyRegistrationValid"
                    type="submit"
                    ) Регистрация
                nuxt-link(:to="localePath('/auth/restore')").auth__restore Восстановить пароль

</template>

<script>
export default {
    name: 'registration',
    layout: 'login',
    data() {
        return {
            isCompanyRegistrationValid: false,
            showPassword: false,
            registrationData: {
                name: '',
                password: '',
                email: '',
            },
            nameRules: [
                (v) => !!v || 'Введите название компании',
            ],
            emailRules: [
                (v) => !!v || 'Введите адрес электронной почты',
                (v) =>
                !v ||
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                'Ошибка в адресе электронной почты',
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
        fetchCompanyRegistration() {
            this.$store.dispatch('auth/registrationAction', this.registrationData)
        },
    },
    mounted() {
        if (!this.$store.state.auth.user) {
            this.$store.dispatch("auth/checkAuth", { page: 'registration' })
        } else {
            $nuxt.$router.push($nuxt.localePath({ path: '/lk/settings' }))
        }
    }
}
</script>


<style lang="scss">
.auth {
    &__title {
        margin-bottom: 20px;
    }
}
</style>

