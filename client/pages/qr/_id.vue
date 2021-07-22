<template lang="pug">
    h1
</template>

<script>
export default {
    mounted() {
        if (!this.$route.query.place) {
            this.$router.push($nuxt.localePath({ path: '/' }))
        } else {
            // $nuxt.$router.push($nuxt.localePath({ path: `/m/`, params: { placeId: this.$route.query.place } }))

            this.$store.dispatch('guest/redirect', {
                placeId: this.$route.query.place,
                table: this.$route.query.table
            })
        }
        
    }
}
</script>