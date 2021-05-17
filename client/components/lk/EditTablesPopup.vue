<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление столиками
                p {{ place.name }}
                .place__tables
                    .place__tables-inner(v-if="place.tables && place.tables.length")
                        .place__tables-item(v-for="(table, key) in place.tables" :key="key")
                            .place__tables-item-name {{ formatTable(table) }}
                            v-icon(light @click="removeTable(table, key)") mdi-close-circle-outline

                    div
                        div
                            input(type="checkbox" id="tablesRange" v-model="isTablesMulti" @change="clearNewTables")
                            label(for="tablesRange") Диапазон столиков

                        label(v-if="!isTablesMulti") Введите название или номер столика
                        label(v-if="isTablesMulti") Введите диапазон столиков, например 1 и 10

                        input(:type="!isTablesMulti ? 'text' : 'number'" placeholder="" v-model="newTableStart")
                        span(v-if="isTablesMulti") -
                        input(type="number" placeholder="" v-if="isTablesMulti" v-model="newTableEnd")
                        .button.-black(@click="fetchCreateTable") Добавить


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
            newTableEnd: null
        }
    },
    methods: {
        formatTable(table) {
            if (typeof table == 'number') {
                return table
            } else {
                return table.replace('%20', ' ')
            }
        },
        closePopup() {
            this.$store.state.view.popup.editTablesPopup.visible = false
        },
        removeTable(table, key) {
            this.place.tables.splice(key, 1)
            this.$store.dispatch("lk/updateTables", this.place)
        },
        clearNewTables() {
            this.newTableStart = this.newTableEnd = null
        },
        fetchCreateTable() {
            if (!this.isTablesMulti) {
                if (this.place.tables.indexOf(this.newTableStart) == -1) {
                    this.place.tables.push(this.newTableStart.replace(' ', '%20'))
                    this.$store.dispatch("lk/updateTables", this.place)
                }
            } else {
                if (Number(this.newTableStart) < Number(this.newTableEnd)) {
                    for (let i = Number(this.newTableStart); i < Number(this.newTableEnd) + 1; i++) {
                        if (this.place.tables.indexOf(Number(i)) == -1) {
                            this.place.tables.push(Number(i))
                        }
                    }
                    this.$store.dispatch("lk/updateTables", this.place)
                } else {
                    alert('Некорректные данные')
                }
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/default.scss';
@import '../../assets/buttons.scss';
</style>