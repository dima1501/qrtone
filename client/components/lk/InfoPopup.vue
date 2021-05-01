<template lang="pug">
    .popup
        .popup__container
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .popup__content
                h2.popup__title Инфо
                h3 {{ $store.state.guest.companyData.name }}
                h3 {{ $store.state.guest.companyData.places.find(e => e._id == $nuxt.$route.query.place).phone }}
                h3 {{ $store.state.guest.companyData.places.find(e => e._id == $nuxt.$route.query.place).inst }}
                h3 {{ $store.state.guest.companyData.places.find(e => e._id == $nuxt.$route.query.place).vk }}
                h3 {{ $store.state.guest.companyData.places.find(e => e._id == $nuxt.$route.query.place).wa }}
                
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.infoPopup = false
        }
    }
}
</script>


<style lang="scss">
.popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    z-index: 20;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;

    &__closer {
        position: absolute;
        right: 20px;
        top: 25px;
        cursor: pointer;

        .v-icon {
            color: #000;
            transition: transform .3s;
            &:hover {
                transform: rotate(140deg);
            }
        }
    }

    &__container {
        position: relative;
        margin-top: auto;
        margin-bottom: auto;
        background-color: #fff;
        border-radius: 20px;
        padding: 20px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 15px;
    }
}
</style>
