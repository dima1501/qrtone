<template lang="pug">
    .auth
        h1.auth__title Восстановление пароля
        
        .auth__content(v-if="$store.state.auth.restore.isKeyValid")
            v-form(
            @submit.prevent="updatePassword"
            v-model="isUpdatePasswordValid")
                v-card-text
                    v-text-field(
                    ref="password"
                    type="password"
                    v-model="$store.state.auth.restore.newPassword"
                    :rules="passwordRules"
                    label="Введите новый пароль")
                    v-text-field(
                    ref="password"
                    type="password"
                    v-model="$store.state.auth.restore.newPasswordRepeat"
                    :rules="passwordRulesRepeat"
                    label="Введите новый пароль")
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
                    :disabled="!isRestoreValid"
                    text
                    type="submit"
                    ) Восстановить

        .auth__content(v-else-if="!$store.state.auth.restore.isKeyValid")
            v-form(
            @submit.prevent="checkKey"
            v-model="isRestoreKeyValid")
                v-card-text
                    v-text-field(
                    ref="token"
                    type="number"
                    v-model="$store.state.auth.restore.token"
                    :rules="nameRules"
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
    layout: 'public',
    data() {
        return {
            isUpdatePasswordValid: false,
            isRestoreKeyValid: false,
            isRestoreValid: false,
            showPassword: false,
            isEmailSent: false,
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            emailRules: [
                (v) => !!v || 'error_required_field',
                (v) =>
                !v ||
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                'error_email_not_correct',
            ],
            passwordRules: [
                (v) => !!v || 'error_required_field',
                (v) =>
                (v && v.length >= 5) || 'error_password_min_length',
                (v) =>
                /(?=.*[A-Z])/.test(v) ||
                'error_password_uppercase_symbol',
                (v) =>
                /(?=.*\d)/.test(v) ||
                'error_password_number_symbol',
            ],
            passwordRulesRepeat: [
                (v) => v === this.$store.state.auth.restore.newPassword || 'Пароли не совпадают'
            ]
        }
    },
    methods: {
        sendRestoreEmail() {
            this.$store.dispatch('auth/sendRestoreEmail', this.$store.state.auth.restore)
            this.$store.state.auth.restore.isEmailSent = true
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
}

</style>

