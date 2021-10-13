<template lang="pug">
    .popup.z-22
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Создание заведения
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
                                label="Название*"
                                hide-details="auto")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.phone"
                                :rules="addPlace.phone.length ? phoneRules : [true]"
                                placeholder="+7(xxx)xxx-xx-xx"
                                label="Телефон"
                                hide-details="auto"
                                type="number")

                        .e-card__line
                            v-text-field(
                                v-model="addPlace.website"
                                type="text"
                                hint="Полная ссылка на сайт, например https://example.com"
                                placeholder="https://example.com"
                                label="Сайт"
                                hide-details="auto")

                        .e-card__line
                            v-textarea(
                                v-model="addPlace.address.full"
                                type="text"
                                label="Адрес"
                                hide-details="auto"
                                @input="inputAddr"
                                v-lazy-input:debounce="1200"
                                v-on:keydown.enter.prevent='inputAddr'
                                auto-grow
                                rows="1"
                                row-height="20")

                            .hints
                                .hints__item(v-for="(hint, key) in hints" :key="key" @click="checkPlace(hint.GeoObject)")
                                    .hints__item-title {{ hint.GeoObject.name }}
                                    .hints__item-descr {{ hint.GeoObject.description }}

                            .e-card__line-link(v-if="!isMapVisible" @click="showMap") Указать на карте
                            yandex-map(v-if="isMapVisible" :coords="addPlace.address.coords.length ? addPlace.address.coords : [59.982509, 30.385740]" zoom="16" @click="mapClick" :controls="['geolocationControl', 'zoomControl']" :options="{yandexMapDisablePoiInteractivity: true}")
                                ymap-marker(
                                    :icon="$store.state.auth.user.photo ? markerIcon : false"
                                    v-if="addPlace.address.full"
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
                                type="number"
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
                                hide-details="auto")

                        .e-card__bottom
                            v-btn(depressed @click="closePopup" large).red--text.e-card__bottom-item Отмена
                            v-btn(
                                depressed
                                color="primary"
                                :disabled="!isAddPlaceValid"
                                type="submit"
                                large
                                :loading="$store.state.view.loading.addNewPlace"
                            ).e-card__bottom-item Создать

</template>

<script>
import Vue from 'vue'
import { transliterate as tr, slugify } from 'transliteration';

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
                (v) => !!v || 'Введите название компании',
            ],
            phoneRules: [v => !!v || 'Обязательное поле', v => /\d{6}/.test(v) || 'Некорректный формат'],
            hints: [],
            isMapVisible: false,
            mapCenter: [],
            markerIcon: {
                layout: 'default#imageWithContent',
                imageHref: ``,
                imageSize: [42, 42],
                imageOffset: [-21, -65],
                contentOffset: [-3, -3],
                contentLayout: `<div style="width: 52px; height: 52px; background: #fff; padding: 5px; box-sizing: border-box; box-shadow: 0 0 20px rgba(0,0,0,0.2); border-radius: 5px;"><div style="background: url(../../uploads/${this.$store.state.auth.user.photo}); background-size: cover; background-position: center; position: relative; z-index: 4; width: 42px; height: 42px; border-radius: 5px;"></div><div style="position: absolute; top: 47px; left: 8px; width: 0;height: 0;border-style: solid;border-width: 14px 18px 0 18px;border-color: #fff transparent transparent transparent;"></div></div>`
            }
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
                if (res.data.response.GeoObjectCollection.featureMember.length) {
                    this.hints = res.data.response.GeoObjectCollection.featureMember.slice(0, 4)
                    this.addPlace.address.value = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.name
                    this.addPlace.address.description = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
                    if (res.data.response.GeoObjectCollection.featureMember[0]) {
                        this.addPlace.address.coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse()
                    }
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
            this.$store.dispatch('lk/addNewPlace', { place: this.addPlace })
        },
        closePopup() {

            this.$confirm({
                message: `Завершить создание заведения?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.addPlacePopup.visible = false
                    }
                }
            })
            
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss">

.ymap-container {
    height: 250px;
    margin-top: 10px;
}

// .popup {
//     position: fixed;
//     left: 0;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     padding: 30px;
//     z-index: 20;
//     background-color: rgba(0,0,0,0.6);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     overflow-y: scroll;

//     &__overlay {
//         position: absolute;
//         left: 0;
//         top: 0;
//         right: 0;
//         bottom: 0;
//     }

//     &.z-21 {
//         z-index: 21;
//     }

//     &__closer {
//         position: absolute;
//         right: 20px;
//         top: 25px;
//         cursor: pointer;

//         .v-icon {
//             color: #000;
//             transition: transform .3s;
//             &:hover {
//                 transform: rotate(140deg);
//             }
//         }
//     }

//     &__container {
//         position: relative;
//         margin-top: auto;
//         margin-bottom: auto;
//         background-color: #fff;
//         border-radius: 20px;
//         padding: 20px;
//         width: 100%;
//         max-width: 400px;
//     }

//     &__title {
//         margin-bottom: 15px;
//     }
// }

@import '../../assets/e-card.scss';

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
