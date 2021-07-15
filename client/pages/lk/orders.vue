<template lang="pug">
    .board(v-if="$store.state.auth.user && !loading")
        transition(name="slide-fade" mode="out-in")
            .board__choose(v-if="!place" key="check_place")
                .board__choose-content
                    .board__choose-title Выберите заведение
                    .board__choose-row
                        .board__choose-item(v-for="(place, key) in $store.state.auth.user.places" :key="key")
                            .board__choose-item-name {{ place.name }}
                            .board__choose-item-addr {{ place.address.full }}
                            v-btn(depressed color="normal" @click="changePlace(place._id)").board__choose-item-btn Выбрать

            .board__main(v-if="place" key="place_checked")
                .board__main-select
                    v-select(:items="$store.state.auth.user.places" v-model="place" label="Выберите заведение" item-text="name" item-value="_id" @change="changePlace")
                .board__main-content
                    .board__main-content-section.-main
                        .board__main-content-section-top Заказы <span v-if="getPendingOrders">{{ getPendingOrders }}</span>

                        transition(name="slide-fade" mode="out-in")
                            .board__main-content-section-loading(v-if="$store.state.view.loading.orders" key="orders_loader")
                                v-icon(light) mdi-loading

                            .board__main-content-section-content(v-else key="orders_content")
                                vuescroll(:ops="ops" ref="vss")
                                    transition-group(type="transition" name="flip-list")
                                        .sorder(v-for="(order, key) in $store.state.auth.user.orders" :key="order.orderId" )
                                            .sorder__top
                                                .sorder__table Столик <span>{{ order.table }}</span>
                                                .sorder__time {{ getTime(order.timestamp) }}
                                                .sorder__status.wait(v-if="order.status === 'pending'") Ожидание
                                                .sorder__status.accepted(v-else) Подтвержден
                                            .sorder__goods
                                                .sorder__line(v-for="(good, i) in order.goods" v-bind:key="i + 'good'")
                                                    .sorder__line-item(v-for="(price, idx) in getCustomArr(good.cartPrices)")
                                                        .sorder__line-content
                                                            h4.sorder__line-name {{ good.name }}
                                                            .sorder__line-descr(v-if="good.modifications[price]") {{ good.modifications[price] }}
                                                            .sorder__line-data {{ good.prices[price] }}{{ $store.state.auth.user.currencySymbol }} {{ good.weights[price] }}г
                                                        .sorder__line-count 
                                                            span.note x
                                                            span.value {{ good.cartPrices.filter(e => e == price).length }}

                                            div(v-if="order.dops.length")
                                                h4.sorder__subtitle Дополнения:
                                                .sorder__goods
                                                    .sorder__line(v-for="(dop, key) in order.dops" v-bind:key="key")
                                                        .sorder__line-item(v-for="(price, idx) in getCustomArr(dop.cartPrices)")
                                                            .sorder__line-content
                                                                h4.sorder__line-name {{ dop.name }}
                                                                .sorder__line-data(v-if="dop.prices[price] || dop.prices[price] > 0") {{dop.prices[price]}}{{$store.state.guest.companyData.currencySymbol}}
                                                                .sorder__line-data(v-else) Бесплатно
                                                            .sorder__line-count 
                                                                span.note x
                                                                span.value {{ dop.cartPrices.filter(e => e == price).length }}
                                            .sorder__bottom
                                                .sorder__btn
                                                    v-btn(depressed color="primary" @click='acceptOrder(order)' v-if="order.status == 'pending'") Подтвердить
                                                .sorder__price 
                                                    span.note Итого 
                                                    span.value {{ getOrderPrice(order) }}{{$store.state.auth.user.currencySymbol}}
                            
                    .board__main-content-section.-aside
                        .board__main-content-section-top Уведомления <span v-if="getPendingNotifications">{{ getPendingNotifications }}</span>
                        transition(name="slide-fade" mode="out-in")
                            .board__main-content-section-loading(v-if="$store.state.view.loading.notifications" key="notify_loader")
                                v-icon(light) mdi-loading
                            .board__main-content-section-content(v-else key="notify_content")
                                vuescroll(:ops="ops" ref="vsss")
                                    transition-group(type="transition" name="flip-list")
                                        .sorder(v-for="(notify, key) in $store.state.auth.user.notifications" :key="notify._id")
                                            div(v-if="notify.reservation")
                                                .sorder__top
                                                    .sorder__table Бронь
                                                    .sorder__time {{ getTime(notify.timestamp) }}
                                                    .sorder__status.wait(v-if="notify.status === 'pending'") Ожидание
                                                    .sorder__status.accepted(v-else) Принято

                                                .sorder__goods
                                                    .sorder__line
                                                        .sorder__line-item
                                                            .sorder__line-content
                                                                h4.sorder__line-name На {{ formatDate(notify.reservation.date) }}, в {{ notify.reservation.time }}
                                                                .sorder__line-data Количество гостей: {{ notify.reservation.guests }} 
                                                                .sorder__line-data 
                                                                    a(:href="`tel: ${notify.reservation.phone}`").phone {{ notify.reservation.phone }}
                                                                    span , {{ notify.reservation.name }}
                                                                .sorder__line-data {{ notify.reservation.comment }}
                                                .sorder__bottom(v-if="notify.status == 'pending'")
                                                    .sorder__btn
                                                        v-btn(depressed color="primary" @click='accept(notify)') Принято

                                            div(v-else)
                                                .sorder__top
                                                    .sorder__table Столик <span>{{ notify.table }}</span>
                                                    .sorder__time {{ getTime(notify.timestamp) }}
                                                    .sorder__status.wait(v-if="notify.status === 'pending'") Ожидание
                                                    .sorder__status.accepted(v-else) Принято

                                                .sorder__goods
                                                    .sorder__line
                                                        .sorder__line-item
                                                            .sorder__line-content
                                                                h4.sorder__line-name {{ notify.notify.replace('@table', notify.table) }}
                                                .sorder__bottom(v-if="notify.status == 'pending'")
                                                    .sorder__btn
                                                        v-btn(depressed color="primary" @click='accept(notify)') Принято

</template>

<script>

import Vue from 'vue';
import vuescroll from 'vuescroll';
import moment from 'moment';

Vue.use(vuescroll);

export default {
    layout: 'lk',
    components: {
        vuescroll
    },
    data() {
        return {
            loading: true,
            orders: [],
            place: '',
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'percent',
                    detectResize: true,
                    locking: false,
                },
                scrollPanel: {
                    initialScrollY: true,
                    initialScrollX: false,
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
                    background: '#000',
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
    mounted() {
        const place = localStorage.getItem("place")
        if (place) {
            this.place = place
        }
        this.loading = false
    },
    computed: {
        getPendingOrders() {
            return this.$store.state.auth.user.orders.filter(e => e.status == 'pending').length
        },
        getPendingNotifications() {
            return this.$store.state.auth.user.notifications.filter(e => e.status == 'pending').length
        },
        isAvailable() {
            const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        }
    },
    methods: {
        accept(message) {
            this.$store.dispatch('lk/acceptFastAction', message)
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
        getOrderPrice(item) {
            let total = 0
            for (let o of ['goods', 'dops']) {
                for (let i of item[o]) {
                    for (let n in i.cartPrices) {
                        total += +i.prices[i.cartPrices[n]]
                    }
                }
            }
            return total
        },
        changePlace(place) {
            if (place) {
                this.place = place
            }

            localStorage.setItem("place", this.place);
            this.$store.dispatch('lk/setPlaceSocketId', {
                place: this.place,
                socketId: this.$nuxt.$socket.id
            })
            this.$store.dispatch('lk/loadOrders', this.place)
            this.$store.dispatch('lk/loadActions', this.place)
        },
        acceptOrder(order) {
            this.$store.dispatch('guest/acceptOrder', order)
        },
        formatTime(time) {
            return moment(time).local().locale('ru').calendar();
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
            return moment(time).format('DD.MM.YYYY HH:MM')
        },
        formatDate(date) {
            return moment(date).format('DD.MM.YYYY')
        }
    },
}
</script>

<style lang="scss">
@keyframes load {
 0% { transform: rotate(0deg) }
 100% { transform: rotate(360deg) }
}

.board {
    min-height: 100%;
    display: flex;
    
    &__choose {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        &-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        &-row {
            display: flex;
            flex-wrap: wrap;
        }
        &-item {
            padding: 15px;
            border-radius: 14px;
            border: 3px solid #F5F7FB;
            box-shadow: 0 0 20px rgb(0 0 0 / 10%);
            transition: box-shadow .3s;
            margin: 0 15px 15px 0;
            max-width: 255px;
            display: flex;
            flex-direction: column;
            &:hover {
                box-shadow: 0 0 20px rgb(0 0 0 / 20%);
            }
            &:last-child {
                margin-right: 0;
            }
            &-name {
                font-size: 18px;
                font-weight: bold;
            }
            &-addr {
                font-size: 14px;
                color: rgb(182, 182, 182);
                line-height: 1.3;
                margin-bottom: 15px;
            }
            &-btn {
                margin-top: auto;
            }
        }
    }

    &__main {
        width: 100%;
        display: flex;
        flex-direction: column;
        &-select {
            max-width: 320px;
        }
        &-content {
            display: flex;
            height: 100%;
            &-section {
                border-radius: 14px;
                border: 3px solid #F5F7FB;
                box-shadow: 0 0 20px rgb(0 0 0 / 10%);
                height: calc(100vh - 130px);
                background-color: #eef1f8;
                overflow: hidden;
                &.-main {
                    width: 500px;
                    margin-right: 30px;
                }
                &.-aside {
                    width: 400px;
                    flex-shrink: 0;
                }
                &-top {
                    font-size: 22px;
                    font-weight: bold;
                    padding: 10px 20px;
                    box-shadow: 0 0 20px rgb(0 0 0 / 5%);
                    span {
                        color: $color-blue;
                        border-radius: 50%;
                        margin-left: 5px;
                    }
                }
                &-content {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 189px);
                }
                &-loading {
                    font-size: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                    .v-icon {
                        font-size: 36px;
                        color: $color-blue;
                        animation: load 1s ease-in-out infinite;
                    }
                }
            }
        }
    }

    &__orders {
        flex-grow: 1;
        padding-right: 20px;
    }
    &__aside {
        width: 300px;
        flex-shrink: 0;
    }
    &__top {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-time {
            font-weight: bold;
        }
    }
    &__place {
        margin-bottom: 20px;
    }
    &__section {
        width: 100%;
        margin-bottom: 30px;
        &-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        &-orders {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column-reverse;
            
            &-item {
                // width: calc(33.3333% - 20px);
                margin-right: 20px;
                margin-bottom: 20px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
@import '../../assets/sorder.scss';
</style>

