<template lang="pug">
    h1 asdsd
</template>

<script>
export default {
    created() {
        this.$router.push({path: '/m/'})
        this.$store.dispatch('guest/redirect', {
            placeId: this.$route.query.place,
            table: this.$route.query.table
        })
    }
}
</script>