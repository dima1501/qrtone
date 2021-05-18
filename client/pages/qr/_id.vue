<template lang="pug">
    h1 asdsd
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('guest/redirect', {
            placeId: this.$route.query.place,
            table: this.$route.query.table
        })
    }
}
</script>