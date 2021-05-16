<template lang="pug">
    .menu-item
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
                    input.menu-item__price-radio(type="radio" :id="`${item._id}${i}`" :name="item._id" :value="i" v-model="checkedPrice")
                    label.menu-item__price-label(:for="`${item._id}${i}`") {{ item.prices[i] }}₽ {{ item.weights[i] }}г.
            .menu-item__button(
                @click="plusMulti"
                v-if="$store.state.guest.user.cart && !$store.state.guest.user.cart.find(e => e._id == item._id) || $store.state.guest.user.cart && $store.state.guest.user.cart.length && !$store.state.guest.user.cart.find(e => e._id == item._id).cartPrices.filter(e => e == checkedPrice).length"
                ) {{ item.prices[checkedPrice] }} ₽
                
            .menu-item__counter(v-if="$store.state.guest.user.cart && $store.state.guest.user.cart.find(e => e._id == item._id) && $store.state.guest.user.cart.find(e => e._id == item._id).cartPrices.filter(e => e == checkedPrice).length")
                .menu-item__counter-control.minus(@click="minusMulti(item)") -
                .menu-item__counter-value {{ $store.state.guest.user.cart.find(e => e._id == item._id).cartPrices.filter(e => e == checkedPrice).length }}
                .menu-item__counter-control.plus(@click="plusMulti()") +

</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
    props: {
        item: Object
    },
    components: {
        VueSlickCarousel
    },
    data() {
        return {
            checkedPrice: 0
        }
    },
    methods: {
        addToCartSimple() {
            this.$store.dispatch('guest/addToCartSimple', this.item)
        },
        plusMulti() {
            this.$store.dispatch('guest/addToCart', {
                item: this.item,
                price: this.checkedPrice
            })
        },
        minusMulti(item) {
            this.$store.dispatch('guest/minusCartItemMulti', {
                item: this.item,
                price: this.checkedPrice
            })
        },
        plus(item) {
            this.$store.dispatch('guest/plusCartItem', item)
        },
        minus(item) {
            this.$store.dispatch('guest/minusCartItem', item)
        },
    }
}
</script>

<style lang="scss">
.menu-item {
    &__img {
        &-pic {
            height: 32vw;
            background-position: center;
            background-size: cover;
            @media screen and (min-width: 768px) {
                height: 20vw;
            }
        }
    }
    &__content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        &-inner {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
    &__counter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-radius: 14px;
        margin-top: 10px;

        &-control {
            border-radius: 5px;
            background-color: rgb(224, 223, 223);
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 14px;
            cursor: pointer;
        }
    }
    &__button {
        width: 100%;
        padding: 10px;
        background-color: rgb(224, 223, 223);
        border-radius: 14px;
        margin-top: 10px;
        font-size: 16px;
        text-transform: none;
        cursor: pointer;
    }
}
</style>

