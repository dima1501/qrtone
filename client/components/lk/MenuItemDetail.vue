<template lang="pug">
    .detail#detail_area
        .detail__bg
        .detail__closer(@click="closeDetail" v-my-touch:start="closeDetail")
        .detail__area(v-bind:class="{ visible: isAreaVisible, transitionActive: move }" v-my-touch:moving="movingHandler" v-my-touch:moved="movedHandler" v-my-touch:end="endHandler" v-bind:style="{ transform: isAreaVisible ? 'translateY(' + transitionAreaHeight + 'px)' : null }")
            .menu-item__vegan(v-if="item.isVegan") Вегетарианское
            .detail__img
                .detail__img-pic.placeholder(v-if="!item.images.length" v-bind:style="{ backgroundImage: 'url(../../food-placeholder.png)' }")

                picture.detail__img-pic(v-if="item.images.length == 1")
                    source(:srcset="`${ '../../uploads/400-' + item.images[0] }.webp 1x, ${ '../../uploads/800-' + item.images[0] }.webp 2x`" type="image/webp")
                    img(:src="`${ '../../uploads/400-' + item.images[0] }`" :srcset="`${ '../../uploads/400-' + item.images[0] } 1x, ${ '../../uploads/800-' + item.images[0] } 2x`" alt="Изображения")

                VueSlickCarousel(:arrows="true" :dots="false" v-if="item.images.length > 1").detail__img-slider
                    picture.detail__img-pic(v-for="(image, key) in item.images" :key="key")
                        source(:srcset="`${ '../../uploads/400-' + item.images[key] }.webp 1x, ${ '../../uploads/800-' + item.images[key] }.webp 2x`" type="image/webp")
                        img(:src="`${ '../../uploads/400-' + item.images[key] }`" :srcset="`${ '../../uploads/400-' + item.images[key] } 1x, ${ '../../uploads/800-' + item.images[key] } 2x`" alt="Изображения")
            
            
            .detail__content(v-if="item.prices.length == 1")
                .detail__single
                    .detail__single-translation {{ item.translation }}
                    .detail__single-name {{ item.name }}
                    .detail__single-descr {{ item.description }}
                    .detail__single-info
                        .detail__single-weight(v-if="!!item.weights[0]") Вес: {{ item.weights[0] }}г
                        .detail__single-weight(v-if="!!item.calories[0]") Ккал: {{ item.calories[0] }}
                        .detail__single-weight(v-if="!!item.proteins[0] && !!item.fats[0] && !!item.carbo[0]") БЖУ: {{item.proteins[0]}}-{{item.fats[0]}}-{{item.carbo[0]}}

                    .detail__single-btn
                        transition(name="slide-fade" mode="out-in")
                            .detail__line-button(
                                key="12"
                                @click="plusMulti(0)"
                                v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id] || $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id) || $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == 0).length"
                            ) {{ item.prices[0] }}{{$store.state.guest.companyData.currencySymbol}}

                            .detail__line-counter.-wide(key="13" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id) && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == 0).length")
                                .menu-item__counter-control(@click="minusMulti(0)")
                                    v-icon mdi-minus
                                .menu-item__counter-value.-detail {{ $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == 0).length }} 
                                    span.menu-item__counter-value-price x {{ item.prices[0] }}{{$store.state.guest.companyData.currencySymbol}}
                                .menu-item__counter-control.plus(@click="plusMulti(0)")
                                        v-icon mdi-plus

            .detail__content(v-else)
                .detail__content-top
                    .detail__single-translation(v-if="item.translation") {{ item.translation }}
                    .detail__single-name {{ item.name }}
                    .detail__content-descr(v-if="item.description") {{ item.description }}

                .detail__line(v-for="(price, i) in item.prices" :key="i")
                    .detail__line-inner

                        .detail__line-content
                            .detail__line-content-line
                                .detail__line-price {{item.prices[i]}}{{$store.state.guest.companyData.currencySymbol}}
                                .detail__line-name(v-if="item.modifications[i]") {{ item.modifications[i] }}

                            .detail__line-content-line
                                span.note(v-if="item.weights[i]") Вес: {{ item.weights[i] }}г
                                span.note(v-if="item.calories[i]") Ккал: {{ item.calories[i] }}
                            .detail__line-content-line
                                span.note(v-if="item.proteins[i] && item.fats[i] && item.carbo[i]") БЖУ: {{item.proteins[i]}}-{{item.fats[i]}}-{{item.carbo[i]}}
                            
                        .detail__line-counter
                            transition(name="slide-fade" mode="out-in")
                                .detail__line-button(
                                    key="12"
                                    @click="plusMulti(i)"
                                    v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id] || $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id) || $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == i).length"
                                ) {{ item.prices[i] }}{{$store.state.guest.companyData.currencySymbol}}

                                .detail__line-counter(key="13" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id) && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == i).length")
                                    .menu-item__counter-control(@click="minusMulti(i)")
                                        v-icon mdi-minus
                                    .menu-item__counter-value.-detail {{ $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).cartPrices.filter(e => e == i).length }}
                                    .menu-item__counter-control.plus(@click="plusMulti(i)")
                                        v-icon mdi-plus
                                    

            .detail__dops(v-if="item.dops.length")
                h4.detail__dops-title Дополнения:
                .detail__line(v-for="(dop, key) in item.dops" v-if="$store.state.guest.companyData.dops.find(e => e._id == dop)")
                    .detail__line-inner
                        .detail__line-content
                            h4.detail__line-name {{ $store.state.guest.companyData.dops.find(e => e._id == dop).name }}
                                transition(name="slide-fade" mode="out-in")
                                    span.note(key="15" v-if="$store.state.guest.companyData.dops.find(e => e._id == dop).price && $store.state.guest.companyData.dops.find(e => e._id == dop).count > 0")  {{ $store.state.guest.companyData.dops.find(e => e._id == dop).price }}{{$store.state.guest.companyData.currencySymbol}}
                                    span.note(key="16" v-else-if="!$store.state.guest.companyData.dops.find(e => e._id == dop).prices.length") Бесплатно
                        .detail__line-counter
                            transition(name="slide-fade" mode="out-in")
                                .detail__line-button(
                                    key="13"
                                    @click="addDopToCart(dop)"
                                    v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id] || !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.find(e => e._id == dop)") 
                                    span(v-if="$store.state.guest.companyData.dops.find(e => e._id == dop).price") {{ $store.state.guest.companyData.dops.find(e => e._id == dop).price }}{{$store.state.guest.companyData.currencySymbol }}
                                    span(v-else) Бесплатно
                                .detail__line-counter(key="14" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.find(e => e._id == dop)")
                                    .menu-item__counter-control(@click="removeDopFromCart(dop)")
                                        v-icon mdi-minus
                                    .menu-item__counter-value.-detail {{ $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.find(e => e._id == dop).count }}
                                    .menu-item__counter-control(@click="addDopToCart(dop)")
                                        v-icon mdi-plus
            .detail__area-bottom(v-bind:class="{ visible: $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.length || $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.length || $store.state.guest.user.orders.length }")
    </template>

<script>
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents, {
    namespace: 'my-touch'
})

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
            modalIsOpen: true,
            isAreaVisible: false,
            startScrollPoint: 0,
            transitionAreaHeight: 0,
            move: true,
            detailArea: null,
            isDetailAreaScrolledToTop: false,
            dir: {
                value: 0,
                top: null
            }
        }
    },
    watch: {
        $route(newVal, oldVal) {
            if (newVal.query.d == '0') {
                this.closeDetail()
            }
        }
    },
    mounted() {
        this.detailArea = document.getElementById("detail_area")
        this.detailArea.scrollTop == 0 ? this.isDetailAreaScrolledToTop = true : this.isDetailAreaScrolledToTop = false

        setTimeout(() => {
            this.isAreaVisible = true
        }, 0);
    },
    methods: {
        // swipeHandler(direction) {
        //     if (direction.screenY) {
        //         this.startScrollPoint = direction.screenY
        //         if (direction.screenY - this.startScrollPoint > 0 && this.isDetailAreaScrolledToTop) {
        //             this.move = false
        //             this.transitionAreaHeight = direction.screenY - this.startScrollPoint
        //             if (this.transitionAreaHeight > 80) {
        //                 this.closeDetail()
        //             }
        //         }
        //     }
        // },
        movedHandler(direction) {
            if (direction.type == 'touchmove') {
                this.startScrollPoint = direction.changedTouches[0].screenY + this.detailArea.scrollTop       
                this.detailArea.scrollTop < 8 ? this.isDetailAreaScrolledToTop = true : this.isDetailAreaScrolledToTop = false
            }
        },
        movingHandler(direction) {
            if (direction.type == 'touchmove') {
                if (this.dir.value < direction.changedTouches[0].screenY) {
                    this.dir.top = false
                } else {
                    this.dir.top = true
                }
                this.dir.value = direction.changedTouches[0].screenY

                if (direction.changedTouches[0].screenY - this.startScrollPoint > 0 && this.isDetailAreaScrolledToTop) {
                    this.move = false
                    this.transitionAreaHeight = direction.changedTouches[0].screenY - this.startScrollPoint
                } else if (direction.changedTouches[0].screenY - this.startScrollPoint < 0) {
                    // this.detailArea.scroll(0, direction.changedTouches[0].screenY - this.startScrollPoint + 'px')
                    this.detailArea.scroll({
                        top: (direction.changedTouches[0].screenY - this.startScrollPoint) * -1,
                        behavior: 'auto'
                    })
                }
            }
        },
        endHandler() {
            if (!this.dir.top && this.transitionAreaHeight > 80 || !this.dir.top && this.transitionAreaHeight > 1) {
                this.closeDetail()
                this.dir.top = true
            } else if (this.dir.top) {
                this.move = true
                this.transitionAreaHeight = 0
            }
            
        },
        addDopToCart(dop) {
            this.$store.dispatch('guest/addDopToCart', {
                item:  this.$store.state.guest.companyData.dops.find(e => e._id == dop),
                place: this.$store.state.guest.companyData.place._id,
                price: 0
            })
        },
        removeDopFromCart(dop) {
            this.$store.dispatch('guest/minusDopMulti', {
                place: this.$store.state.guest.companyData.place._id,
                item: this.$store.state.guest.companyData.dops.find(e => e._id == dop),
                price: 0
            })
        },
        getPlaceId() {
            return this.$store.state.guest.companyData.places.find(e => e.link == this.placeId)._id
        },
        plusMulti(price) {   
            this.$store.dispatch('guest/addToCart', {
                place: this.placeId,
                item: this.item,
                price: price
            })
        },
        minusMulti(price) {
            this.$store.dispatch('guest/minusCartItemMulti', {
                place: this.placeId,
                item: this.item,
                price: price
            })
        },
        closeDetail() {
            this.move = true
            this.isAreaVisible = false
            this.$router.push({path: $nuxt.$route.fullPath, query: {d: 0}})
            document.documentElement.style.overflow = 'visible'

            setTimeout(() => {
                this.$store.dispatch('guest/closeDetail')
            }, 200);
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
    z-index: 21;
    display: flex;
    padding: 40px 0 80px;
    overflow-y: auto;
    touch-action: none;
    -webkit-overflow-scrolling: touch;
    min-height: -webkit-fill-available;
    overflow-y: scroll;
    @media screen and (max-width: 1000px) {
        padding: 40px 0 0;
    }
    &__bg {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: -40px;
        pointer-events: none;
        background-color: rgba(0,0,0,0.6);
    }
    &__closer {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        right: 0;
        height: 100%;
        cursor: pointer;
    }
    &__area {
        position: relative;
        z-index: 2;
        width: 100%;
        transform: translateY(100%);
        margin: auto auto 0;
        max-width: 400px;

        @media screen and (min-width: 1000px) {
            max-height: unset;
            margin: auto;
            border-bottom-left-radius: 14px;
            border-bottom-right-radius: 14px;
            overflow: hidden;
        }

        @media screen and (max-width: 1000px) {
            &:after {
                content: '';
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                height: 4px;
                width: 65px;
                background-color: #fff;
                border-radius: 2px;
                box-shadow: 0 0 3px rgba(0,0,0,0.3);
            }
            &:before {
                content: '';
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                cursor: pointer;
                height: 40px;
                width: 100px;
            }
        } 
        
        &.visible {
            transform: translateY(0);
        }
        &.transitionActive {
            transition: all .3s;
        }
        &-bottom {
            height: 0;
            background-color: #fff;
            transition: height .3s;
            display: none;
            @media screen and (max-width: 1000px) {
                display: block;
            }
            &.visible {
                height: 60px;
            }
        }
    }
    &__img {
        position: relative;
        overflow: hidden;
        background-color: #fff;
        overflow: hidden;
        border-top-left-radius: 14px;
        border-top-right-radius: 14px;
        &-pic {
            position: relative;
            width: 100%;
            /* padding-bottom: 100%; */
            background-size: cover;
            background-position: center;
            display: block;
            img {
                /* position: absolute; */
                left: 0;
                top: 0;
                width: 100%;
                height: auto;
                object-fit: cover;
                pointer-events: none;
                display: block;
            }
            &.placeholder {
                background-size: contain;
                padding-bottom: 40%;
                opacity: 0.2;
                background-repeat: repeat;
            }
        }
        &-slider {
            margin-bottom: -6px;
        }
    }
    &__content {
        background-color: #fff;
        &-top {
            padding: 10px 15px;
            background-color: rgb(241, 241, 241);
        }
    }
    &__line {
        padding: 10px 15px;
        border-bottom: 1px solid rgb(241, 241, 241);
        &:last-child {
            border: none;
        }
        &-price {
            font-weight: bold;
            line-height: 1;
            margin-bottom: 5px;
        }
        &-name {
            margin-bottom: 5px;
        }
        &-inner {
            display: flex;
            align-items: center;
        }
        &-content {
            height: 100%;
            margin-right: 5px;
            &-line {
                line-height: 1.2;
            }
            span {
                &.note {
                    color: #a3a3a3;
                    font-size: 14px;
                    margin-right: 5px;
                    line-height: 1.2;
                }
                &.modifications {
                    margin-right: 5px;
                }
            }
        }
        &-name {
            margin-right: 5px;
            span {
                font-weight: normal;
            }
        }
        &-button {
            width: 100%;
            padding: 7px 10px;
            background-color: #e0dfdf;
            border-radius: 14px;
            font-size: 16px;
            text-transform: none;
            cursor: pointer;
            position: relative;
            text-align: center;
        }
        &-counter {
            position: relative;
            z-index: 3;
            display: flex;
            width: 110px;
            align-items: center;
            justify-content: space-between;
            margin-left: auto;
            flex-shrink: 0;
            &.-wide {
                width: 100%;
                max-width: 200px;
                margin: 0 auto;
            }
        }
    }
    &__dops {
        background-color: #fff;
        &-title {
            padding: 10px 15px;
            background-color: rgb(241, 241, 241);
        }
    }
    &__single {
        padding: 5px 10px;
        background-color: #fff;
        /* background-color: rgb(241, 241, 241); */
        &-translation {
            font-size: 14px;
            opacity: 0.9;
        }
        &-name {
            font-size: 18px;
            font-weight: bold;
            line-height: 1.3;
        }
        &-descr {
            margin-bottom: 5px;
        }
        &-info {
            display: flex;
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
        }
        &-weight {
            margin-right: 10px;
        }
        &-btn {
            margin: 5px 0;
        }
    }
}

</style>