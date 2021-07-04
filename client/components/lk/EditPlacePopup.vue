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
export default {
    props: {
        editablePlace: Object
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
            phoneRules: [v => !!v || 'Required', v => /\d{6}/.test(v) || 'Invalid format']
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.editPlacePopup.visible = false
        },
        fetchEditPlace() {
            this.$store.dispatch('lk/editPlace', this.editablePlace)
        }
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
