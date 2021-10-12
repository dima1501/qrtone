<template lang="pug">
    .sorder
        .sorder__top
            .sorder__table Столик <span>{{ order.table }}</span>
            .sorder__time {{ getTime }}
            .sorder__status.wait(v-if="order.status === 'pending'") Ожидание
            .sorder__status.accepted(v-else) Подтвержден
        .sorder__goods
            .sorder__line(v-for="(good, i) in order.goods" v-bind:key="i + 'good'")
                .sorder__line-item(v-for="(price, idx) in getCustomArr(good.cartPrices)")
                    .sorder__line-content
                        h4.sorder__line-name {{ good.name }}
                        .sorder__line-descr(v-if="good.modifications[price]") {{ good.modifications[price] }}
                        .sorder__line-data {{ good.prices[price] }}{{ $store.state.auth.user.currencySymbol }} <span v-if="good.weights[price]">{{ good.weights[price] }}г</span>
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
                            .sorder__line-data(v-if="dop.prices[price] || dop.prices[price] > 0") {{dop.prices[price]}}{{$store.state.auth.user.currencySymbol}}
                            .sorder__line-data(v-else) Бесплатно
                        .sorder__line-count 
                            span.note x
                            span.value {{ dop.cartPrices.filter(e => e == price).length }}
        .sorder__bottom
            .sorder__btn
                v-btn(depressed color="primary" @click='acceptOrder()' v-if="order.status == 'pending'" :loading="loading") Подтвердить
            .sorder__price 
                span.note Итого:
                span.value  {{ getOrderPrice }}{{$store.state.auth.user.currencySymbol}}
</template>

<script>
import moment from 'moment';
const axios = require('axios').default

export default {
    props: {
        order: Object
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        getTime: function () {
            return moment(+this.order.timestamp).format('DD.MM.YYYY h:mm')
        },
        getOrderPrice: function () {
            let total = 0
            for (let o of ['goods', 'dops']) {
                for (let i of this.order[o]) {
                    for (let n in i.cartPrices) {
                        let price = +i.prices[+i.cartPrices[n]] ? parseFloat(+i.prices[+i.cartPrices[n]]) : 0
                        total += +parseFloat(price)
                    }
                }
            }
            return +total.toFixed(2).toString()
        }
    },
    methods: {
        getCustomArr(arr) {
            const newArr = []
            for (let i in arr) {
                if (newArr.indexOf(arr[i]) == -1) {
                    newArr.push(arr[i])
                }
            }
            return newArr.sort(function(a, b) { return a - b; })
        },
        async acceptOrder() {
            try {
                this.loading = true
                const order = this.order
                const accept = await axios({
                    method: 'post',
                    url: '/api/accept-order',
                    data: { order }
                })
                if (accept) {
                    this.$notify({ group: 'custom-style', type: 'n-success', title: 'Заказ успешно подтвержден' })
                    this.order.status = 'accepted'
                }
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>