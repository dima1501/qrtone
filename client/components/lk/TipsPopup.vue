<template lang="pug">
    .popup.z-22
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .popup__content
                h2.popup__title Выберите официанта

                .tip(v-for="waiter in $store.state.guest.companyData.waiters")
                    .tip__row
                        .tip__pic(v-if="waiter.photo" v-bind:style="{ backgroundImage: `url(../../uploads/${waiter.photo})` }")
                        .tip__content
                            .tip__name {{waiter.name}}
                                span {{'#'+waiter.id}}
                            a(:href='`https://chachachay.me/${waiter.id}`' target="_blank").tip__link Оставить чаевые
</template>

<script>
export default {
    methods: {
        closePopup() {
            this.$store.state.view.popup.tipsPopup.visible = false
        }
    }
}
</script>

<style lang="scss">
.tip {
    box-shadow: 0 0 20px rgba(0,0,0,0.2);
    margin-bottom: 15px;
    border-radius: 10px;
    padding: 10px;
    &__row {
        display: flex;
    }
    &__pic {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        flex-shrink: 0;
        margin-right: 15px;
        background-size: cover;
        background-position: center;
    }

    &__name {
        font-size: 18px;
        font-weight: bold;
        color: $color-black;
        span {
            color: $color-black;
            font-size: 12px;
            margin-left: 10px;
            opacity: 0.8;
            font-weight: normal;
        }
    }

    &__link {
        font-size: 14px;
        color: $color-blue;
        text-decoration: none;
    }
}
</style>