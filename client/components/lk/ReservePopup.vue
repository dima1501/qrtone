<template lang="pug">
    .popup
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
                                v-btn(depressed color="blue" @click="nextStep(2)").white--text Далее

                    .reserve__step(v-if="step == 2")
                        .reserve__section
                            .reserve__title Заказ
                            .reserve__info
                                span {{ formatDate(reservation.date) }}
                                span {{ reservation.time }}
                                span {{ reservation.guests }} персон(ы)
                                span {{ reservation.comment }}
                            
                        .reserve__section
                            .reserve__title Имя
                            v-text-field(v-model="reservation.name")

                        .reserve__section
                            .reserve__title Телефон
                            v-text-field(v-model="reservation.phone")

                        .reserve__bottom
                            .reserve__bottom-item
                                v-btn(depressed color="normal" @click="nextStep(1)").blue--text Назад
                            .reserve__bottom-item
                                v-btn(depressed color="blue" @click="nextStep(3)").white--text Забронировать

                    .reserve__step(v-if="step == 3")
                        .reserve__section
                            .reserve__success
                                .reserve__success-icon
                                .reserve__success-title Заявка отправлена
                                .reserve__success-note Для подтверждения бронирования с вами свяжутся

                            .reserve__icon icon success
                            .reserve__

</template>


<script>
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
                name: ''
            },
            step: 1
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.reservePopup.visible = false
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
            // const prefix = moment(date).isSame(moment(), 'd') ? 
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

</style>