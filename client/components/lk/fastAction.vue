<template lang="pug">
    .option
        //- .option__title Кнопки на сайте - {{ action.callText }}
        //- .option__text Уведомление - {{ action.notifyText }}
        //- .option__text Кнопка подтверждения - {{ action.buttonText }}
        v-form(
            @submit.prevent="save()"
            v-model="isFormValid")
            v-text-field(
                type="text"
                label="Кнопка на сайте"
                v-model="updatedAction.callText"
                :disabled="edit ? false : true"
                :rules="requiredRules")
            v-text-field(
                type="text"
                label="Уведомление"
                v-model="updatedAction.notifyText"
                :disabled="edit ? false : true"
                :rules="requiredRules")
            v-text-field(
                type="text"
                label="Кнопка подтверждения"
                v-model="updatedAction.buttonText"
                :disabled="edit ? false : true"
                :rules="requiredRules")
        transition(name="slide-fade" mode="out-in")
            .option__action(v-if="!edit" key="fast_action_edit")
                .option__action-item.-red(@click="deleteAction()") Удалить
                .option__action-item.-blue(@click="editAction()") Изменить

            .option__action(v-if="edit" key="fast_action_save")
                .option__action-item.-red(@click="cancel()") Отмена
                button.option__action-item.-blue(@click="save()" :disabled="!isFormValid" type="submit") Сохранить
</template>

<script>
export default {
    props: {
        action: Object
    },
    data() {
        return {
            isFormValid: true,
            edit: false,
            editableAction: null,
            updatedAction: {
                callText: '', 
                notifyText: '', 
                buttonText: ''
            },
            requiredRules: [
                (v) => !!v || 'Обязательное поле',
            ],
        }
    },
    mounted() {
        this.updatedAction = Object.assign({}, this.action)
    },
    methods: {
        editAction() {
            this.edit = true
        },
        deleteAction() {
            var ask = confirm(`Вы действительно хотите удалить действие "${this.action.callText}"?`);
            if (ask) {
                this.$store.dispatch('lk/deleteAction', this.action._id)
            }
        },
        cancel() {
            this.edit = false
            this.updatedAction = Object.assign({}, this.action)
        },
        save() {
            this.$store.dispatch('lk/editAction', this.updatedAction)
            this.edit = false
        }
    }
}
</script>

<style lang="scss">
.option {
    max-width: 430px;
    &__action {
        display: flex;
        align-items: center;
        &-item {
            margin-right: 15px;
            font-size: 14px;
            cursor: pointer;
            &.-blue {
                color: $color-blue;
            }
            &.-red {
                color: $color-red;
            }
            &:disabled {
                color: $color-grey-light;
            }
        }
    }
}
</style>