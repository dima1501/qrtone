<template lang="pug">
    .sorder
        div(v-if="notify.reservation")
            .sorder__top
                .sorder__table Бронь
                .sorder__time {{ getTime }}
                .sorder__status.wait(v-if="notify.status === 'pending'") Ожидание
                .sorder__status.accepted(v-else) Принято

            .sorder__goods
                .sorder__line
                    .sorder__line-item
                        .sorder__line-content
                            h4.sorder__line-name На {{ formatDate }}, в {{ notify.reservation.time }}
                            .sorder__line-data Количество гостей: {{ notify.reservation.guests }} 
                            .sorder__line-data 
                                a(:href="`tel: ${notify.reservation.phone}`").phone {{ notify.reservation.phone }}
                                span , {{ notify.reservation.name }}
                            .sorder__line-data {{ notify.reservation.comment }}
            .sorder__bottom(v-if="notify.status == 'pending'")
                .sorder__btn
                    v-btn(depressed color="primary" @click='acceptNotification()' :loading="loading") Принято

        div(v-else)
            .sorder__top
                .sorder__table Столик <span>{{ notify.table }}</span>
                .sorder__time {{ getTime }}
                .sorder__status.wait(v-if="notify.status === 'pending'") Ожидание
                .sorder__status.accepted(v-else) Принято

            .sorder__goods
                .sorder__line
                    .sorder__line-item
                        .sorder__line-content
                            h4.sorder__line-name {{ notify.notify.replace('@table', notify.table) }}
            .sorder__bottom(v-if="notify.status == 'pending'")
                .sorder__btn
                    v-btn(depressed color="primary" @click='acceptNotification()' :loading="loading") Принято
</template>

<script>
import moment from 'moment';
const axios = require('axios').default

export default {
    props: {
        notify: Object
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        getTime: function () {
            return moment(this.notify.timestamp).local().format('DD.MM.YYYY h:mm')
        },
        formatDate: function () {
            return moment(this.notify.reservation.date).local().format('DD.MM.YYYY')
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
        async acceptNotification() {
            try {
                this.loading = true
                const data = this.notify
                const accept = await axios({
                    method: 'post',
                    url: '/api/accept-fast-action',
                    data: { data }
                })
                if (accept.data) {
                    this.$notify({ group: 'custom-style', type: 'n-success', title: 'Успешно подтверждено' })
                    data.status = 'accepted'
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