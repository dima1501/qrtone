<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Изменение заведения
                .e-card
                    v-form(
                        @submit.prevent="fetchEditPlace"
                        v-model="isEditPlaceValid")
                        .e-card__line
                            v-text-field(
                                ref="name"
                                label="Название"
                                :rules="nameRules"
                                v-model="editablePlace.name"
                                type="text")
                        .e-card__line
                            v-text-field(
                                ref="phone"
                                label="Телефон"
                                :rules="editablePlace.phone.length ? phoneRules : [true]"
                                v-model="editablePlace.phone"
                                type="text")
                        .e-card__line
                            v-text-field(
                                v-model="editablePlace.website"
                                type="text"
                                hint="Полная ссылка на сайт, например https://example.com"
                                placeholder="https://example.com"
                                label="Сайт")
                        .e-card__line
                            v-textarea(
                                v-model="editablePlace.address.full"
                                type="text"
                                label="Адрес"
                                hide-details="auto"
                                @input="inputAddr"
                                v-lazy-input:debounce="1500"
                                v-on:keydown.enter.prevent='inputAddr'
                                auto-grow
                                rows="2"
                                row-height="20")

                            .hints
                                .hints__item(v-for="(hint, key) in hints" :key="key" @click="checkPlace(hint.GeoObject)")
                                    .hints__item-title {{ hint.GeoObject.name }}
                                    .hints__item-descr {{ hint.GeoObject.description }}

                            .e-card__line-link(v-if="!isMapVisible" @click="showMap") Указать на карте
                            yandex-map(v-if="isMapVisible" :coords="editablePlace.address.coords.length ? editablePlace.address.coords : [59.982509, 30.385740]" zoom="16" @click="mapClick" :controls="['geolocationControl', 'zoomControl']" :options="{yandexMapDisablePoiInteractivity: true}")
                                ymap-marker(
                                    :icon="$store.state.auth.user.photo ? markerIcon : false"
                                    v-if="editablePlace.address.full"
                                    marker-id="123"
                                    :coords="editablePlace.address.coords")

                        .e-card__line
                            v-text-field(
                                v-model="editablePlace.times"
                                type="text"
                                hint="Например, ежедневно с 10:00 до 23:00"
                                label="Часы работы")
                        .e-card__line
                            v-text-field(
                                ref="inst"
                                label="Инстаграм"
                                v-model="editablePlace.instagram"
                                type="text"
                                hint="Имя пользователя в Instagram"
                                prefix="instagram.com/")
                        .e-card__line
                            v-text-field(
                                v-model="editablePlace.vk"
                                type="text"
                                prefix="vk.com/"
                                hint="ID аккаунта в VK"
                                label="Вконтакте")
                        .e-card__line
                            v-text-field(
                                v-model="editablePlace.whatsapp"
                                type="text"
                                hint="Номер телефона в WhatsApp"
                                label="WhatsApp"
                                :rules="editablePlace.whatsapp.length ? phoneRules : [true]")
                        .e-card__line
                            v-text-field(
                                v-model="editablePlace.telegram"
                                type="text"
                                hint="Имя пользователя в Telegram"
                                label="Telegram"
                                :rules="editablePlace.telegram.length ? phoneRules : [true]")
                        .e-card__bottom
                            v-btn(depressed color="error" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                depressed
                                color="primary"
                                :disabled="!isEditPlaceValid"
                                type="submit"
                            ).e-card__bottom-item Сохранить
</template>

<script>
const axios = require('axios').default

import {lazyInput} from 'vue-lazy-input'

export default {
    props: {
        editablePlace: Object
    },
    directives:{
        lazyInput
    },
    data() {
        return {
            isEditPlaceValid: false,
            editPlace: {
                name: ''
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            phoneRules: [v => !!v || 'Required', v => /\d{6}/.test(v) || 'Invalid format'],
            isMapVisible: false,
            hints: [],
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
        closePopup() {
            this.$store.state.view.popup.editPlacePopup.visible = false
        },
        fetchEditPlace() {
            this.$store.dispatch('lk/editPlace', this.editablePlace)
        },
        async showMap() {
            if (!this.editablePlace.address.full) {
                await navigator.geolocation.getCurrentPosition((e) => {
                    this.editablePlace.address.coords = [e.coords.latitude, e.coords.longitude]
                })
            }
            
            this.isMapVisible = true
        },
        checkPlace(place) {
            this.editablePlace.address.full = place.name + ', ' + place.description
            this.editablePlace.address.value = place.name 
            this.editablePlace.address.description = place.description
            this.editablePlace.address.coords = place.Point.pos.split(' ').reverse()
            this.hints = []
        },
        async inputAddr(e) {
            if (!!e) {
                const res = await axios({
                    method: 'get',
                    url: `https://geocode-maps.yandex.ru/1.x/?apikey=55293edc-f6c8-402e-b061-049856f9a0dd&format=json&geocode=${e}`
                })
                this.hints = res.data.response.GeoObjectCollection.featureMember.slice(0, 4)
                this.editablePlace.address.value = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.name
                this.editablePlace.address.description = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
                if (res.data.response.GeoObjectCollection.featureMember[0]) {
                    this.editablePlace.address.coords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').reverse()
                }
            } else {
                this.editablePlace.address.coords = []
                this.hints = []
            }
        },
        async mapClick(e) {
            const addr = await axios({
                method: 'get',
                url: `https://geocode-maps.yandex.ru/1.x/?apikey=55293edc-f6c8-402e-b061-049856f9a0dd&format=json&geocode=${e.get('coords')[1]}, ${e.get('coords')[0]}`
            })
            this.editablePlace.address.value = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.name
            this.editablePlace.address.description = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
            this.editablePlace.address.full = addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.name + ', ' + addr.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
            this.editablePlace.address.coords = e.get('coords')
            this.hints = []
        },
    }
}
</script>


<style lang="scss">
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
</style>
