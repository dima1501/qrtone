<template lang="pug">
    .admin(v-if="$store.state.auth.user && $store.state.auth.user.admin")
        //- div(v-if="password == 'XsZuEdD9pJiheMxAEFuuI'")
        h1.admin__title
        .admin__list
            .company(v-for="(user, key) in users" :key="key") 
                div {{user.name}}
                div {{user.email}}
                div(v-for="(sub, key) in user.subscription")
                    div {{sub}}
                nuxt-link(:to="localePath(`/admin-menu/${user._id}`)") Меню
                div _____
        //- v-text-field(
        //-     v-else
        //-     v-model="password"
        //- )
</template>

<script>
const axios = require('axios').default

export default {
    data() {
        return {
            users: [],
            password: ''
        }
    },
    async mounted() {
        try {
            if (!this.$store.state.auth.user) {
                this.$store.dispatch("auth/checkAuth")
            }
            const users = await axios({
                method: 'get',
                url: `${process.env.server || "http://localhost:8000"}/api/admin/get-users`
            })
            this.users = users.data
        } catch (error) {
            console.error(error)
        }
    }
    
}
</script>

<style lang="scss">

</style>