<template lang="pug">
    .public(v-if="$store.state.guest.companyData && $store.state.guest.user")
        header.header
            .header__inner
                .header__logo
                    // nuxt-link(to="https://google.com" target="_blank").header__logo-link
                    img(:src="require(`~/static/uploads/${$store.state.guest.companyData.photo}`)").header__logo-img
                transition(name="slide-up")
                    v-icon.ml-5(light @click="toggleInfoPopup" v-if="isHeaderSticky") mdi-information-outline
                .header__controls
                    v-btn(depressed @click="toggleCommandsMenu") Быстрые команды
        .welcome
            .welcome__bg(v-bind:style="{ backgroundImage: 'url(../../uploads/' + $store.state.guest.companyData.background + ')' }")
            .welcome__inner
                h1.welcome__title {{ $store.state.guest.companyData.name }}
                    v-icon.ml-5(light @click="toggleInfoPopup") mdi-information-outline
                .w-cats(ref="cats")
                    scrollactive.w-cats__inner.my-nav(:class="{ 'sticky': isHeaderSticky }" :offset="145")
                        nuxt-link.w-cats__item.scrollactive-item(
                            v-for='(item, key) of $store.state.guest.companyData.categories' 
                            v-bind:key="key" 
                            :to="{ path: `${$nuxt.$route.fullPath}`, hash: `#${item}` }"
                            v-if="$store.state.guest.parsedMenu[item]"
                            ) {{item}}
                .menu
                    .menu__section(v-for="(cat, key) of $store.state.guest.companyData.categories" v-bind:key="key" :id="cat")
                        .menu__item(v-for='(item, key) of $store.state.guest.parsedMenu[cat]' v-bind:key="key")
                            .menu__item-img(v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.image + ')' }")
                            .menu__item-content
                                .menu__item-content-inner
                                    .menu__item-name {{ item.name }}
                                    .menu__item-weight {{ item.weight }}
                                .menu__item-button(@click="addToCart(item)" v-if="!$store.state.guest.user.cart.find(e => e._id == item._id)") {{ item.price }}p

                                // 4 строки ниже я писал в 6 утра и мне очень стыдно, но оно работает
                                .menu__counter(v-if="$store.state.guest.user && $store.state.guest.user.cart.find(e => e._id == item._id)")
                                    .menu__counter-control.minus(@click="minus($store.state.guest.user.cart.find(e => e._id == item._id))") -
                                    .menu__counter-value {{ $store.state.guest.user.cart.find(e => e._id == item._id).count }}
                                    .menu__counter-control.plus(@click="plus($store.state.guest.user.cart.find(e => e._id == item._id))") +
                        
        transition(name="slide-fade")
            .commands(v-if="commands")
                transition(name="fade" mode="out-in")
                    .commands__actions(v-if="!isCommandSend" key="commands")
                        v-btn.commands__item(v-for="(action, key) in $store.state.guest.companyData.actions" v-bind:key="key" depressed @click="fastAction(action)") {{ action.callText }}
                        v-btn.commands__item(depressed color="error" @click="toggleCommandsMenu") Закрыть
                    .commands__success(v-if="isCommandSend" key="success")
                        .commands__success-title 💫<br>Уведомление отправлено
                        v-btn.commands__item(depressed @click="closeCommands") Спасибо

        transition(name="slide-fade")
            v-btn.cart-btn(color="blue" v-if="$store.state.guest.user && $store.state.guest.user.cart.length" @click="openCart") Корзина <span> {{ getTotalPrice }}p </span>

        transition(name="slide-fade")
            v-btn.cart-btn(color="blue" v-if="$store.state.guest.user && $store.state.guest.user.orders.length && !$store.state.guest.user.cart.length" @click="openOrders") Мои заказы {{ $store.state.guest.user.orders.length }}
        
        transition(name="slide-fade")
            .cart(v-if="$store.state.guest.user && $store.state.view.isCartOpened")
                .cart__top
                    .cart__back(@click="closeCart")
                        v-icon(light) mdi-arrow-left
                    h2.cart__title Корзина
                    a.cart__subtitle(@click="openOrders") Заказы
                .cart__content
                    h3.cart__empty(v-if="!$store.state.guest.user.cart.length") Корзина пуста
                    .cart__item(v-for="(item, key) in $store.state.guest.user.cart" v-bind:key="key")
                        .cart__item-img(v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.image + ')' }")
                        .cart__item-content
                            .cart__item-name {{ item.name }}
                            .cart__item-counter
                                .menu__counter-control.minus(@click="minus(item)") -
                                .menu__counter-value {{ item.count }}
                                .menu__counter-control.plus(@click="plus(item)") +
                        .cart__item-price {{ item.price }}p
                .cart__bottom(v-if="$store.state.guest.user.cart.length")
                    .cart__bottom-price {{getTotalPrice}}p
                    .cart__bottom-control
                        v-btn(depressed color="yellow" @click="makeOrder") Заказать

        transition(name="slide-fade")
            .cart(v-if="$store.state.view.isOrdersOpened && $store.state.guest.user")
                .cart__top
                    .cart__back(@click="closeCart")
                        v-icon(light) mdi-arrow-left
                    h2.cart__title Заказы
                    a.cart__subtitle(@click="openCart") Корзина
                .cart__content
                    .cart__orders-col
                        .sorder(v-for="(item, key) in $store.state.guest.user.orders" v-bind:key="key")
                            h3.sorder__title(v-if="item.status === 'pending'") Ожидает подтверждения
                            h3.sorder__title(v-if="item.status === 'accepted'") Подтвержден
                            .sorder__status.sorder__status--wait
                                v-icon(dark) mdi-alarm
                            .sorder__goods
                                .sorder__line(v-for="(good, key) in item.goods" v-bind:key="key") {{ good.name }} x {{ good.count }}
                            .sorder__price Итого: {{ getOrderPrice(item) }}р
        transition(name="slide-fade")
            InfoPopup(v-if="$store.state.view.popup.infoPopup")

</template>

<script>

import Vue from 'vue';
import VueScrollactive from 'vue-scrollactive';

Vue.use(VueScrollactive);

export default {
    layout: 'main',
    data() {
        return {
            commands: false,
            isCommandSend: false,
            isCartEmpty: true,
            isCartOpened: false,
            isOrdersOpened: false,
            headerTop: 0,
            isHeaderSticky: false
        }
    },
    mounted() {
        window.addEventListener('scroll', (e) => {
            this.headerTop = this.$refs.cats.getBoundingClientRect().top;
        });
    },
    watch: {
        headerTop(newValue) {
            if (this.headerTop < 80) {
                this.isHeaderSticky = true;
            } else {
                this.isHeaderSticky = false;
            }
        }
    },
    computed: {
        getTotalPrice: function () {
            let total = 0
            for (let i of this.$store.state.guest.user.cart) {
                total += i.price * i.count
            }
            return total
        }
    },
    methods: {
        toggleCommandsMenu() {
            this.commands = !this.commands
            this.isCommandSend = false
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
            this.$store.dispatch('guest/makeOrder', {
                order: {
                    goods: this.$store.state.guest.user.cart,
                    status: 'pending',
                    table: this.$nuxt.$route.query.table,
                    place: this.$nuxt.$route.query.place
                },
                id: this.$nuxt.$route.params.id
            })
        },
        openOrders() {
            this.$store.state.view.isOrdersOpened = true
            this.$store.state.view.isCartOpened = false
        },
        openCart() {
            console.log(1)
            this.$store.state.view.isOrdersOpened = false
            this.$store.state.view.isCartOpened = true
        },
        closeCart() {
            this.$store.state.view.isOrdersOpened = false
            this.$store.state.view.isCartOpened = false
        },
        getOrderPrice(item) {
            let total = 0
            for (let i of item.goods) {
                total += i.price * i.count
            }
            return total
        },
        fastAction(action) {
            action.userId = this.$nuxt.$route.params.id
            action.place = this.$nuxt.$route.query.place
            action.table = this.$nuxt.$route.query.table
            this.$store.dispatch('guest/fastAction', action)

            this.isCommandSend = true
        },
        closeCommands() {
            this.isCommandSend = false
            this.commands = false
        }
    }
}
</script>

<style lang="scss" scoped>

.sorder {
    position: relative;
    padding: 20px;
    background: #F5F7FB;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    &__status {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 20px;
        height: 20px;

        &--wait {

            .v-icon {
                color: rgb(210, 221, 47);
            }
        }

        &--accepted {

            .v-icon {
                color: rgb(25, 184, 65);
            }
        }
    }

    &__title {
        margin-bottom: 10px;
    }

    &__goods {
        margin-bottom: 15px;
    }

    &__btn {
        margin-top: auto;
        text-align: center;
    }
}

.cart-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border-radius: 0;
    span {
        margin-left: 40px;
    }
}

.cart {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 21;
    display: flex;
    flex-direction: column;
    &__top {
        padding: 15px;
        display: flex;
        align-items: center;
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
    }
    &__subtitle {
        margin-left: auto;
    }
    &__back {
        cursor: pointer;
        margin-right: 20px;
    }
    &__content {
        flex-grow: 2;
        overflow-y: scroll;
    }
    &__item {
        display: flex;
        padding: 15px;
        border-bottom: 1px solid rgb(231, 231, 231);
        &-img {
            width: 80px;
            height: 80px;
            background-position: center;
            background-size: cover;
            flex-shrink: 0;
            margin-right: 15px;
            border-radius: 10px;
        }
        &-content {
            flex-grow: 1;
            padding-right: 15px;
        }
        &-counter {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 150px;
        }
    }
    &__bottom {
        display: flex;
        align-items: center;
        padding: 15px;
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
        &-price {
            margin-right: 15px;
        }
        &-control {
            flex-grow: 1;
            .v-btn {
                width: 100%;
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

.menu {
    &__section {
        display: flex;
        flex-wrap: wrap;
    }
    &__item {
        width: calc(50% - 8px);
        margin-right: 16px;
        background-color: #fff;
        border-radius: 14px;
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
        overflow: hidden;
        margin-bottom: 15px;
        text-align: center;
        display: flex;
        flex-direction: column;
        &:nth-child(even) {
            margin-right: 0;
        }
        @media screen and (min-width: 768px) {
            width: calc(33.3333% - 10px);
            margin-right: 15px;
            &:nth-child(even) {
                margin-right: 15px;
            }
            &:nth-child(3n) {
                margin-right: 0;
            }
        }
        
        &-img {
            height: 32vw;
            background-position: center;
            background-size: cover;
            flex-shrink: 0;
            @media screen and (min-width: 768px) {
                height: 20vw;
            }
        }
        &-name {
           margin-bottom: 7px;
        }
        &-weight {
            font-size: 14px;
            opacity: 0.9;
        }
        &-content {
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
    margin-bottom: 10px;
    height: 61px;
    width: calc(100% + 30px);
    &__inner {
        display: flex;
        overflow-x: scroll;
        background-color: #fff;
        box-shadow: -20px 0 20px rgba(0,0,0,0);
        padding-left: 15px;
        padding-right: 15px;
        &.sticky {
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            z-index: 18;
            transition: box-shadow .3s;
        }
    }
    &__item {
        margin: 10px 10px 10px 0;
        background: #F5F7FB;
        border-radius: 14px;
        padding: 5px 10px;
        flex-shrink: 0;
        font-size: 14px;
        text-decoration: none;
        transition: color .3s, background-color .3s;
        color: rgb(107, 107, 107);
        &.is-active {
            color: #000;
            background: #dcdee2;
        }
    }
}

.welcome {
    margin-top: 80px;
    position: relative;
    &__bg {
        position: fixed;
        left: 0;
        top: 80px;
        right: 0;
        height: 200px;
        background-position: center;
        background-size: cover;
    }
    &__inner {
        position: relative;
        top: 190px;
        background-color: #fff;
        border-radius: 10px;
        padding: 20px 15px 45px 15px;
    }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(30px);
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
        padding: 15px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__logo {
        position: relative;
        display: flex;
        align-items: center;
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
        }
    }
}

.commands {
    position: fixed;
    left: 50%;
    margin-left: -150px;
    bottom: 50px;
    background-color: #fff;
    border-radius: 14px;
    box-shadow: 0 0 30px rgba(0,0,0,0.15);
    width: 300px;
    padding: 20px;
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
    }
}
</style>

