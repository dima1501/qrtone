<template lang="pug">
    h1
</template>

<script>
export default {
    created() {
        if (!this.$route.query.place) {
            this.$router.push({path: '/'})
        } else {
            this.$store.dispatch('guest/redirect', {
                placeId: this.$route.query.place,
                table: this.$route.query.table
            })
        }
        
    }
}
</script>