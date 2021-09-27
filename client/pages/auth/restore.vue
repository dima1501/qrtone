<template lang="pug">
    .auth
        .auth__logo toffee.menu
        h1.auth__title Восстановление пароля
        .auth__content(v-if="$store.state.auth.restore.isKeyValid")
            v-form(
            @submit.prevent="updatePassword"
            v-model="isUpdatePasswordValid")
                v-text-field(
                autocomplete="false"
                name="password_new"
                type="password"
                v-model="$store.state.auth.restore.newPassword"
                :rules="passwordRules"
                label="Введите новый пароль")
                v-text-field(
                autocomplete="false"
                name="password_new_2"
                type="password"
                v-model="$store.state.auth.restore.newPasswordRepeat"
                :rules="passwordRulesRepeat"
                label="Введите новый пароль")
                .auth__buttons.mt-5
                    v-btn(
                    text
                    :to="localePath('/auth/registration')"
                    ) Регистрация
                    v-btn(
                    text
                    :to="localePath('/auth/login')"
                    ) Вход
                    v-spacer
                    v-btn(
                    color="primary"
                    :disabled="!isUpdatePasswordValid"
                    text
                    type="submit"
                    ) Далее

        .auth__content(v-if="!$store.state.auth.restore.isEmailSent && !$store.state.auth.restore.isKeyValid")
            v-form(
            @submit.prevent="sendRestoreEmail"
            v-model="isRestoreValid")
                v-card-text
                    v-text-field(
                    ref="email"
                    type="email"
                    v-model="$store.state.auth.restore.email"
                    :rules="emailRules"
                    label="Введите email")
                .auth__buttons
                    v-btn(
                    color="primary"
                    :disabled="!isRestoreValid"
                    text
                    type="submit"
                    ) Восстановить
                v-divider(class="mt-6")
                .auth__buttons
                    v-btn(
                    text
                    :to="localePath('/auth/registration')"
                    ) Регистрация
                    v-btn(
                    text
                    :to="localePath('/auth/login')"
                    ) Вход
                    

        .auth__content(v-else-if="!$store.state.auth.restore.isKeyValid")
            v-form(
            @submit.prevent="checkKey"
            v-model="isRestoreKeyValid")
                .auth__restore-text На указанную почту был отправлен код для восстановления пароля
                v-card-text
                    v-text-field(
                    ref="token"
                    type="number"
                    v-model="$store.state.auth.restore.token"
                    required
                    label="Введите код из Email")
                v-divider(class="mt-12")
                v-card-actions
                    v-btn(
                    text
                    :to="localePath('/auth/registration')"
                    ) Регистрация
                    v-btn(
                    text
                    :to="localePath('/auth/login')"
                    ) Вход
                    v-spacer
                    v-btn(
                    color="primary"
                    :disabled="!isRestoreKeyValid"
                    text
                    type="submit"
                    ) Далее

</template>

<script>
export default {
    layout: 'login',
    data() {
        return {
            isUpdatePasswordValid: false,
            isRestoreKeyValid: false,
            isRestoreValid: false,
            showPassword: false,
            isEmailSent: false,
            nameRules: [
                (v) => !!v || 'Используйте реальное название компании',
            ],
            codeRules: [
                (v) => !!v || 'Введите код',
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
            passwordRulesRepeat: [
                (v) => v === this.$store.state.auth.restore.newPassword || 'Пароли не совпадают'
            ]
        }
    },
    methods: {
        sendRestoreEmail() {
            this.$store.dispatch('auth/sendRestoreEmail', this.$store.state.auth.restore)
            // this.$store.state.auth.restore.isEmailSent = true
        },
        checkKey() {
            this.$store.dispatch('auth/checkKey', this.$store.state.auth.restore)
        },
        updatePassword() {
            this.$store.dispatch('auth/updatePassword', this.$store.state.auth.restore)
        }
    },
    mounted() {
        if (!this.$store.state.auth.user) {
            this.$store.dispatch("auth/checkAuth", { page: 'restore' })
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
    &__buttons {
        flex-wrap: wrap;
        &-item {
            margin-bottom: 15px;
        }
    }
}

</style>

