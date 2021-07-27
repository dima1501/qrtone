<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Бронирование
                .reserve
                    .reserve__step(v-if="step == 1")
                        .reserve__section
                            .reserve__title Дата
                            .reserve__date
                                .reserve__date-field
                                    date-picker(v-model="reservation.date" type="date" :default-value="new Date()" :disabled-date="notBeforeToday" format="DD.MM.YYYY")
                        .reserve__section
                            .reserve__title Время
                            .reserve__date
                                .reserve__date-field
                                    //- date-picker(v-model="time" type="time" :default-time="new Date()" :disabled-time="notBeforeNow")
                                    date-picker(
                                        v-model="reservation.time"
                                        :minute-step="1"
                                        format="HH:mm"
                                        value-type="format"
                                        type="time"
                                        :disabled-time="notBeforeNow")
                            .reserve__note Ежедневно с 10:00 до 23:00

                        .reserve__section
                            .reserve__title Количество гостей
                            .p-counter
                                .p-counter__control.-minus(@click="substractPerson") -
                                .p-counter__value {{ reservation.guests }}
                                .p-counter__control.-plus(@click="addPerson") +

                        .reserve__section
                            .reserve__title Пожелания
                            v-textarea(v-model="reservation.comment")

                        .reserve__bottom
                            .reserve__bottom-item
                                v-btn(depressed color="blue" @click="nextStep(2)" :disabled=" reservation.time && reservation.date ? false : true ").white--text Далее

                    .reserve__step(v-if="step == 2")
                        .reserve__section
                            .reserve__title Инфо о бронировании
                            .reserve__info
                                span {{ formatDate(reservation.date) }}
                                span {{ reservation.time }}
                                span {{ reservation.guests }} персон(ы)
                                span {{ reservation.comment }}
                        
                        v-form(v-model="contactForm" @submit.prevent="fetchReserve")
                            .reserve__section
                                .reserve__title Имя
                                v-text-field(v-model="reservation.name" :rules="nameRules")

                            .reserve__section
                                .reserve__title Телефон
                                v-text-field(v-model="reservation.phone" :rules="phoneRules")

                            .reserve__bottom
                                .reserve__bottom-item
                                    v-btn(depressed color="normal" @click="nextStep(1)").blue--text Назад
                                .reserve__bottom-item
                                    v-btn(depressed color="blue" type="submit" :disabled="!contactForm").white--text Забронировать

                    .reserve__step(v-if="step == 3")
                        .reserve__section
                            .reserve__success
                                .reserve__success-icon
                                .reserve__success-title Заявка отправлена
                                .reserve__success-note Для подтверждения бронирования с вами свяжутся

                        .reserve__section
                            .reserve__title Инфо о бронировании
                            .reserve__info
                                span {{ formatDate(reservation.date) }}
                                span {{ reservation.time }}
                                span {{ reservation.guests }} персон(ы)
                                span {{ reservation.comment }}
                        
                        .reserve__section
                            .reserve__title Имя
                            .reserve__data {{ reservation.name }}

                        .reserve__section
                            .reserve__title Телефон
                            .reserve__data {{ reservation.phone }}

                        .reserve__bottom
                            .reserve__bottom-item
                                v-btn(depressed color="normal" @click="closePopup()").blue--text Спасибо


</template>


<script>
const axios = require('axios').default

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

import moment from 'moment';

export default {
    components: { DatePicker },
    data() {
        return {
            reservation: {
                date: new Date(),
                time: moment().add(15, 'minutes').format('HH:mm'),
                guests: 2,
                comment: '',
                phone: '',
                name: '',
                place: $nuxt.$route.params.id
            },
            step: 1,
            contactForm: true,
            nameRules: [
                (v) => !!v || 'error_name',
            ],
            phoneRules: [v => !!v || 'Required', v => /\d{6}/.test(v) || 'Invalid format'],
        }
    },
    methods: {
        async fetchReserve() {
            try {
                const res = await axios({
                    method: 'post',
                    url: '/api/reserve',
                    data: this.reservation
                })
            } catch (error) {
                console.error(error)
            }
        },
        closePopup() {
            this.$confirm({
                message: `Завершить бронирование?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (confirm) {
                        this.$store.state.view.popup.reservePopup.visible = false
                    }
                }
            })
        },
        notBeforeToday(date) {
            return date < new Date(new Date().setHours(0, 0, 0, 0));
        },
        notBeforeNow(date) {
            return date < moment().add(10, 'minutes');
        },
        substractPerson() {
            if (this.reservation.guests > 1) {
                this.reservation.guests -= 1
            }
        },
        addPerson() {
            this.reservation.guests += 1
        },
        nextStep(n) {
            this.step = n
        },
        formatDate(date) {
            var prefix
            if (moment(date).isSame(moment(), 'd')) {
                prefix = 'Сегодня, '
            } else if (moment(date).isSame(moment().add(1, 'days'), 'd')) {
                prefix = 'Завтра, '
            }
            return `${prefix ? prefix : ''}${moment(date).format('L')}`
        }
    }
}
</script>

<style lang="scss">
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #f5f5f5 !important;
}
</style>