<template lang="pug">
.aside
    h2 Уведомления
    .aside__inner
        .aside__item(
            v-if="$store.state.auth.user.messages.length && message.notify"
            v-for="(message, key) in $store.state.auth.user.messages" :key="key")
            .aside__item-title {{ message.notify.replace('@table', message.table) }}
            v-btn(depressed white @click="accept(message)" v-if="message.status == 'pending'") {{ message.buttonText }}
</template>

<script>
export default {
    data() {
        return {
            items: []
        }
    },
    async fetch() { 
        
    },
    methods: {
        accept(message) {
            this.$store.dispatch('lk/acceptFastAction', message)
        }
    }
}
</script>

<style lang="scss">
.aside {
    &__inner {
        display: flex;
        flex-direction: column-reverse;
    }
    &__item {
        background: #F5F7FB;
        border-radius: 16px;
        margin-bottom: 10px;
        padding: 10px;
    }
}
</style>

