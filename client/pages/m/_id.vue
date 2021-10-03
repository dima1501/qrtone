<template lang="pug">
div
    .public(v-if="$store.state.guest.user && $store.state.guest.companyData && !isLoading")
        .geser(v-if="!isSubscriptionActive")
            div(v-if="$store.state.guest.companyData.photo")
                img(:src="require(`~/static/uploads/${$store.state.guest.companyData.photo}`)" :alt="$store.state.guest.companyData.name").header__logo-img
            span {{$store.state.guest.companyData.name}}
        div(v-else)
            header.header
                .header__inner  
                    .header__logo
                        // nuxt-link(to="https://google.com" target="_blank").header__logo-link
                        img(v-if="$store.state.guest.companyData.photo" :src="require(`~/static/uploads/${$store.state.guest.companyData.photo}`)" :alt="$store.state.guest.companyData.name").header__logo-img
                        transition(name="slide-up")
                            h3.header__logo-text(v-if="isHeaderSticky") {{ $store.state.guest.companyData.name }}
                    .header__controls
                        transition(name="slide-up")
                            v-icon.ml-5(light @click="toggleInfoPopup" v-if="isHeaderSticky") mdi-information-outline
                        v-icon.ml-5(
                            light 
                            @click="toggleCommandsMenu"
                            v-if="$nuxt.$route.query.t && isAvailable && $store.state.guest.companyData.fastActionsEnabled && ($store.state.guest.companyData.actions.filter(e => e.isActive == true).length || $store.state.guest.companyData.waiters.length)") mdi-menu 

            .welcome
                .welcome__bg(v-if="$store.state.guest.companyData.background && !$store.state.guest.companyData.bgWebp" v-bind:style="{ backgroundImage: 'url(../../uploads/' + $store.state.guest.companyData.background + ')' }")

                picture.welcome__bg(v-else-if="$store.state.guest.companyData.background")
                    source(:srcset="`../../uploads/560-${$store.state.guest.companyData.background}.webp 1x, ../../uploads/1080-${$store.state.guest.companyData.background}.webp 2x`" type="image/webp" media="(max-width: 560px)")
                    source(:srcset="`../../uploads/1080-${$store.state.guest.companyData.background}.webp 1x, ../../uploads/2160-${$store.state.guest.companyData.background}.webp 2x`" type="image/webp" media="(min-width: 561px)")
                    img(:src="`../../uploads/560-${$store.state.guest.companyData.background}`" :srcset="`../../uploads/1080-${$store.state.guest.companyData.background} 2x, ../../uploads/560-${$store.state.guest.companyData.background} 1x`" :alt="`${$store.state.guest.companyData.name}`")
                
                .welcome__inner(:class="{ hasOffset: $store.state.guest.companyData.background }")
                    h1.welcome__title {{ $store.state.guest.companyData.name }}
                        v-icon.ml-5(light @click="toggleInfoPopup") mdi-information-outline
                    .w-cats(ref="cats")
                        .w-cats__inner(:class="{ 'sticky': isHeaderSticky }")
                            vuescroll(:ops="ops" ref="vs")
                                scrollactive.w-cats__nav(:offset="125" :scrollOffset="120" :duration="600" :alwaysTrack="true" v-on:itemchanged="onItemChanged")
                                    a.w-cats__item.scrollactive-item(
                                        :href="`#${item._id}`"
                                        v-for='(item, key) of $store.state.guest.companyData.categories.filter(e => $store.state.guest.parsedMenu[e._id] && $store.state.guest.parsedMenu[e._id].length)'
                                        :key="item._id") 
                                        span {{item.name}}
                    .menu
                        .menu__section(v-for="(cat, key) of $store.state.guest.companyData.categories" v-bind:key="key" :id="cat._id" v-if="$store.state.guest.parsedMenu[cat._id] && $store.state.guest.parsedMenu[cat._id].length")
                            .menu__section-cat {{cat.name}}
                            .menu__section-row
                                .menu__item(v-for='(item, key) of $store.state.guest.parsedMenu[cat._id]' v-bind:key="key")
                                    MenuItem(:item="item" :placeId="$nuxt.$route.params.id")

        transition(name="fade" mode="out-in")
            .commands(v-if="commands")
                .commands__back(@click="closeCommands")
                transition(name="slide-fade" mode="out-in")
                    .commands__area(v-if="commands && !$store.state.view.isCommandSend" key="commands")
                        .commands__actions
                            v-btn.commands__item.tips(depressed v-if="$store.state.guest.companyData.waiters.length" @click="letTips")
                                img(v-if="navigator && navigator.match(/iPhone|iPod|iPad|Mac/)" src="https://img.icons8.com/ios-glyphs/60/000000/apple-pay.png" alt="toffee.menu")
                                img(v-else-if="navigator && navigator.match(/Android/)" src="https://img.icons8.com/nolan/64/google-pay.png" alt="toffee.menu")
                                img(v-else src="https://img.icons8.com/ios/24/000000/macbook-cards--v3.png" alt="toffee.menu")
                                span Оставить чаевые
                            v-btn.commands__item(v-for="(action, key) in $store.state.guest.companyData.actions" v-if="action.isActive" v-bind:key="key" depressed @click="fastAction(action)" :loading="$store.state.view.loading.sendFastAction._id == action._id") {{ action.callText }}
                            v-btn.commands__item(depressed color="error" @click="toggleCommandsMenu") Закрыть
                    .commands__area(v-if="commands && $store.state.view.isCommandSend" key="success")  
                        .commands__success
                            .commands__success-title 💫<br>Уведомление отправлено
                            v-btn.commands__item(depressed @click="closeCommands") Спасибо
        
        .cart-buttons
            .cart-buttons-inner
                div(v-if="$store.state.guest.user.cart && $store.state.guest.user.orders")
                    transition(name="slide-fade" mode="out-in")
                        v-btn.cart-btn(color="blue" v-if="$store.state.guest.user.orders.length" @click="openOrders") Заказы ({{ $store.state.guest.user.orders.length }})
                
                div(v-if="$store.state.guest.user.cart && $store.state.guest.user.cart[$store.state.guest.companyData.place._id]")
                    transition(name="slide-fade" mode="out-in")
                        v-btn.cart-btn(color="blue" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.length || $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.length" @click="openCart")
                            v-icon(light) mdi-cart
                            <span v-if="getTotalPrice > 0"> {{ getTotalPrice }}{{$store.state.guest.companyData.currencySymbol}} </span>

        
        transition(name="fade")
            .cart(v-if="$store.state.guest.user.cart && $store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.view.isCartOpened")
                .cart__overlay(@click="closeCart")
                .cart__area
                    .cart__top
                        h2.cart__title Корзина
                        .cart__back(@click="closeCart")
                            v-icon(light) mdi-close
                    .cart__content
                        h3.cart__empty(v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.length && !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.length") Корзина пуста
                        // Отображение основных позиций
                        .cart__content-items
                            .cart__item(v-for="(item, key) in $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods" v-bind:key="key")
                                //- .cart__item-img(v-if="item.images[0]" v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.images[0] + ')' }")
                                picture.cart__item-img(v-if="item.images[0]")
                                    source(:srcset="`${ '../../uploads/171-' + item.images[0] }.webp 1x, ${ '../../uploads/342-' + item.images[0] }.webp 2x`" type="image/webp")
                                    img(:src="`${ '../../uploads/171-' + item.images[0] }`" :srcset="`${ '../../uploads/171-' + item.images[0] } 1x, ${ '../../uploads/342-' + item.images[0] } 2x`" :alt="`${item.name}, ${$store.state.guest.companyData.name} toffee.menu`")
                                .cart__item-inner(v-for="(price, idx) in getCustomArr(item.cartPrices)")
                                    .cart__item-content
                                        .cart__item-link(@click="openDetail(item, price)")
                                        .cart__item-name {{ item.name }}
                                        .cart__item-descr(v-if="item.modifications && item.modifications[price]") {{item.modifications[price]}}
                                        span.note {{item.prices[price]}}{{$store.state.guest.companyData.currencySymbol}}  
                                        span.note(v-if="item.weights[price]") {{item.weights[price]}}г

                                    .cart__item-counter
                                        .menu__counter-control(@click="minusMulti(item, price)")
                                            v-icon mdi-minus
                                        .menu__counter-value {{ item.cartPrices.filter(e => e == price).length }}
                                        .menu__counter-control(@click="plusMulti(item, price)")
                                            v-icon mdi-plus

                        // Отображение дополнений
                        h3.cart__item-title(v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.length") Дополнения:
                        .cart__item(v-for="(item, keys) in $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops" v-bind:key="item._id")
                            .cart__item-inner(v-for="(price, idx) in getCustomArr(item.cartPrices)")
                                .cart__item-content
                                    .cart__item-name {{ item.name }}
                                    span.note(v-if="item.price || item.price > 0") {{item.price}} {{$store.state.guest.companyData.currencySymbol}}
                                    span.note(v-else) Бесплатно
                                .cart__item-counter
                                    .menu__counter-control(@click="removeDopFromCart(item)")
                                        v-icon mdi-minus
                                    .menu__counter-value {{ item.cartPrices.filter(e => e == price).length }}
                                    .menu__counter-control(@click="addDopToCart(item)")
                                        v-icon mdi-plus

                .cart__bottom(v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.length || $store.state.guest.user.cart[$store.state.guest.companyData.place._id].dops.length")
                    .cart__bottom-price {{getTotalPrice}} {{$store.state.guest.companyData.currencySymbol}}
                    .cart__bottom-control
                        v-btn(depressed color="yellow" @click="makeOrder" v-if="this.$nuxt.$route.query.t && isAvailable" :loading="$store.state.view.loading.sendOrder") Заказать
                        //- v-btn(depressed color="yellow" v-else) кнопка, если столик не указан

        transition(name="fade")
            .orders(v-if="$store.state.view.isOrdersOpened && $store.state.guest.user")
                .orders__overlay(@click="closeCart")
                .orders__area
                    .orders__top
                        h2.orders__title Заказы
                        .orders__close(@click="closeCart")
                            v-icon(light) mdi-close
                    .orders__content
                        h3.orders__empty(v-if="!$store.state.guest.user.orders.length") Заказов пока нет
                        .sorder(v-for="(item, key) in $store.state.guest.user.orders" v-bind:key="key")
                            .sorder__top
                                .sorder__status.wait(v-if="item.status === 'pending'") Ожидание
                                .sorder__status.accepted(v-else) Подтвержден
                                .sorder__time {{ getTime(item.timestamp) }}
                            .sorder__goods
                                .sorder__line(v-for="(good, key) in item.goods" v-bind:key="key")
                                    .sorder__line-item(v-for="(price, idx) in getCustomArr(good.cartPrices)")
                                        .sorder__line-content
                                            .sorder__line-link(v-if="$store.state.guest.parsedMenu[good.category] && $store.state.guest.parsedMenu[good.category].find(e => e._id == good._id)" @click="openDetail(good, price)")
                                            h4.sorder__line-name {{ good.name }}
                                            .sorder__line-descr(v-if="good.modifications[price]") {{ good.modifications[price] }}
                                            .sorder__line-data {{ good.prices[price] }}{{ $store.state.guest.companyData.currencySymbol }} <span v-if="good.weights[price]">{{ good.weights[price] }}г</span>
                                        .sorder__line-count 
                                            span.note x
                                            span.value {{ good.cartPrices.filter(e => e == price).length }}

                            div(v-if="item.dops.length")
                                h4.sorder__subtitle Дополнения:
                                .sorder__goods
                                    .sorder__line(v-for="(dop, key) in item.dops" v-bind:key="key")
                                        .sorder__line-item(v-for="(price, idx) in getCustomArr(dop.cartPrices)")
                                            .sorder__line-content
                                                h4.sorder__line-name {{ dop.name }}
                                                .sorder__line-data(v-if="dop.prices[price] || dop.prices[price] > 0") {{dop.prices[price]}}{{$store.state.guest.companyData.currencySymbol}}
                                                .sorder__line-data(v-else) Бесплатно
                                            .sorder__line-count 
                                                span.note x
                                                span.value {{ dop.cartPrices.filter(e => e == price).length }}
                            .sorder__bottom
                                .sorder__price 
                                    span.note Итого 
                                    span.value {{ getOrderPrice(item) }}{{$store.state.guest.companyData.currencySymbol}}

        transition(name="slide-fade-detail")
            MenuItemDetail(v-if="$store.state.view.detail.visible" :item="$store.state.view.detail.item" :placeId="$nuxt.$route.params.id")

        transition(name="fade")
            InfoPopup(v-show="$store.state.view.popup.infoPopup" :place="$store.state.guest.companyData.place")

        transition(name="fade")
            ReservePopup(v-if="$store.state.view.popup.reservePopup.visible")

        transition(name="fade")
            TipsPopup(v-if="$store.state.view.popup.tipsPopup.visible")

        client-only
            vue-confirm-dialog

</template>

<script>

import Vue from 'vue';
import VueScrollactive from 'vue-scrollactive';
import vuescroll from 'vuescroll';

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import moment from 'moment';

Vue.use(VueScrollactive);
Vue.use(vuescroll);

const axios = require('axios').default

export default {
    name: 'main-page',
    layout: 'main',
    components: {
        VueSlickCarousel,
        vuescroll
    },
    data() {
        return {
            navigator: null,
            isLoading: true,
            commands: false,
            isCartEmpty: true,
            isCartOpened: false,
            isOrdersOpened: false,
            headerTop: 0,
            isHeaderSticky: false,
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'percent',
                    detectResize: false,
                    locking: false,
                },
                scrollPanel: {
                    initialScrollY: 0,
                    initialScrollX: 0,
                    speed: 250,
                    easing: 'easeInQuad',
                    verticalNativeBarPos: 'right'
                },
                rail: {
                    background: '#fff',
                    opacity: 1,
                    size: '3px',
                    specifyBorderRadius: false,
                    gutterOfEnds: null,
                    gutterOfSide: '2px',
                    keepShow: false
                },
                bar: {
                    showDelay: 500,
                    onlyShowBarOnScroll: false,
                    keepShow: false,
                    background: '#c1c1c1',
                    opacity: 1,
                    hoverStyle: false,
                    specifyBorderRadius: false,
                    minSize: 0,
                    size: '3px',
                    disable: false
                }
            }
        }
    },
    async fetch () {
        try {
            if (this.$route.params.id) {
                const id = this.$route.params.id

                const user = await axios({
                    method: 'get',
                    url: `https://toffee.menu:8000/api/get-user-data/${id}`
                })
                console.log(user)

                if (user.data) {
                    this.$store.state.guest.companyData = user.data
                    this.$store.state.guest.parsedMenu = {}
                    for (let item of this.$store.state.guest.companyData.goods) {
                        if (this.$store.state.guest.parsedMenu[item.category]) {
                            this.$store.state.guest.parsedMenu[item.category].push(item)
                        } else {
                            this.$store.state.guest.parsedMenu[item.category] = [item]
                        }
                        this.$store.state.guest.parsedMenu[item.category] = this.$store.state.guest.parsedMenu[item.category].sort(function(a, b) { return a.order - b.order })
                    }
                }

                this.isLoading = false
                
            }
        } catch (error) {
            console.error(error)
        }
    },
    mounted() {
        // if (this.$store.state.guest.companyData) {
        //     this.navigator = navigator.userAgent
        //     window.addEventListener('scroll', (e) => {
        //         this.headerTop = this.$refs.cats.getBoundingClientRect().top;
        //     })
        // } else {
        //     this.$router.push($nuxt.localePath({ name: 'error' }))
        // }
    },
    watch: {
        headerTop(newValue) {
            if (this.headerTop < 70) {
                this.isHeaderSticky = true;
            } else {
                this.isHeaderSticky = false;
            }
        }
    },
    computed: {
        getTotalPrice: function () {
            let total = 0
            for (let o in this.$store.state.guest.user.cart[this.$store.state.guest.companyData.place._id]) {
                for (let i of this.$store.state.guest.user.cart[this.$store.state.guest.companyData.place._id][o]) {
                    for (let n in i.cartPrices) {
                        let price = +i.prices[+i.cartPrices[n]] ? parseFloat(+i.prices[+i.cartPrices[n]]) : 0
                        total += +parseFloat(price)
                    }
                }
            }

            return +total.toFixed(2).toString()
        },
        isAvailable() {
            const isStandart = this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.guest.companyData.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        },
        isSubscriptionActive() {
            const isStandart = this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].type == 'standart'
            const isPremium = this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].type == 'premium'
            const isNotExpired = !moment(this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.guest.companyData.subscription[0].expires).isBefore()
            return isStandart && isNotExpired || isPremium && isNotExpired || isTrial
        }
    },
    methods: {
        toggleScrollOn() {
            // document.body.style.position = 'fixed';
            // document.body.style.top = `-${window.scrollY}px`;
        },
        letTips() {
            this.$store.state.view.popup.tipsPopup.visible = true
            this.commands = false
        },
        onItemChanged(event, currentItem, lastActiveItem) {
            if (currentItem) {
                this.$refs["vs"].scrollTo(
                    { x: currentItem.offsetLeft - 35 }, 250, "easeInQuad"
                )
            }
        },
        addDopToCart(dop) {
            this.$store.dispatch('guest/addDopToCart', {
                item:  dop,
                place: this.$store.state.guest.companyData.place._id,
                price: 0
            })
        },
        removeDopFromCart(dop) {
            this.$store.dispatch('guest/minusDopMulti', {
                place: this.$store.state.guest.companyData.place._id,
                item: dop,
                price: 0
            })
        },
        getPlaceId(place) {
            return this.$store.state.guest.companyData.places.find(e => e.link == place)._id
        },
        plusMulti(item, checkedPrice) {
            this.$store.dispatch('guest/addToCart', {
                place: this.$nuxt.$route.params.id,
                item: item,
                price: checkedPrice
            })
        },
        minusMulti(item, checkedPrice) {
            this.$store.dispatch('guest/minusCartItemMulti', {
                place: this.$nuxt.$route.params.id,
                item: item,
                price: checkedPrice
            })
        },
        getCustomArr(arr) {
            const newArr = []
            for (let i in arr) {
                if (newArr.indexOf(arr[i]) == -1) {
                    newArr.push(arr[i])
                }
            }
            return newArr.sort(function(a, b) { return a - b; })
        },
        getTime(time) {
            // return moment(time).local().locale('ru').calendar()
            return moment(time).format('DD.MM.YYYY, HH:MM')
        },
        toggleCommandsMenu() {
            this.commands = !this.commands
            this.$store.state.view.isCommandSend = false
        },
        toggleInfoPopup() {
            this.$store.state.view.popup.infoPopup = !this.$store.state.view.popup.infoPopup
        },
        addToCart(item) {
            this.$store.dispatch('guest/addToCart', item)
        },
        minus(item) {
            this.$store.dispatch('guest/minusCartItem', item)
        },
        plus(item) {
            this.$store.dispatch('guest/plusCartItem', item)
        },
        makeOrder() {
            this.$store.state.view.loading.sendOrder = true
            this.$store.dispatch('guest/makeOrder', {
                order: {
                    goods: this.$store.state.guest.user.cart[this.$store.state.guest.companyData.place._id].goods,
                    dops: this.$store.state.guest.user.cart[this.$store.state.guest.companyData.place._id].dops,
                    status: 'pending',
                    table: this.$nuxt.$route.query.t,
                    place: this.$nuxt.$route.params.id,
                    price: this.getTotalPrice
                },
                id: this.$nuxt.$route.params.id
            })
        },
        openOrders() {
            this.$store.state.view.isOrdersOpened = true
            this.$store.state.view.isCartOpened = false
        },
        openCart() {
            this.$store.state.view.isOrdersOpened = false
            this.$store.state.view.isCartOpened = true
        },
        closeCart() {
            this.$store.state.view.isOrdersOpened = false
            this.$store.state.view.isCartOpened = false
        },
        getOrderPrice(item) {
            let total = 0
            for (let o of ['goods', 'dops']) {
                for (let i of item[o]) {
                    for (let n in i.cartPrices) {
                        let price = +i.prices[+i.cartPrices[n]] ? parseFloat(+i.prices[+i.cartPrices[n]]) : 0
                        total += +parseFloat(price)
                    }
                }
            }
            return +total.toFixed(2).toString()
        },
        fastAction(action) {
            action.userId = this.$nuxt.$route.params.id
            action.place = this.$nuxt.$route.query.place
            action.table = this.$nuxt.$route.query.t
            this.$store.dispatch('guest/fastAction', action)
        },
        closeCommands() {
            this.$store.state.view.isCommandSend = false
            this.commands = false
        },
        openDetail(item, price) {
            this.closeCart()
            this.$store.dispatch('guest/openDetail', {
                item, checkedPrice: price
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.orders {
    position: fixed;
    z-index: 23;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (min-width: 450px) {
        padding: 40px 0;
    }
    &__overlay {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    &__area {
        width: 100%;
        max-width: 450px;
        margin: auto;
        position: relative;
        z-index: 2;
        background-color: rgb(240, 240, 240);
        overflow: hidden;
        @media screen and (min-width: 450px) {
            border-radius: 14px;
        }
    }
    &__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
    }
    &__close {
        cursor: pointer;
    }
    &__empty {
        text-align: center;
        margin: 100px 0;
        background-color: #fff;
    }
}

.cart-buttons {
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 1080px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 22;
    height: 0;
    display: flex;
    justify-content: center;
    &-inner {
        position: relative;
        top: -50px;
        padding: 0 15px;
        display: flex;
        justify-content: center;
    }
}

.cart-btn {
    border-radius: 10px;
    background-color: #000 !important;
    opacity: 0.95;
    color: #fff;
    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
    margin: 0 6px;
    span {
        margin-left: 15px;
    }
}

.cart {
    position: fixed;
    z-index: 23;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 67px;
    @media screen and (min-width: 450px) {
        padding: 40px 0 75px;
    }
    &__overlay {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    &__area {
        position: relative;
        background-color: #fff;
        max-width: 450px;
        width: 100%;  
        margin: auto;
        overflow: hidden;
        @media screen and (min-width: 450px) {
            border-radius: 14px;
        }
    }
    &__empty {
        text-align: center;
        margin: 100px 0;
        background-color: #fff;
    }
    &__top {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
        border-bottom: 1px solid rgb(226, 226, 226);
    }
    &__subtitle {
        margin-left: auto;
    }
    &__back {
        cursor: pointer;
    }
    
    &__content {
        background-color: rgb(243, 243, 243);
    }
    &__item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        margin-bottom: 10px;
        background-color: #fff;
        &:last-child {
            margin-bottom: 0;
        }
        &-title {
            padding: 10px;
        }
        &-img {
            width: 110px;
            height: 110px;
            background-position: center;
            background-size: cover;
            flex-shrink: 0;
            border-radius: 10px;
            margin-bottom: 10px;
            overflow: hidden;
            img {
                max-width: 100%;
                height: auto;
                // image-rendering: -webkit-optimize-contrast;
            }
        }
        &-inner {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgb(226, 226, 226);
            padding-bottom: 10px;
            padding-top: 10px;
            &:last-child {
                border: none;
                padding-bottom: 0;
            }
        }
        &-content {
            position: relative;
            flex-grow: 1;
            padding-right: 10px;
            span.note {
                color: #a3a3a3;
                font-size: 14px;
            }
        }
        &-counter {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 120px;
            flex-shrink: 0;
        }
        &-name {
            font-weight: bold;
            font-size: 18px;
            line-height: 1.25;
        }
        &-price {
            padding-bottom: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #000;
            display: flex;
            align-items: center;
        }
        &-descr {
            font-size: 15px;
            line-height: 1.2;
        }
        &-link {
            position: absolute;
            z-index: 2;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
        }
    }
    &__bottom {
        position: fixed;
        bottom: 0;
        width: 100%;
        max-width: 450px;
        display: flex;
        align-items: center;
        padding: 15px;
        border-top: 1px solid rgb(226, 226, 226);
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
        background-color: #fff;
        @media screen and (min-width: 450px) {
            border-radius: 14px;
        }
        &-price {
            min-width: 90px;
            flex-shrink: 0;
            margin-right: 15px;
            font-weight: bold;
            font-size: 18px;
        }
        &-control {
            flex-grow: 1;
            .v-btn {
                width: 100%;
                &.loading {
                    animation-duration: .8s;
                    animation-name: loading;
                    animation-iteration-count: infinite;
                    pointer-events: none;
                }
            }
        }
    }
    &__orders {
        &-col {
            display: flex;
            flex-direction: column-reverse;
        }
    }
}

@keyframes loading {
  from {
    opacity: 1;
  }

  50% {
      opacity: 0.5;
  }

  to {
    opacity: 1;
  }
}

.menu {
    &__section {
        &-cat {
            font-weight: bold;
            font-size: 22px;
            margin-bottom: 5px;
            color: $color-black;
            @media screen and (min-width: 768px) {
                font-size: 24px;
            }
        }
        &-row {
            display: flex;
            flex-wrap: wrap;
        }
    }
    &__item {
        width: calc(50% - 4px);
        margin-right: 8px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        &:nth-child(even) {
            margin-right: 0;
        }
        @media screen and (min-width: 580px) {
            width: calc(33.3333% - 10px);
            max-width: 255px;
            margin-right: 15px;
            &:nth-child(even) {
                margin-right: 15px;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
        }

        @media screen and (min-width: 824px) {
            width: calc(25% - 7.5px);
            margin-right: 10px;
            &:nth-child(even) {
                margin-right: 10px;
            }
            &:nth-child(3n) {
                margin-right: 10px;
            }
            &:nth-child(4n) {
                margin-right: 0;
            }
        }
        
        &-img {
            position: relative;
            flex-shrink: 0;
            margin-bottom: 30px;
            &-pic {
                background-position: center;
                background-size: cover;
                @media screen and (min-width: 768px) {
                    height: 20vw;
                }
            }
        }
        &-name {
           margin-bottom: 7px;
        }
        &-weight {
            font-size: 14px;
            opacity: 0.9;
        }
        &-button {
            width: 100%;
            padding: 10px;
            background-color: rgb(224, 223, 223);
            border-radius: 14px;
            margin-top: 10px;
            font-size: 16px;
            text-transform: none;
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
}

.w-cats {
    margin-left: -15px;
    margin-right: -15px;
    height: 61px;
    width: calc(100% + 30px);
    overflow: hidden;
    &__nav {
        display: flex;
    }
    &__inner {
        display: flex;
        background-color: #fff;
        // box-shadow: 0 0 20px rgba(0,0,0,0.1);
        // padding: 0  0 0 15px;
        margin-right: -15px;
        max-width: 1080px;
        margin: 0 auto;
        
        &.sticky {
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            z-index: 18;
            transition: box-shadow .3s;
        }
    }
    &__item {
        display: inline-block;
        padding: 10px 5px;
        text-decoration: none;
        cursor: pointer;
        span {
            background: #F5F7FB;
            border-radius: 14px;
            padding: 5px 10px;
            flex-shrink: 0;
            font-size: 15px;
            transition: color .3s, background-color .3s;
            color: rgb(107, 107, 107);
            white-space: nowrap;
        }
        &.is-active {
            span {
                color: #000;
                background: #dcdee2;
            }
        }
    }
}

.welcome {
    margin-top: 71px;
    position: relative;
    max-width: 1080px;
    margin: 0 auto;
    &__bg {
        position: fixed;
        left: 0;
        top: 71px;
        right: 0;
        height: 200px;
        background-position: center;
        background-size: cover;
        max-width: 1080px;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);
        @media screen and (min-width: 580px) {
            height: 300px;
        }
    }
    &__inner {
        position: relative;
        background-color: #fff;
        border-radius: 10px;
        padding: 15px 15px 45px 15px;
        top: 71px;
        &.hasOffset {
            top: 240px;
        }
        @media screen and (min-width: 580px) {
            &.hasOffset {
                top: 290px;
                border-radius: 0;
            }
        }
    }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.slide-fade-detail-enter-active, .slide-fade-detail-leave-active {
  transition: all .25s ease;
}
.slide-fade-detail-enter, 
.slide-fade-detail-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all .3s ease;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}
    

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 19;
    background-color: #fff;

    &__inner {
        padding: 10px 15px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        max-width: 1080px;
        margin: 0 auto;
        min-height: 70px;
    }

    &__logo {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: auto;
        &-link {
            position: absolute;
            z-index: 1;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }
        &-img {
            margin-right: 20px;
            max-height: 50px;
            width: auto;
            height: auto;
        }
        &-text {
            line-height: 1.2;
        }
    }
    &__controls {
        flex-shrink: 0;
        margin-left: auto;
    }
}

.commands {
    position: fixed;
    z-index: 25;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    &__area {
        position: absolute;
        z-index: 2;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 14px;
        box-shadow: 0 0 30px rgba(0,0,0,0.15);
        width: 300px;
        padding: 20px;
    }
    &__back {
        position: absolute;
        z-index: 1;
        left: 0;
        top: -100px;
        right: 0;
        bottom: 0;
        cursor: pointer;
        background-color: rgba(0,0,0,0.6);
    }
    &__actions {
        display: flex;
        flex-direction: column;
    }
    &__success {
        display: flex;
        flex-direction: column;
        align-items: center;
        &-title {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .v-btn {
            width: 100%;
        }
    }
    &__item {
        margin-bottom: 15px;
        &:last-child {
            margin-bottom: 0;
        }
        &-images {
            margin-top: 2px;
        }
        img {
            max-height: 36px;
            margin-right: 10px;
        }
    }
}

.geser {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

