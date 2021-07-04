<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Добавление заведения
                v-form(
                    @submit.prevent="fetchAddPlace"
                    v-model="isAddPlaceValid")
                    .e-card
                        .e-card__line
                            v-text-field(
                                v-model="addPlace.name"
                                :rules="nameRules"
                                type="text"
                                required
                                label="Название"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.phone"
                                :rules="addPlace.phone.length ? phoneRules : [true]"
                                placeholder="+7(xxx)xxx-xx-xx"
                                label="Телефон"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.website"
                                type="text"
                                hint="Полная ссылка на сайт, например https://example.com"
                                placeholder="https://example.com"
                                label="Сайт"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.address.full"
                                type="text"
                                hint=""
                                label="Адрес"
                                hide-details="auto"
                                @input="inputAddr"
                                v-lazy-input:debounce="1000")

                            .hints(v-for="(hint, key) in hints" :key="key")
                                .hints__item(@click="checkPlace(hint.GeoObject)")
                                    .hints__item-title {{ hint.GeoObject.name }}
                                    .hints__item-descr {{ hint.GeoObject.description }}

                            .e-card__line-link(v-if="!isMapVisible" @click="showMap") Указать на карте
                            yandex-map(v-if="isMapVisible" :coords="addPlace.address.coords.length ? addPlace.address.coords : [59.982509, 30.385740]" zoom="16" @click="mapClick")
                                ymap-marker(
                                    marker-id="123"
                                    :coords="addPlace.address.coords")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.times"
                                type="text"
                                hint="Например, ежедневно с 10:00 до 23:00"
                                label="Часы работы"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.instagram"
                                type="text"
                                hint="Имя пользователя в Instagram"
                                prefix="instagram.com/"
                                label="Инстаграм"
                                hide-details="auto")
                                
                        .e-card__line
                            v-text-field(
                                v-model="addPlace.vk"
                                type="text"
                                prefix="vk.com/"
                                hint="ID аккаунта в VK"
                                label="Вконтакте"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.whatsapp"
                                type="text"
                                hint="Номер телефона в WhatsApp"
                                label="WhatsApp"
                                hide-details="auto"
                                :rules="addPlace.whatsapp.length ? phoneRules : [true]")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.telegram"
                                type="text"
                                hint="Имя пользователя в Telegram"
                                label="Telegram"
                                hide-details="auto"
                                :rules="addPlace.telegram.length ? phoneRules : [true]")

                        .e-card__bottom
                            v-btn(depressed color="error" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                depressed
                                color="primary"
                                :disabled="!isAddPlaceValid"
                                type="submit"
                            ).e-card__bottom-item Создать
</template>

<script>
import Vue from 'vue'
import { transliterate as tr, slugify } from 'transliteration';
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

const axios = require('axios').default

import {lazyInput} from 'vue-lazy-input'

export default {
    directives:{
        lazyInput
    },
    data() {
        return {
            isAddPlaceValid: false,
            addPlace: {
                name: '',
                phone: '',
                website: '',
                times: '',
                
                instagram: '',
                vk: '',
                whatsapp: '',
                telegram: '',

                link: '',
                address: {
                    full: '',
                    value: '',
                    description: '',
                    coords: []
                }
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            phoneRules: [v => !!v || 'Required', v => /\d{6}/.test(v) || 'Invalid format'],
            hints: [],
            isMapVisible: false
        }
    },
    methods: {
        async showMap() {
            if (!this.addPlace.address.full) {
                await navigator.geolocation.getCurrentPosition((e) => {
                    this.addPlace.address.coords = [e.coords.latitude, e.coords.longitude]
                })
            }
            
            this.isMapVisible = true
        },
        checkPlace(place) {
            this.addPlace.address.full = place.name + ', ' + place.description
            this.addPlace.address.value = place.name 
            this.addPlace.address.description = place.description
            this.addPlace.address.coords = place.Point.pos.split(' ').reverse()
            this.hints = []
        },
        async inputAddr(e) {
            if (!!e) {
                const res = await axios({
                    method: 'get',
                    url: `https://geocode-maps.yandex.ru/1.x/?apikey=55293edc-f6c8-402e-b061-049856f9a0dd&format=json&geocode=${e}`
                })
                this.hints = res.data.response.GeoObjectCollection.featureMember.slice(0, 4)
                if (res.data.response.GeoObjectCollection.featureMember[0]) {
                    this.addPlace.address.coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse()
                }
            } else {
                this.addPlace.address.coords = []
                this.hints = []
            }
        },
        async mapClick(e) {
            const addr = await axios({
                method: 'get',
                url: `https://geocode-maps.yandex.ru/1.x/?apikey=55293edc-f6c8-402e-b061-049856f9a0dd&format=json&geocode=${e.get('coords')[1]}, ${e.get('coords')[0]}`
            })
            this.addPlace.address.value = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.name
            this.addPlace.address.description = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
            this.addPlace.address.full = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.name + ', ' + addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
            this.addPlace.address.coords = e.get('coords')
            this.hints = []
        },
        fetchAddPlace() {
            this.addPlace.link = tr(this.addPlace.name).split(' ').join('_')
            this.$store.dispatch('lk/addNewPlace', this.addPlace)
        },
        closePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = false
        }
    },
    mounted() {

    }
}
</script>
// https://geocode-maps.yandex.ru/1.x/?apikey=ваш API-ключ&geocode=Тверская+6

<style lang="scss">

.ymap-container {
    height: 250px;
    margin-top: 10px;
}

.popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    z-index: 20;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;

    &__closer {
        position: absolute;
        right: 20px;
        top: 25px;
        cursor: pointer;

        .v-icon {
            color: #000;
            transition: transform .3s;
            &:hover {
                transform: rotate(140deg);
            }
        }
    }

    &__container {
        position: relative;
        margin-top: auto;
        margin-bottom: auto;
        background-color: #fff;
        border-radius: 20px;
        padding: 20px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 15px;
    }
}

.e-card {
    &__img {
        margin-bottom: 20px;
        background: #F5F7FB;
        border-radius: 16px;
        padding: 15px;
        display: flex;
        align-items: center;
        &-pic {
            width: 100px;
            height: 100px;
            background-position: center;
            background-size: cover;
        }
    }
    &__line {
        margin-bottom: 10px;
        &-inner {
            display: flex;
            align-items: center;
        }
        // margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        &-label {
            width: 100px;
            margin-right: 20px;
            flex-shrink: 0;
        }
        &-input {
            flex-grow: 1;
            padding: 5px 10px;
            background: #F5F7FB;
            border-radius: 10px;
        }
        &-link {
            text-align: center;
            padding: 15px;
            color: $color-blue;
            cursor: pointer;
        }
    }
    &__bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        &-item {
            margin: 0 10px;
            cursor: pointer;
        }
    }
}

.hints {
    &__item {
        padding: 10px;
        border-radius: 10px;
        background-color: rgb(243, 243, 243);
        cursor: pointer;
        margin: 5px 0;
        &:hover {
            background-color: rgb(236, 236, 236);
        }
        &-title {
            font-weight: bold;
            line-height: 1.3;
        }
        &-descr {
            font-size: 14px;
            line-height: 1.25;
            color: $color-grey-dark;
        }
    }
}
</style>
