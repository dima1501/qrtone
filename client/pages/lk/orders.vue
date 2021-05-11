<template lang="pug">
    .board(v-if="$store.state.auth.user")
        // .board__top
            // .board__top-time {{ moment().locale('ru').format('LL') }}
        h1.board__place Название места
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
                    .sorder__goods
                        .sorder__line(v-for="(good, key) in order.goods" v-bind:key="key")
                            div {{ good.name }}
                            .sorder__line-item(v-for="(price, idx) in getCustomArr(good.cartPrices)")
                                div {{good.prices[price]}}р {{good.weights[price]}}г x {{ good.cartPrices.filter(e => e == price).length }}
                        div Итого: {{ getOrderPrice(order) }}р
                            
                    .sorder__btn(@click='acceptOrder(order)' v-if="order.status == 'pending'") Подтвердить

</template>

<script>
import moment from 'moment';

export default {
    layout: 'lk',
    data() {
        return {
            orders: []
        }
    },
    methods: {
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
            for (let i of item.goods) {
                for (let n in i.cartPrices) {
                    total += +i.prices[i.cartPrices[n]]
                }
            }
            return total
        }
    },
}
</script>

<style lang="scss">
.board {
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

