<template lang="pug">
    .onboard__fast-action(:class="{ isActive: action.isActive }")
        .onboard__fast-action-check
            v-switch(
                :id="action._id"
                inset
                @change="fastActionsToggler($event, action)"
                v-model="action.isActive")
        .onboard__fast-action-content 
            .onboard__fast-action-title {{ action.callText }}
            .onboard__fast-action-text {{ action.notifyText }}
</template>

<script>
export default {
    props: {
        action: Object
    },
    methods: {
        async fastActionsToggler(e, action) {
            this.$store.dispatch('lk/editAction', action)
        },
    }
}
</script>