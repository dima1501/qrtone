<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .popup__content
                h2.popup__title QR-коды для <span>{{ $store.state.view.popup.tablesPopup.place.name }}</span>
                .p-tables
                    transition(name="slide-fade" mode="out-in")
                        .p-tables__form(v-if="isAddTableForm" key="qweqewqeqe")
                            v-form(
                                @submit.prevent="addTable"
                                v-model="isAddTableValid")
                                v-text-field(
                                    v-model="newTableName"
                                    :rules="tableRules"
                                    label="Введите название столика"
                                    type="text"
                                    required)
                                v-btn(
                                    depressed
                                    color="normal"
                                    :disabled="!isAddTableValid"
                                    type="submit").mr-5 Готово
                                v-btn(
                                    depressed
                                    color="normal"
                                    @click="isAddTableForm = false").red--text Отмена

                        .p-tables__content(v-else key="qweqewqeqeqweqe")
                            .p-tables__title Столики <span v-if="!$store.state.view.popup.tablesPopup.tables.length">не добавлены</span>
                            .p-tables__row
                                .p-tables__item(v-for="(table, key) in $store.state.view.popup.tablesPopup.tables" :key="key")
                                    .p-tables__item-name {{ table }}
                                    .p-tables__item-delete(@click="removeTable(key)")
                                        v-icon(light) mdi-close-circle-outline 
                                .p-tables__add(@click="isAddTableForm = !isAddTableForm")
                                    v-icon(light) mdi-plus-circle-outline 
                            v-btn(
                                depressed
                                color="primary"
                                @click="openStyleQRPopup()"
                                :disabled="!$store.state.view.popup.tablesPopup.tables.length") Далее
</template>

<script>
export default {
    data() {
        return {
            tables: [],
            isAddTableForm: false,
            isAddTableValid: true,
            newTableName: '',
            tableRules: [
                (e) => !!e || 'Обязательное поле',
                (e) => this.$store.state.view.popup.tablesPopup.tables.indexOf(e) == -1 || 'Такой столик уже существует'
            ]
        }
    },
    mounted() {
        if (!this.$store.state.view.popup.tablesPopup.tables.length && !this.$store.state.view.popup.styleQRPopup.visible) {
            this.$store.state.view.popup.tablesPopup.tables = [...this.$store.state.view.popup.tablesPopup.place.tables]
        }
    },
    methods: {
        addTable() {
            this.$store.state.view.popup.tablesPopup.tables.push(this.newTableName)
            this.isAddTableForm = false
            this.newTableName = ''
        },
        removeTable(key) {
            this.$store.state.view.popup.tablesPopup.tables.splice(key, 1)
        },
        closePopup() {
            this.$store.state.view.popup.tablesPopup.visible = false
            this.$store.state.view.popup.tablesPopup.tables = []
            // тут конфирм мешает при редактированиии возможно стоит сделать проверку todo
            // this.$confirm({
            //     message: `Завершить создание QR-кода?`,
            //     button: {
            //         no: 'Нет',
            //         yes: 'Да'
            //     },
            //     callback: async (confirm) => {
            //         if (!!confirm && confirm !== 'false') {
            //             this.$store.state.view.popup.tablesPopup.visible = false
            //         }
            //     }
            // })
        },
        openStyleQRPopup() {
            this.$store.state.view.popup.styleQRPopup.visible = true
            this.$store.state.view.popup.styleQRPopup.type = 'multi'
            this.$store.state.view.popup.tablesPopup.visible = false

            this.$store.state.view.popup.styleQRPopup.place = this.$store.state.view.popup.tablesPopup.place
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
        right: 15px;
        top: 15px;
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
        padding: 15px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 15px;
        line-height: 1.3;
        span {
            // font-size: 16px;
            // white-space: nowrap;
            color: $color-blue;

            &.main {
                color: $color-black;
                white-space: normal;
            }
            &.tables {
                display: inline-block;
                font-size: 14px;
                color: $color-black;
                margin-right: 5px;
                white-space: normal;
                border-radius: 5px;
                background-color: #e6e6e6;
                padding: 2px 10px;
                font-weight: normal;
                margin-top: 5px;
            }
            &.edit {
                cursor: pointer;
            }
        }
    }
}

.p-tables {
    margin-bottom: 10px;
    &__title {
        color: $color-black;
        margin-bottom: 5px;
    }
    &__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    &__item {
        position: relative;
        border-radius: 5px;
        background-color: rgb(230, 230, 230);
        padding: 2px 10px;
        margin: 0 10px 0px 0;
        &-name {
            font-size: 14px;
            color: $color-black;
        }
        &-delete {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            cursor: pointer;
            z-index: 2;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s;
            background-color: rgb(230, 230, 230);
            &:hover {
                opacity: 1;
            }
            .v-icon {
                font-size: 20px;
            }
        }
    }
    &__add {
        cursor: pointer;
        margin: 10px 10px 10px 0;
        .v-icon {
            color: $color-blue;
        }
    }
}
</style>
