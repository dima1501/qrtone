<template lang="pug">
  v-row(class="justify-center")
    v-col(
      cols="12"
      sm="10"
      md="8"
      lg="3")
      v-card(
        theme--light
        class="mt-15")
        v-form(
          @submit.prevent="fetchCompanyLogin"
          v-model="isCompanyLoginValid"
        )
          v-card-text
            v-text-field(
              ref="name"
              v-model="loginData.email"
              :rules="emailRules"
              label="Email"
              type="email"
              required)
            v-text-field(
              v-model="loginData.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-1"
              :label="'form_password'"
              @click:append="showPassword = !showPassword")
          v-divider(class="mt-12")
          v-card-actions
            v-btn(
              text
              to="/registration"
            ) {{ 'form_create_account' }}
            v-spacer
            v-btn(
              color="primary"
              text
              :disabled="!isCompanyLoginValid"
              type="submit"
            ) {{ 'form_login' }}

</template>

<script>
export default {
  name: 'LoginPopup',
  data() {
    return {
      isCompanyLoginValid: true,
      email: '',
      password: '',
      loginData: {
        email: '',
        password: '',
      },
      showPassword: false,
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
      emailRules: [
        (v) => !!v || 'error_required_field',
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'error_email_not_correct',
      ],
    }
  },
  methods: {
    // fetchCompanyLogin() {
    //   this.$store.dispatch('auth/loginAction', this.loginData)
    // },
  },
}
</script>
