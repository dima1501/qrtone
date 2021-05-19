<template lang="pug">
    .auth
        h1.auth__title Регистрация
        .auth__content
            v-card(
            theme--light
            class="mt-15")
            v-form(
            @submit.prevent="fetchCompanyLogin"
            v-model="isCompanyRegistrationValid")
                v-card-text
                    v-text-field(
                    ref="email"
                    v-model="loginData.email"
                    :rules="emailRules"
                    label="form_email")
                    v-text-field(
                    v-model="loginData.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    :label="'form_password'"
                    @click:append="showPassword = !showPassword")
                v-divider(class="mt-12")
                v-card-actions
                    v-btn(
                    text
                    to="/auth/registration"
                    ) {{ 'form_reg' }}
                    v-spacer
                    v-btn(
                    color="primary"
                    :disabled="!isCompanyRegistrationValid"
                    text
                    type="submit"
                    ) {{ 'form_login' }}

</template>

<script>
export default {
    layout: 'public',
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
        }
    },
    methods: {
        fetchCompanyLogin() {
            this.$store.dispatch('auth/loginAction', this.loginData)
        },
    },
}
</script>


<style lang="scss">
.auth {
    &__title {
        margin-bottom: 20px;
    }
}

</style>

