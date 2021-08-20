<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление столиками<br>
                    span {{ place.name }}
                transition(name="slide-fade" mode="out-in")
                    .cats__add-link(@click="isAddTable = true" v-if="!isAddTable") Новый столик
                    v-form(
                        v-if="isAddTable"
                        @submit.prevent="fetchCreateTable"
                        v-model="isAddTableValid").place__form
                        v-text-field(
                            required
                            autofocus
                            v-model="newTableStart"
                            type="text"
                            label="Новый столик"
                            hide-details="auto"
                            :rules="[!!newTableStart && !!newTableStart.length && !newTableStart.includes('?') && !newTableStart.includes('#') && !newTableStart.includes('&') || 'Введите корректное значение']")
                transition(name="slide-fade" mode="out-in")
                    .place__tables-actions(v-if="isAddTable")
                        v-btn(
                            depressed
                            large
                            @click="isAddTable = false"
                        ).e-card__bottom-item.red--text Отмена
                        v-btn(
                            depressed
                            color="primary"
                            :disabled="!isAddTableValid || !newTableStart"
                            large
                            @click="fetchCreateTable"
                            :loading="$store.state.view.loading.createTable"
                        ).e-card__bottom-item Добавить
                        
                .place__tables(:class="{ padding: isAddTable }")
                    .place__tables-inner(v-if="place.tables && place.tables.length")
                        .place__tables-item(v-for="(table, key) in place.tables" :key="key")
                            .place__tables-item-name {{ formatTable(table) }}
                            .place__tables-item-remove(light @click="removeTable(table, key)")
                                v-icon(light) mdi-trash-can-outline
                    




</template>

<script>
const axios = require("axios")

export default {
    props: {
        place: Object
    },
    data() {
        return {
            isTablesMulti: false,
            newTableStart: null,
            newTableEnd: null,
            isAddTableValid: true,
            isAddTable: false
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
        async fetchCreateTable() {
            if (!this.isTablesMulti && !!this.newTableStart) {
                this.$store.state.view.loading.createTable = true
                if (this.place.tables.indexOf(this.newTableStart.trim().replaceAll(' ', '%20')) == -1) {
                    this.place.tables.push(this.newTableStart.trim().replaceAll(' ', '%20'))
                    const update = await axios({
                        method: 'post',
                        url: `/api/update-tables/`,
                        data: this.place
                    })
                    if (update.data) {
                        this.$store.state.view.loading.createTable = false
                        this.$nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Столик успешно создан` })
                    }
                } else {
                    this.$notify({ group: 'custom-style', type: 'n-alarm', title: 'Столик с таким названием уже существует' })
                    this.$store.state.view.loading.createTable = false
                }
            } 
            // else {
            //     if (Number(this.newTableStart) < Number(this.newTableEnd)) {
            //         for (let i = Number(this.newTableStart); i < Number(this.newTableEnd) + 1; i++) {
            //             if (this.place.tables.indexOf(Number(i)) == -1) {
            //                 this.place.tables.push(Number(i))
            //             }
            //         }
            //         this.$store.dispatch("lk/updateTables", { place: this.place })
            //     } else {
            //         alert('Некорректные данные')
            //     }
            // }
            this.newTableStart = ''
            this.newTableEnd = ''
            this.isAddTable = false
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/default.scss';
@import '../../assets/buttons.scss';
</style>