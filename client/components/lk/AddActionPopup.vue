<template lang="pug">
    .popup.z-21
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Создание действия
                v-form(
                    @submit.prevent="fetchAddAction"
                    v-model="isAddActionValid")
                    .e-card
                        .e-card__line
                            v-text-field(
                                label="Текст кнопки на сайте"
                                v-model="addAction.callText"
                                :rules="requiredRule"
                                type="text"
                                required
                                hide-details="auto")
                        .e-card__line
                            v-text-field(
                                label="Текст уведомления"
                                v-model="addAction.notifyText"
                                :rules="requiredRule"
                                type="text"
                                hide-details="auto")
                        .e-card__bottom
                            v-btn(@click="closePopup" depressed color="error").e-card__bottom-item Отмена
                            v-btn(
                                depressed 
                                color="primary"
                                :disabled="!isAddActionValid"
                                type="submit"
                            ).e-card__bottom-item Создать
</template>

<script>
export default {
    data() {
        return {
            isAddActionValid: false,
            addAction: {
                callText: '',
                notifyText: '',
                isActive: true
            },
            requiredRule: [
                (v) => !!v || 'Обязательное поле',
            ],
        }
    },
    methods: {
        fetchAddAction() {
            this.$store.dispatch('lk/addNewAction', { action: this.addAction })
        },
        closePopup() {
            this.$store.state.view.popup.addActionPopup = false
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

@import '../../assets/e-card.scss';
</style>
