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
                        label.menu-item__price-label(:for="`detail_${item._id}${i}`") {{ item.prices[i] }}{{$store.state.guest.companyData.currencySymbol}} {{ item.weights[i] }}г.

                .menu-item__bottom(v-if="$store.state.guest.user.cart")
                    .menu-item__button(
                        @click="plusMulti"
                        v-if="!$store.state.guest.user.cart[getPlaceId()] || !$store.state.guest.user.cart[getPlaceId()].goods.find(e => e._id == item._id) || $store.state.guest.user.cart[getPlaceId()] && !$store.state.guest.user.cart[getPlaceId()].goods.find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length"
                        ) {{ item.prices[$store.state.view.detail.checkedPrice] }} {{$store.state.guest.companyData.currencySymbol}}

                    .menu-item__counter(v-if="$store.state.guest.user.cart[getPlaceId()] && $store.state.guest.user.cart[getPlaceId()].goods.find(e => e._id == item._id) && $store.state.guest.user.cart[getPlaceId()].goods.find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length")
                        .menu-item__counter-control.minus(@click="minusMulti()") -
                        .menu-item__counter-value {{ $store.state.guest.user.cart[getPlaceId()].goods.find(e => e._id == item._id).cartPrices.filter(e => e == $store.state.view.detail.checkedPrice).length }}
                        .menu-item__counter-control.plus(@click="plusMulti()") +

                .menu-item__dops(v-if="item.dops.length && $store.state.guest.companyData.dops")
                    h4 Дополнения:
                    //- .menu-item__dops-item(v-for="(dop, key) in item.dops" v-if="$store.state.guest.companyData.dops.find(e => e._id == dop)")
                    //-     div {{ $store.state.guest.companyData.dops.find(e => e._id == dop).name }} {{ $store.state.guest.companyData.dops.find(e => e._id == dop).price }}
                    //-     div x {{ $store.state.guest.companyData.dops.find(e => e._id == dop).count }}
                    //-     div(@click="addDopToCart(dop)") add
                    //-     div(@click="removeDopFromCart(dop)") remove
                    //-     div ____

                    .menu-item__dops-item(v-for="(dop, key) in item.dops" v-if="$store.state.guest.companyData.dops.find(e => e._id == dop)")
                        div {{ $store.state.guest.companyData.dops.find(e => e._id == dop).name }} {{ $store.state.guest.companyData.dops.find(e => e._id == dop).price }}
                        div(v-if="$store.state.guest.user.cart[getPlaceId()] && $store.state.guest.user.cart[getPlaceId()].dops.find(e => e._id == dop)") x {{ $store.state.guest.user.cart[getPlaceId()].dops.find(e => e._id == dop).count }}
                        div(@click="addDopToCart(dop)") add
                        div(@click="removeDopFromCart(dop)") remove
                        div ____
    </template>

<script>
export default {
    props: {
        item: Object,
        placeId: String
    },
    methods: {  
        addDopToCart(dop) {
            this.$store.dispatch('guest/addDopToCart', {
                item:  this.$store.state.guest.companyData.dops.find(e => e._id == dop),
                place: this.getPlaceId(this.placeId),
                price: 0
            })
        },
        removeDopFromCart(dop) {
            this.$store.dispatch('guest/minusDopMulti', {
                place: this.getPlaceId(this.placeId),
                item: this.$store.state.guest.companyData.dops.find(e => e._id == dop),
                price: 0
            })
        },
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
        minusMulti() {
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
    bottom: 36px;
    z-index: 23;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    align-items: center;
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
        overflow-y: scroll;
        height: 100%;
        padding-bottom: 70px;
    }

    .menu-item {
        &__img {
            height: 50%;
            &-pic {
                height: 100%;
                background-size: contain;
            }
        }
        &__bottom {
            position: fixed;
            left: 0;
            bottom: 36px;
            right: 0;
            background-color: #fff;
        }
    }
}


</style>