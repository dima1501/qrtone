<template lang="pug">
    .cats__item
        .cats__item-main
            transition(name="slide-fade" mode="out-in")
                .cats__item-main-name(v-if="!isEdit" key="5") {{ updatedCat.name }}
                input.cats__item-main-input(v-if="isEdit" key="6" type="text" v-model="updatedCat.name" v-focus)

        transition(name="slide-fade" mode="out-in")
            .cats__item-controls(v-if="!isEdit" key="3")
                .cats__item-controls-btn(@click="remove" v-if="!user.goods.find(e => e.category == cat._id)")
                    v-icon(light) mdi-trash-can-outline
                .cats__item-controls-btn(@click="edit")
                    v-icon(light) mdi-pencil-outline
                .cats__item-controls-btn.handleit
                    v-icon(light) mdi-drag

            .cats__item-controls(v-if="isEdit" key="4")
                transition(name="slide-fade" mode="out-in")
                    .cats__item-controls-btn(@click="save" v-if="updatedCat.name.length")
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
        cat: Object,
        user: Object
    },
    data() {
        return {
            isEdit: false,
            updatedCat: {}
        }
    },
    mounted() {
        this.updatedCat = Object.assign({}, this.cat)
    },
    methods: {
        remove() {
            var confirmation = confirm(`Вы действительно хотите удалить категорию "${this.cat.name}"`);
            if (confirmation) this.$store.dispatch('lk/removeCat', this.cat)
        },
        edit() {
            this.isEdit = true
        },
        save() {
            this.isEdit = false
            const index = this.user.categories.indexOf(this.cat)
            this.user.categories[index].name = this.updatedCat.name
            this.$store.dispatch('lk/editCat', this.updatedCat)
        },
        discard() {
            this.isEdit = false
            this.updatedCat.name = this.cat.name
        }
    }
}
</script>

<style lang="scss">

.sortable-chosen {
    &.ghost {
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border-radius: 14px;
    }
}

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

