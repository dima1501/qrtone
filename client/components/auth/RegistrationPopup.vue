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
          @submit.prevent="fetchCompanyRegistration"
          v-model="isCompanyRegistrationValid")
          v-card-text
            v-text-field(
              ref="name"
              v-model="registrationData.name"
              :rules="nameRules"
              :label="'form_company_name'"
              required)
            v-text-field(
              ref="email"
              v-model="registrationData.email"
              :rules="emailRules"
              label="form_email")
            v-text-field(
              v-model="registrationData.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              :label="'form_password'"
              @click:append="showPassword = !showPassword")
          v-divider(class="mt-12")
          v-card-actions
            v-btn(
              text
              to="/login"
            ) {{ 'form_login' }}
            v-spacer
            v-btn(
              color="primary"
              :disabled="!isCompanyRegistrationValid"
              text
              type="submit"
            ) {{ 'form_create_account' }}

</template>

<script>
export default {
  name: 'RegistrationPopup',
  data() {
    return {
      isCompanyRegistrationValid: true,
      showPassword: false,
      registrationData: {
        name: '',
        password: '',
        email: '',
        goods: [],
      },
      nameRules: [
        (v) => !!v || 'error_company_name',
        // (v) => !v || /^[a-zA-Z]+$/.test(v) || 'Введите латиницей',
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
    fetchCompanyRegistration() {
      this.$store.dispatch('auth/registrationAction', this.registrationData)
    },
  },
}
</script>
