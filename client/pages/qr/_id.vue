<template lang="pug">
    h1
</template>

<script>
export default {
    sockets: {
        async updateSocketId(msg) {
            this.$store.dispatch("guest/setSocketId", msg, { root: true });
        }
    },
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