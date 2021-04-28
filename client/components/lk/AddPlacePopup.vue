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
                            .e-card__line-label Название:
                            v-text-field(
                                ref="name"
                                v-model="addPlace.name"
                                :rules="nameRules"
                                type="text"
                                required)
                        .e-card__line
                            .e-card__line-label Телефон:
                            v-text-field(
                                ref="phone"
                                v-model="addPlace.phone"
                                type="number")
                        .e-card__line
                            .e-card__line-label Инстаграм:
                            v-text-field(
                                ref="inst"
                                v-model="addPlace.inst"
                                type="text")
                        .e-card__line
                            .e-card__line-label ВК:
                            v-text-field(
                                ref="vk"
                                v-model="addPlace.vk"
                                type="text")
                        .e-card__line
                            .e-card__line-label Whats App:
                            v-text-field(
                                ref="wa"
                                v-model="addPlace.wa"
                                type="text")
                        .e-card__bottom
                            v-btn(color="red" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                color="blue" 
                                :disabled="!isAddPlaceValid"
                                type="submit"
                            ).e-card__bottom-item Создать
</template>

<script>
export default {
    data() {
        return {
            isAddPlaceValid: false,
            addPlace: {
                name: '',
                phone: '',
                inst: '',
                vk: '',
                wa: ''
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
        }
    },
    methods: {
        fetchAddPlace() {
            this.$store.dispatch('lk/addNewPlace', this.addPlace)
        },
        closePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = false
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
        display: flex;
        align-items: center;
        margin-bottom: 10px;
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
