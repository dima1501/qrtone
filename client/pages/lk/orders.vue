<template lang="pug">
    .board(v-if="$store.state.auth.user && isAvailable")
        .board__orders
            // .board__top
                // .board__top-time {{ moment().locale('ru').format('LL') }}

            v-select(:items="$store.state.auth.user.places" v-model="place" label="Выберите заведение" item-text="name" item-value="_id" @change="changePlace")

            .board__section
                .board__section-top
                    h3.board__section-name Последние заказы
                    // nuxt-link(to='/lk/orders').board__section-link Все заказы
                .board__section-orders
                    .sorder(v-for="(order, key) in $store.state.auth.user.orders" v-bind:key="key")
                        h3.sorder__title {{ order.status }}
                        .sorder__status.sorder__status--wait
                            v-icon(dark) mdi-alarm
                        .sorder__time(v-if="order.timestamp") {{ formatTime(order.timestamp) }}
                        .sorder__time Столик {{ order.table }}
                        .sorder__goods
                            .sorder__line(v-for="(good, key) in order.goods" v-bind:key="key")
                                div {{ good.name }}
                                .sorder__line-item(v-for="(price, idx) in getCustomArr(good.cartPrices)")
                                    div {{good.prices[price]}}р {{good.weights[price]}}г x {{ good.cartPrices.filter(e => e == price).length }}
                            .sorder__line(v-for="(dop, key) in order.dops" v-bind:key="key")
                                div {{ dop.name }}
                                .sorder__line-item(v-for="(price, idx) in getCustomArr(dop.cartPrices)")
                                    div {{dop.prices[price]}}р  x {{ dop.count }}

                            div Итого: {{ getOrderPrice(order) }}р
                                
                        .sorder__btn(@click='acceptOrder(order)' v-if="order.status == 'pending'") Подтвердить

        .board__aside
            Aside

    div(v-else)
        h2 Заказы доступны с подпиской Premium 
        nuxt-link(:to="localePath('/lk/settings')") Настройки

</template>

<script>
import moment from 'moment';

export default {
    layout: 'lk',
    data() {
        return {
            orders: [],
            place: ''
        }
    },
    mounted() {
        const place = localStorage.getItem("place")
        if (place) {
            this.place = place
            // this.$store.dispatch('lk/loadOrders', place)
            // this.$store.dispatch('lk/loadActions', place)
        }
    },
    computed: {
        isAvailable() {
            const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        }
    },
    methods: {
        changePlace() {
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
        }
    },
}
</script>

<style lang="scss">
.board {
    display: flex;
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

.sorder {
    position: relative;
    padding: 20px;
    height: 100%;
    background: #F5F7FB;
    border-radius: 16px;
    display: flex;
    flex-direction: column;

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
</style>

