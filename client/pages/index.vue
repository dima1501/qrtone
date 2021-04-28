<template lang="pug">
  .main
    h1.main__title Main page
    nuxt-link(to="/auth/registration") registration
    div
    nuxt-link(to="/auth/login") login
</template>

<script>
export default {
  layout: 'main'
}
</script>
