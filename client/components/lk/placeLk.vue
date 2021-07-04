<template lang="pug">
    .place
        h3.place__name {{ place.name }}
        .place__edit(@click="editPlace") Изменить данные
        hr
        h4(v-if="place.tables && place.tables.length") Столики в заведении ({{ place.tables.length }})
        h4(v-if="!place.tables || !place.tables.length") Столики не добавлены
        .place__edit(@click="editTables") Управление столиками
        hr
        h4 Ссылка на меню заведения
        p Можно поделиться в социальных сетях или добавить как ссылку на меню в Google Maps
        a(:href="`https://qrtone.com/m/${ place.link }`" target="_blank" v-if="!edit").place__link qrtone.com/m/{{ place.link }}
            v-icon(light @click="copyLink(place.link)") mdi-open-in-new
        v-form(
            @submit.prevent="fetchEditLink"
            v-model="isEditLinkValid"
            v-if="edit")
            v-text-field(
                type="text"
                label="Введите название заведения"
                prefix="qrtone.com/m/"
                v-model="newLink"
                :rules="linkRules"
                hide-details="auto")
            .place__bottom
                .place__bottom-item.-red(@click="disable()") Отмена
                button.place__bottom-item(type="submit" :disabled="!isEditLinkValid") Сохранить

        .place__bottom(v-if="!edit")
            .place__bottom-item(@click="copyLink(place.link)") Копировать
            .place__bottom-item(v-if="navigator && navigator.share" @click="shareLink(place.link)") Поделиться
            .place__bottom-item(@click="editLink()") Изменить
        .place__bottom-item.-red.-remove(@click="remove()") Удалить заведение
</template>

<script>
import { transliterate as tr } from 'transliteration';

export default {
    props: {
        place: Object
    },
    data() {
        return {
            navigator: {},
            isEditLinkValid: true,
            newLink: '',
            edit: false,
            linkRules: [
                (v) => !!v && !v.includes('?') && !v.includes('#') && !v.includes('&') && !v.includes('/') || 'Введите корректное значение'
            ]
        }
    },
    mounted() {
        this.navigator = navigator
        this.newLink = this.place.link
    },
    methods: {
        remove() {
            let confirmation = confirm(`Вы действительно хотите удалить заведение ${this.place.name}?`)
            if (confirmation) {
                this.$store.dispatch("lk/removePlace", this.place)
            }
        },
        disable() {
            this.newLink = this.place.link
            this.$store.state.view.places.edit = false
            this.edit = false
        },
        fetchEditLink() {
            if (this.newLink == this.place.link) {
                this.$store.state.view.places.edit = false
                this.edit = false
            } else {
                this.$store.dispatch('lk/updateLink', {
                    link: tr(this.newLink.split(' ').join('_')),
                    place: this.place
                })
                 this.edit = false
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
            const url = `https://qrtone.com/m/${link}`
            navigator.clipboard.writeText(url)
        },
        shareLink(link) {
            const url = `https://qrtone.com/m/${link}`
            navigator.share({
                title: 'QRTone.com',
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
    background: #F5F7FB;
    border-radius: 16px;
    padding: 20px;
    max-width: 400px;
    position: relative;
    margin-bottom: 20px;
    margin-top: 15px;

    p {
        font-size: 14px;
        margin-bottom: 10px;
        line-height: 1.25;
    }

    &__form {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }

    &__edit {
        font-size: 14px;
        color: $color-blue;
        cursor: pointer;
    }

    &__tables {
        &-inner {
            display: flex;
            flex-wrap: wrap;
        }
        &-item {
            padding: 5px 15px;
            border: 1px solid $color-grey-light;
            border-radius: 5px;
            margin-right: 10px;
            margin-bottom: 10px;
            &-remove {
                cursor: pointer;
                color: $color-red;
                font-size: 14px;
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
        }
    }
}
</style>