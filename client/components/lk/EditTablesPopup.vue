<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление столиками<br>
                    span {{ place.name }}
                v-form(
                    @submit.prevent="fetchCreateTable"
                    v-model="isAddTableValid").place__form
                    v-text-field(
                        v-model="newTableStart"
                        type="text"
                        label="Новый столик"
                        :rules="[!!newTableStart && !!newTableStart.length && !newTableStart.includes('?') && !newTableStart.includes('#') && !newTableStart.includes('&') || 'Введите корректное значение']")
                    v-btn(
                        depressed
                        color="primary"
                        :disabled="!isAddTableValid"
                        type="submit"
                        v-if="isAddTableValid"
                    ).e-card__bottom-item Добавить
                .place__tables
                    .place__tables-inner(v-if="place.tables && place.tables.length")
                        .place__tables-item(v-for="(table, key) in place.tables" :key="key")
                            .place__tables-item-name {{ formatTable(table) }}
                            .place__tables-item-remove(light @click="removeTable(table, key)")
                                v-icon(light) mdi-trash-can-outline

                        // Добавление диапазона столиков
                        //- div
                        //-     input(type="checkbox" id="tablesRange" v-model="isTablesMulti" @change="clearNewTables")
                        //-     label(for="tablesRange") Диапазон столиков

                        //- label(v-if="!isTablesMulti") Введите название или номер столика
                        //- label(v-if="isTablesMulti") Введите диапазон столиков, например 1 и 10
                    

                    //- input(:type="!isTablesMulti ? 'text' : 'number'" placeholder="" v-model="newTableStart")
                    //- span(v-if="isTablesMulti") -
                    //- input(type="number" placeholder="" v-if="isTablesMulti" v-model="newTableEnd")

                    //- .button.-black(@click="fetchCreateTable") Добавить


</template>

<script>
export default {
    props: {
        place: Object
    },
    data() {
        return {
            isTablesMulti: false,
            newTableStart: null,
            newTableEnd: null,
            isAddTableValid: true
        }
    },
    methods: {
        formatTable(table) {
            if (typeof table == 'number') {
                return table
            } else {
                return table.replaceAll('%20', ' ')
            }
        },
        closePopup() {
            this.$store.state.view.popup.editTablesPopup.visible = false
        },
        removeTable(table, key) {
            this.$confirm({
                message:`Вы действительно хотите удалить столик "${table}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.place.tables.splice(key, 1)
                        this.$store.dispatch("lk/updateTables", { place: this.place, isRemove: true })
                    }
                }
            })
        },
        clearNewTables() {
            this.newTableStart = this.newTableEnd = null
        },
        fetchCreateTable() {
            if (!this.isTablesMulti) {
                if (this.place.tables.indexOf(this.newTableStart.trim().replaceAll(' ', '%20')) == -1) {
                    this.place.tables.push(this.newTableStart.trim().replaceAll(' ', '%20'))
                    this.$store.dispatch("lk/updateTables", { place: this.place })
                } else {
                    this.$notify({ group: 'custom-style', type: 'n-alarm', title: 'Столик с таким названием уже существует' })
                }
            } else {
                if (Number(this.newTableStart) < Number(this.newTableEnd)) {
                    for (let i = Number(this.newTableStart); i < Number(this.newTableEnd) + 1; i++) {
                        if (this.place.tables.indexOf(Number(i)) == -1) {
                            this.place.tables.push(Number(i))
                        }
                    }
                    this.$store.dispatch("lk/updateTables", { place: this.place })
                } else {
                    alert('Некорректные данные')
                }
            }
            this.newTableStart = ''
            this.newTableEnd = ''
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/default.scss';
@import '../../assets/buttons.scss';
</style>