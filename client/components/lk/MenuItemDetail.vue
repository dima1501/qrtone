<template lang="pug">
    .detail
        .detail__closer(@click="closeDetail")
        .detail__area
            .menu-item__img
                .menu-item__img-pic(v-if="item.images.length == 1" v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.images[0] + ')' }")
                VueSlickCarousel(:arrows="false" :dots="true" v-if="item.images.length > 1")
                    .menu-item__img-pic(v-for="(image, key) in item.images" :key="key" :style="{ backgroundImage: 'url(../../uploads/' + image + ')' }")

            .menu-item__content
                .menu-item__content-inner
                    .menu-item__name {{ item.name }}
                    .menu-item__name {{ item.translation }}
                    .menu-item__name {{ item.description }}
                    .menu-item__price(v-for="(price, i) in item.prices" :key="i")
                        input.menu-item__price-radio(type="radio" :id="`detail_${item._id}${i}`" :name="`detail_${item._id}`" :value="i"  v-model="$store.state.view.detail.checkedPrice")
                        label.menu-item__price-label(:for="`detail_${item._id}${i}`") {{ item.prices[i] }}₽ {{ item.weights[i] }}г.

                .menu-item__bottom(v-if="$store.state.guest.user.cart")
                    .menu-item__button(
                        @click="plusMulti"
                        v-if="!$store.state.guest.user.cart[getPlaceId()] || !$store.state.guest.user.cart[getPlaceId()].find(e => e._id == item._id) || $store.state.guest.user.cart[getPlaceId()] && !$store.state.guest.user.cart[getPlaceId()].find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length"
                        ) {{ item.prices[$store.state.view.detail.checkedPrice] }} ₽

                    .menu-item__counter(v-if="$store.state.guest.user.cart[getPlaceId()] && $store.state.guest.user.cart[getPlaceId()].find(e => e._id == item._id) && $store.state.guest.user.cart[getPlaceId()].find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length")
                        .menu-item__counter-control.minus(@click="minusMulti(item)") -
                        .menu-item__counter-value {{ $store.state.guest.user.cart[getPlaceId()].find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length }}
                        .menu-item__counter-control.plus(@click="plusMulti()") +
    </template>

<script>
export default {
    props: {
        item: Object,
        placeId: String
    },
    methods: {
        getPlaceId() {
            return this.$store.state.guest.companyData.places.find(e => e.link == this.placeId)._id
        },
        plusMulti() {
            this.$store.dispatch('guest/addToCart', {
                place: this.placeId,
                item: this.item,
                price: this.$store.state.view.detail.checkedPrice
            })
        },
        minusMulti(item) {
            this.$store.dispatch('guest/minusCartItemMulti', {
                place: this.placeId,
                item: this.item,
                price: this.$store.state.view.detail.checkedPrice
            })
        },
        closeDetail() {
            this.$store.dispatch('guest/closeDetail')
        }
    }
}
</script>

<style lang="scss">
.detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 23;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
    background-color: rgba(0,0,0,0.8);
    &__closer {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    &__area {
        width: 100%;
        max-width: 400px;
        position: relative;
        z-index: 2;
        background-color: #fff;
        border-radius: 14px;
        overflow: hidden;

    }
}
</style>