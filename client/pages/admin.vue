<template lang="pug">
    .admin
        h1.admin__title
        .admin__list
            .company(v-for="(user, key) in users" :key="key") 
                div {{user.name}}
                div {{user.email}}
                div(v-for="(sub, key) in user.subscription")
                    div {{sub}}
                nuxt-link(:to="localePath(`/admin-menu/${user._id}`)") Меню
                div _____
</template>

<script>
const axios = require('axios').default

export default {
    data() {
        return {
            users: []
        }
    },
    async fetch () {
        try {
            const users = await axios({
                method: 'get',
                url: `${process.env.SERVER || "http://localhost:8000"}/api/admin/get-users`
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