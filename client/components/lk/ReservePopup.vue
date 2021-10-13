<template lang="pug">
    .popup.z-22
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                .reserve
                    transition(name="fade" mode="out-in")
                        .reserve__step(v-if="step == 1" key="reserve_1")
                            .reserve__step-title Заявка на<br>бронирование
                            .reserve__datetime
                                .reserve__datetime-section
                                    .reserve__title Дата
                                    .reserve__date
                                        .reserve__date-field
                                            date-picker(
                                                v-model="reservation.date" 
                                                type="date" 
                                                :default-value="new Date()" 
                                                :disabled-date="notBeforeToday" 
                                                format="DD.MM.YYYY"
                                                :clearable="false")
                                
                                .reserve__datetime-section
                                    .reserve__title Время
                                    .reserve__date
                                        .reserve__date-field
                                            date-picker(
                                                v-model="reservation.time"
                                                :minute-step="1"
                                                format="HH:mm"
                                                value-type="format"
                                                type="time"
                                                :clearable="false")

                            .reserve__section
                                .reserve__title Количество гостей
                                .p-counter
                                    .p-counter__control.-minus(@click="substractPerson")
                                        v-icon mdi-minus
                                    .p-counter__value {{ reservation.guests }}
                                    .p-counter__control.-plus(@click="addPerson")
                                        v-icon mdi-plus

                            .reserve__section
                                .reserve__title Пожелания
                                v-textarea(v-model="reservation.comment" flat).reserve__textarea.mt-0.pt-0

                            .reserve__bottom
                                .reserve__bottom-item
                                    v-btn(depressed color="blue" @click="nextStep(2)" :disabled=" reservation.time && reservation.date ? false : true ").white--text Далее

                        .reserve__step(v-if="step == 2" key="reserve_2")
                            .reserve__step-title Данные для<br>связи
                            .reserve__section
                                .reserve__info
                                    .reserve__info-line Бронь: {{ formatDate(reservation.date) }}, в {{ reservation.time }}
                                    .reserve__info-line Гостей: {{ reservation.guests }}
                                    .reserve__info-line {{ reservation.comment }}
                            
                            v-form(v-model="contactForm" @submit.prevent="fetchReserve")
                                .reserve__section
                                    v-text-field(v-model="reservation.name" :rules="nameRules" label="Имя" hide-details="auto")

                                .reserve__section
                                    v-text-field(v-model="reservation.phone" :rules="phoneRules" label="Телефон" hide-details="auto" type="number").mb-10

                                .reserve__bottom
                                    .reserve__bottom-item
                                        v-btn(depressed color="normal" @click="nextStep(1)").blue--text Назад
                                    .reserve__bottom-item
                                        v-btn(depressed color="blue" type="submit" :disabled="!contactForm" :loading="loading").white--text Забронировать

                        .reserve__step.-final(v-if="step == 3" key="reserve_3")
                            .reserve__section
                                .reserve__success
                                    .reserve__success-icon
                                        img(src="https://img.icons8.com/cute-clipart/128/000000/ok.png")
                                    .reserve__success-title Заявка отправлена
                                    .reserve__success-note Для подтверждения бронирования с вами свяжутся

                            .reserve__bottom.center
                                .reserve__bottom-item
                                    v-btn(depressed color="normal" @click="closePopup()" x-large).blue--text Спасибо


</template>


<script>
const axios = require('axios').default

import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/locale/ru'
import 'vue2-datepicker/index.css'

import moment from 'moment';

export default {
    components: { DatePicker },
    data() {
        return {
            loading: false,
            lang: {
                formatLocale: {
                    firstDayOfWeek: 1,
                },
                monthBeforeYear: false,
            },
            reservation: {
                date: new Date(),
                time: moment().format('h:mm'),
                guests: 2,
                comment: '',
                phone: '',
                name: '',
                place: $nuxt.$route.params.id
            },
            step: 1,
            contactForm: true,
            nameRules: [
                (v) => !!v || 'Обязательное поле',
            ],
            phoneRules: [v => !!v || 'Обязательное поле', v => /\d{6}/.test(v) || 'Введите корректный номер'],
        }
    },
    methods: {
        async fetchReserve() {
            try {
                // this.reservation.date = moment(this.reservation.date).format('DD.MM.YYYY')
                this.loading = true
                const res = await axios({
                    method: 'post',
                    url: '/api/reserve',
                    data: this.reservation
                })
                if (res.data) {
                    this.loading = false
                    this.nextStep(3)
                }
            } catch (error) {
                console.error(error)
            }
        },
        closePopup() {
            if (this.step !== 3) {
                this.$confirm({
                    message: `Завершить бронирование?`,
                    button: {
                        no: 'Нет',
                        yes: 'Да'
                    },
                    callback: async (confirm) => {
                        if (!!confirm && confirm !== 'false') {
                            this.$store.state.view.popup.reservePopup.visible = false
                        }
                    }
                })
            } else {
                this.$store.state.view.popup.reservePopup.visible = false
            }
            
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
            return `${prefix ? prefix : ''}${moment(date).format('DD.MM.YYYY')}`
        }
    }
}
</script>

<style lang="scss">
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: #f5f5f5 !important;
}

@import '../../assets/popup.scss';

.reserve {
    padding-bottom: 76px;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
    &__datetime {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 15px;
        &-section {
            width: 48%;
        }
    }
    &__step {
        &.-final {
            padding: 20px 0;
        }
        &-title {
            font-weight: bold;
            font-size: 28px;
            line-height: 1.2;
            padding-right: 20px;
            margin-bottom: 20px;
        }
    }
    &__section {
        margin-bottom: 15px;
    }
    &__title {
        color: $color-black;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 5px;
    }
    .mx-input {
        box-shadow: unset;
        background-color: #f5f7fb;
        border: none;
        color: $color-blue;
    }
    .mx-datepicker {
        width: 100%;
    }
    
    textarea {
        resize: none;
        box-shadow: unset;
        background-color: #f5f7fb;
        border: none;
        border-radius: 10px;
        padding: 10px;
        height: 120px;
    }
    &__info {
        &-line {
            color: $color-blue;
            line-height: 1.3;
        }
    }
    &__bottom {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        background-color: #fff;
        padding: 20px;
        display: flex;
        justify-content: flex-end;
        @media screen and (min-width: 768px) {
            position: static;
            padding: 0;
        }
        &.center {
            justify-content: center;
        }
        &-item {
            margin-right: 15px;
            &:last-child {
                margin-right: 0;
            }
        }
    }

    &__success {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $color-black;
        margin-bottom: 20px;
        min-height: calc(100vh - 126px);
        @media screen and (min-width: 768px) {
            min-height: 0;
        }
        &-title {
            font-size: 26px;
            font-weight: bold;
            margin-bottom: 10px;
            line-height: 1.1;
            text-align: center;
        }
        &-note {
            font-size: 14px;
            max-width: 250px;
            text-align: center;
            line-height: 1.3;
        }
    }
    &__textarea {
        .v-input__slot {
            &:before,
            &:after {
                display: none;
            }
        }
    }
}

.p-counter {
    display: flex;
    align-items: center;
    &__control {
        background-color: #f5f7fb;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__value {
        width: 40px;
        text-align: center;
        color: $color-blue;
    }
}
</style>