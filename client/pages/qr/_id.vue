<template lang="pug">
    h1
</template>

<script>
export default {
    layout: 'main',
    mounted() {
        if (!this.$route.params.id) {
            this.$router.push($nuxt.localePath({ path: '/' }))
        } else {
            this.$store.dispatch('guest/redirect', {
                placeId: this.$route.params.id,
                table: this.$route.query.t
            })
        }
    }
}
</script>