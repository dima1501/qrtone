<template lang="pug">
    .place
        h3.place__name {{ place.name }}
        .place__edit(@click="editPlace") Изменить данные
        hr
        h4(v-if="place.tables && place.tables.length") Столики в заведении ({{ place.tables.length }})
        h4(v-if="!place.tables || !place.tables.length") Столики не добавлены
        .place__edit(@click="editTables") Управление столиками
        hr
        v-tooltip(top v-if="!isAvailable")
            template(v-slot:activator="{ on, attrs }")
                .ntfcs__item(v-bind="attrs" v-on="on")
                    v-switch(
                        inset
                        :label='`Кнопка "Забронировать" на странице заведения`'
                        hide-details="auto"
                        :disabled="!isAvailable").mb-4
            span Доступно с подпиской Premium
        .ntfcs__item(v-else)
            v-switch(
                inset
                @change="toggleReservation($event)"
                v-model="place.reservationsEnabled"
                :label='`Кнопка "Забронировать" на странице заведения`'
                hide-details="auto"
                :disabled="!isAvailable"
                :loading="isReservationTogglerLoading").mb-4
        
        hr
        h4 Ссылка на меню заведения
        p Можно поделиться в социальных сетях или добавить как ссылку на меню в Google Maps
        
        transition(name="slide-fade" mode="out-in")
            v-form(
                @submit.prevent="fetchEditLink"
                v-model="isEditLinkValid"
                v-if="edit"
                key="edit_link_form")
                v-text-field(
                    type="text"
                    label="Введите текст ссылки"
                    prefix="toffee.menu/m/"
                    v-model="newLink"
                    :rules="linkRules"
                    hide-details="auto"
                    @input="inputLink"
                    v-lazy-input:debounce="250"
                    v-on:keydown.enter.prevent='fetchEditLink')
                transition(name="slide-fade")
                    .place__error(v-if="isLinkExists" key="palce_link_error") Такая ссылка занята, введите уникальное значение
                .place__bottom
                    .place__bottom-item.-red(@click="disable()") Отмена
                    .place__bottom-item.loading(v-if="isLoading")
                        v-icon(light) mdi-loading
                    button.place__bottom-item(type="submit" v-else :disabled="!isEditLinkValid || isLinkExists || checkedLink !== newLink") Сохранить
                    

            div(key="edit_link_bottom" v-if="!edit")
                a(:href="`https://toffee.menu/m/${ place.link }`" target="_blank").place__link toffee.menu/m/{{ place.link }}
                    v-icon(light @click="copyLink(place.link)") mdi-open-in-new
                .place__bottom
                    .place__bottom-item(@click="copyLink(place.link)") Копировать
                    .place__bottom-item(v-if="navigator && navigator.share" @click="shareLink(place.link)") Поделиться
                    .place__bottom-item(@click="editLink()") Изменить
        .place__bottom-item.-red.-remove(@click="remove()") Удалить заведение
</template>

<script>
import { transliterate as tr } from 'transliteration'
import {lazyInput} from 'vue-lazy-input'
import moment from 'moment';

const axios = require('axios').default

export default {
    props: {
        place: Object
    },
    directives:{
        lazyInput
    },
    data() {
        return {
            navigator: {},
            isEditLinkValid: true,
            isLinkExists: false,
            newLink: '',
            edit: false,
            linkRules: [
                (v) => !!v && !v.includes('?') && !v.includes('#') && !v.includes('&') && !v.includes('/') || 'Введите корректное значение'
            ],
            checkedLink: '',
            isLoading: false,
            isReservationTogglerLoading: false
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
    mounted() {
        this.navigator = navigator
        this.newLink = this.place.link
    },
    methods: {
        async toggleReservation(e) {
            try {
                this.isReservationTogglerLoading = true
                const set = await axios({
                    method: 'post',
                    url: `/api/toggle-place-reservation`,
                    data: {
                        place: this.place._id,
                        status: e
                    }
                })
                if (set.data) {
                    this.place.reservationsEnabled = e
                    this.$notify({ group: 'custom-style', type: 'n-success', title: 'Изменения сохранены' })
                } else {
                    this.place.reservationsEnabled = !e
                    this.$notify({ group: 'custom-style', type: 'n-alarm', title: 'Что-то пошло не так, попробуйте обновить страницу и попробовать снова' })
                }
            } catch (error) {
                console.error(error)
            } finally {
                this.isReservationTogglerLoading = false
            }
        },
        async inputLink(e) {
            if (!!e) {
                try {
                    this.isLoading = true
                    const isLinkExists = await axios({
                        method: 'get',
                        url: `/api/check-place-link/${e}`
                    })
                    if (!isLinkExists.data) {
                        this.isLinkExists = false
                    } else {
                        this.isLinkExists = true
                    }
                    this.checkedLink = e
                    this.isLoading = false
                } catch (error) {
                    console.error(error)
                }
            }
        },
        remove() {
            this.$confirm({
                message:`Вы действительно хотите удалить заведение ${this.place.name}?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch("lk/removePlace", { place: this.place })
                    }
                }
            })
        },
        disable() {
            this.newLink = this.place.link
            this.$store.state.view.places.edit = false
            this.edit = false
            this.isLinkExists = false
        },
        async fetchEditLink() {
            if (!!this.newLink && !this.isLoading) {
                if (this.newLink == this.place.link) {
                    this.$store.state.view.places.edit = false
                    this.edit = false
                } else {
                    const isLinkExists = await axios({
                        method: 'get',
                        url: `/api/check-place-link/${this.newLink}`
                    })
                    if (!isLinkExists.data) {
                        this.isLinkExists = false
                        this.$store.dispatch('lk/updateLink', {
                            link: tr(this.newLink.split(' ').join('_')),
                            place: this.place
                        })
                        this.edit = false
                        
                    } else {
                        this.isLinkExists = true
                    }
                }
            }
        },
        editLink() {
            this.$store.state.view.places.edit = true
            this.edit = true
        },
        editPlace() {
            this.$emit('openEditPlacePopup', Object.assign({}, this.place))
        },
        editTables() {
            this.$emit('editTables', Object.assign({}, this.place))
        },
        copyLink(link) {
            const url = `https://toffee.menu/m/${link}`
            navigator.clipboard.writeText(url)
            this.$notify({ group: 'custom-style', type: 'n-success', title: 'Ссылка скопирована в буфер обмена' })
        },
        shareLink(link) {
            const url = `https://toffee.menu/m/${link}`
            navigator.share({
                title: 'Электронное меню toffee.menu',
                url
            })
        }
    }
}
</script>

<style lang="scss">
hr {
    opacity: 0.35;
    margin: 10px 0;
    color: $color-grey-dark;
}
.place {
    border-radius: 16px;
    padding: 20px;
    max-width: 400px;
    position: relative;
    margin-bottom: 20px;
    margin-top: 15px;
    border: 3px solid #F5F7FB;
    box-shadow: 0 0 20px rgb(0 0 0 / 20%);
    border-radius: 16px;

    p {
        font-size: 14px;
        margin-bottom: 10px;
        line-height: 1.25;
    }

    &__error {
        line-height: 12px;
        font-size: 12px;
        color: #ff5252;
        margin-top: 5px;
    }

    &__form {
        margin-bottom: 10px;
    }

    &__edit {
        font-size: 14px;
        color: $color-blue;
        cursor: pointer;
    }

    &__tables {
        margin-top: 15px;
        &.padding {
            padding-bottom: 84px;
            @media screen and (min-width: 768px) {
                padding-bottom: 0;
            }
        }
        &-item {
            display: flex;
            align-items: center;
            padding: 5px 15px;
            background-color: rgb(243, 243, 243);
            border-radius: 5px;
            margin-bottom: 10px;
            &-remove {
                margin-left: auto;
                cursor: pointer;
                color: $color-red;
                font-size: 14px;
            }
        }
        &-actions {
            position: fixed;
            width: 100%;
            // right: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 15;
            background-color: #fff;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            box-shadow: 0 0 10px rgba(0,0,0,0.15);
            @media screen and (min-width: 768px) {
                position: static;
                border-radius: 15px;
                max-width: 400px;
                transform: none;
                box-shadow: none;
                padding: 0;
                // margin-bottom: 15px;
                // position: static;
                // padding: 0;
            }
        }
    }

    &__link {
        color: $color-blue !important;
        text-decoration: none;
        .v-icon {
            text-decoration: none;
            color: $color-black;
            font-size: 16px;
            margin-left: 7px;
        }
    }

    &__bottom {
        display: flex;
        align-items: center;
        margin-top: 6px;
        &-item {
            font-size: 14px;
            margin-right: 10px;
            cursor: pointer;
            color: $color-blue;
            &.-red {
                color: $color-red;
            }
            &.-remove {
                margin-top: 15px;
            }
            &:disabled {
                color: $color-grey-dark;
            }
            &.loading {
                .v-icon {
                    font-size: 18px;
                    animation: load 1s ease-in-out infinite;
                }
            }
        }
    }
}
</style>