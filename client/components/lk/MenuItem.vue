<template lang="pug">
    .menu-item(v-bind:class="{ flash: flash }")
        .menu-item__more(@click="openDetail(item)")
        .menu-item__img
            .menu-item__img-pic.placeholder(v-if="!item.images.length" v-bind:style="{ backgroundImage: 'url(../../food-placeholder.png)' }")
            .menu-item__img-pic(v-if="item.images.length == 1" v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.images[0] + ')' }")
            VueSlickCarousel(:arrows="false" :dots="true" v-if="item.images.length > 1")
                .menu-item__img-pic(v-for="(image, key) in item.images" :key="key" :style="{ backgroundImage: 'url(../../uploads/' + image + ')' }")
        .menu-item__content
            .menu-item__content-inner
                .menu-item__vegan(v-if="item.isVegan") Вегетарианское

                .menu-item__name
                    .menu-item__name-title {{item.name}}
                    .menu-item__name-translation {{item.translation}}
                .menu-item__data
                    .menu-item__data-calories(v-if="item.weights[0]")
                        span {{ item.weights[0] }}г 
                    //- .menu-item__data-calories
                    //-     span(v-if="item.calories[0]") {{ item.calories[0] }} Ккал 
                    //-     span(v-if="item.proteins[0] && item.fats[0] && item.carbo[0]") ({{item.proteins[0]}}-{{item.fats[0]}}-{{item.carbo[0]}})
                
                .menu-item__options(v-if="item.prices.length > 1")
                    span.menu-item__options-label Еще {{ item.prices.length - 1 }} 
                    span.menu-item__options-label(v-if="item.prices.length - 1 == 1") вариант
                    span.menu-item__options-label(v-if="item.prices.length - 1 > 1 && item.prices.length - 1 < 5") варианта
                    span.menu-item__options-label(v-if="item.prices.length - 1 > 4 && item.prices.length - 1 < 21") вариантов
                    

            .menu-item__bottom
                transition(name="slide-fade" mode="out-in")
                    .menu-item__button(
                        key="10"
                        @click="plusMulti"
                        v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id] || !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id)")
                        //- span(v-if="item.prices.length > 1") Еще {{item.prices.length}} 
                        span {{ item.prices[checkedPrice] }}{{$store.state.guest.companyData.currencySymbol}}
                    .menu-item__counter(key="11" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id)")
                        .menu-item__counter-control(@click="item.prices.length > 1 ? openDetail(item) : minusMulti()")
                            v-icon mdi-minus
                        .menu-item__counter-value {{ $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).count }} 
                            span.menu-item__counter-value-price(v-if="item.prices.length == 1")  x {{item.prices[0]}}{{$store.state.guest.companyData.currencySymbol}}
                        .menu-item__counter-control(@click="item.prices.length > 1 ? openDetail(item) : plusMulti()")
                            v-icon mdi-plus

</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
    props: {
        item: Object,
        placeId: String
    },
    components: {
        VueSlickCarousel
    },
    data() {
        return {
            checkedPrice: 0,
            flash: false
        }
    },
    methods: {
        openDetail(item) {
            this.flashCard()
            this.$store.dispatch('guest/openDetail', {
                item, checkedPrice: this.checkedPrice
            })
        },
        getPlaceId() {
            return this.$store.state.guest.companyData.places.find(e => e.link == this.placeId)._id
        },
        plusMulti() {
            if (this.item.prices.length > 1) {
                this.openDetail(this.item)
            } else {
                this.flashCard()
                this.$store.dispatch('guest/addToCart', {
                    place: this.placeId,
                    item: this.item,
                    price: this.checkedPrice
                })
            }
        },
        minusMulti() {
            if (this.item.prices.length > 1) {
                this.openDetail(this.item)
            } else {
                this.flashCard()
                this.$store.dispatch('guest/minusCartItemMulti', {
                    place: this.placeId,
                    item: this.item,
                    price: this.checkedPrice
                })
            }
        },
        flashCard() {
            if (!this.flash) {
                this.flash = true
                const timer = setInterval(() => {
                    this.flash = false
                    clearInterval(timer)
                }, 50);
            }
        }
    }
}
</script>

<style lang="scss">

.slick-dots {
    bottom: 12px;
    padding-left: 0 !important;
}

.slick-dots li button, .slick-dots li {
    width: 15px;
    height: 15px;
}

.menu-item {
    position: relative;
    transition: transform .1s;
    background-color: #fff;
    border-radius: 14px;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.flash {
        transform: scale(0.95);
    }
    &__img {
        position: relative;
        z-index: 3;
        .slick-slider {
            margin-bottom: -6px;
        }
        &-pic {
            background-position: center;
            background-size: cover;
            &:after {
                content: "";
                display: block;
                padding-bottom: 100%;
            }
            @media screen and (min-width: 768px) {
                // height: 20vw;
            }
        }
    }
    &__content {
        padding: 8px;
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        &-inner {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
    &__button {
        width: 100%;
        padding: 7px 10px;
        background-color: rgb(224, 223, 223);
        border-radius: 14px;
        margin-top: 10px;
        font-size: 16px;
        text-transform: none;
        cursor: pointer;
        position: relative;
        z-index: 4;
        text-align: center;
        &:after {
            content: '';
            position: absolute;
            left: -5px;
            right: -5px;
            top: -5px;
            bottom: -5px;
        }
    }
    &__bottom {
        width: 100%;
    }
    &__more {
        position: absolute;
        z-index: 3;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }
    &__counter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-radius: 14px;
        margin-top: 10px;
        position: relative;
        z-index: 4;

        &-control {
            border-radius: 5px;
            background-color: rgb(224, 223, 223);
            width: 38px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 14px;
            cursor: pointer;
            .v-icon {
                pointer-events: none;
            }
        }
        &-value {
            font-weight: bold;
            &-price {
                font-weight: normal;
                color: $color-black;
                opacity: 0.9;
                font-size: 14px;
            }
        }
    }
    &__price {
        line-height: 14px;
        font-size: 14px;
        color: $color-black;
        margin-top: 5px;
        height: 14px;
        &-radio {
            visibility: hidden;
            opacity: 0;
            position: absolute;
        }
        &-label {
            color: rgb(163, 163, 163);
            font-size: 14px;
        }
    }
    &__name {
        margin-bottom: 4px;
        line-height: 1.3;
        color: $color-black;
        &-title {
            font-weight: bold;
            font-size: 18px;
        }
        &-translation {
            font-size: 12px;
            opacity: 0.9;
            @media screen and (min-width: 1000px) {
                font-size: 14px;
            }
        }
    }
    &__data {
        color: $color-black;
        &-calories {
            font-size: 12px;
            opacity: .9;
            span {
                display: block;
                margin-right: 5px;
            }
            @media screen and (min-width: 1000px) {
                font-size: 14px;
                span {
                    display: inline-block;
                }
            }
        }
    }
    &__options {
        color: $color-black;
        font-size: 14px;
        opacity: .9;
    }
    &__vegan {
        position: absolute;
        left: 0;
        top: 15px;
        background-color: #fff;
        border-radius: 5px;
        padding: 2px 5px;
        font-size: 12px;
        padding-left: 25px;
        z-index: 5;
        box-shadow: 0 0 10px rgba(0,0,0,0.15);
        &:before {
            content: '';
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background-size: cover;
            background-image: url('../../static/icons8-vegetarian-mark-48.png');
        }
    }
}
</style>

