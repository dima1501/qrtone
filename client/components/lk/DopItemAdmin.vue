<template lang="pug">
    .cats__item
        .cats__item-main
            transition(name="slide-fade" mode="out-in")
                .cats__item-main-name(v-if="!isEdit" key="5") {{ updatedDop.name }}{{ updatedDop.price ? `, ${updatedDop.price}${$store.state.admin.user.currencySymbol}` : `` }}
                .cats__add-field(v-if="isEdit" key="6")
                    v-text-field(
                        v-model="updatedDop.name"
                        type="text"
                        label="Название"
                        v-focus
                        hide-details="auto").mr-5
                    v-text-field(
                        v-model="updatedDop.price"
                        type="text"
                        label="Цена"
                        hide-details="auto")

        transition(name="slide-fade" mode="out-in")
            .cats__item-controls(v-if="!isEdit" key="3")
                .cats__item-controls-btn(@click="edit")
                    v-icon(light) mdi-pencil-outline
                .cats__item-controls-btn(@click="remove")
                    v-icon(light) mdi-trash-can-outline

            .cats__item-controls(v-if="isEdit" key="4")
                transition(name="slide-fade" mode="out-in")
                    .cats__item-controls-btn(@click="save" v-if="updatedDop.name.length")
                        v-icon(light) mdi-checkbox-marked-circle-outline
                .cats__item-controls-btn(@click="discard")
                    v-icon(light) mdi-close-circle-outline
</template>

<script>
export default {
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    props: {
        dop: Object
    },
    data() {
        return {
            isEdit: false,
            updatedDop: {}
        }
    },
    mounted() {
        this.updatedDop = Object.assign({}, this.dop)
    },
    methods: {
        remove() {
            this.$confirm({
                message: `Вы действительно хотите удалить дополнение "${this.dop.name}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch('admin/removeDopAdmin', { dop: this.dop, _id: this.$store.state.admin.user._id })
                    }
                }
            })
        },
        edit() {
            this.isEdit = true
        },
        save() {
            this.isEdit = false
            this.dop.name = this.updatedDop.name
            this.dop.price = this.updatedDop.price
            this.$store.dispatch('admin/editDopAdmin', { dop: this.updatedDop, _id: this.$store.state.admin.user._id })
        },
        discard() {
            this.isEdit = false
            this.updatedDop.name = this.dop.name
        }
    }
}
</script>

<style lang="scss">
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .12s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.cats {
    &__item {
        &.ghost {
            background: #e8eaee;
        }
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        margin-bottom: 10px;
        background-color: #F5F7FB;
        border-radius: 14px;
        &-controls {
            display: flex;
            align-items: center;
            &-btn {
                cursor: pointer;
                margin-left: 10px;
            }
        }
    }
}
</style>

