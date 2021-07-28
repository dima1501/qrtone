<template lang="pug">
    .option(:class="{ isActive: action.isActive }")
        v-form(
            @submit.prevent="save()"
            v-model="isFormValid")
            v-switch(
                :id="action._id"
                inset
                @change="fastActionsToggler($event, updatedAction)"
                v-model="action.isActive"
                :label="`${action.isActive ? 'Включено' : 'Отключено'}`"
                hide-details="auto").mt-1.mb-5
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
            updatedAction: {},
            requiredRules: [
                (v) => !!v || 'Обязательное поле',
            ],
        }
    },
    mounted() {
        this.updatedAction = Object.assign({}, this.action)
    },
    methods: {
        fastActionsToggler(e, action) {
            this.updatedAction.isActive = e
            this.$store.dispatch('lk/editAction', { action: this.updatedAction })
        },
        editAction() {
            this.edit = true
        },
        deleteAction() {
            this.$confirm({
                message: `Вы действительно хотите удалить действие "${this.action.callText}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch('lk/deleteAction', { id: this.action._id })
                    }
                }
            })
        },
        cancel() {
            this.edit = false
            this.updatedAction = Object.assign({}, this.action)
        },
        save() {
            this.$store.dispatch('lk/editAction', { action: this.updatedAction })
            this.edit = false
        }
    }
}
</script>

<style lang="scss">
.option {
    max-width: 430px;
    border: 3px solid #e6e9f0;
    background-color: #eaedf3;
    box-shadow: 0 0 20px rgb(0 0 0 / 20%);
    border-radius: 16px;
    padding: 15px;
    margin-bottom: 15px;
    transition: background-color .3s;
    &.isActive {
        background-color: #fff;
    }
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