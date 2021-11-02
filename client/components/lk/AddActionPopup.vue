<template lang="pug">

    .popup.z-22
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                .onboard__title Создание действия
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
                            v-btn(@click="closePopup" depressed large).red--text.e-card__bottom-item Отмена
                            v-btn(
                                depressed 
                                color="primary"
                                :disabled="!isAddActionValid"
                                type="submit"
                                :loading="$store.state.view.loading.createAction"
                                large
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
            this.$confirm({
                message: `Завершить создание быстрого действия?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.addActionPopup = false
                    }
                }
            })
        }
    }
}
</script>


<style lang="scss">
@import '../../assets/e-card.scss';
</style>
