<template lang="pug">
    .cats__item
        .cats__item-main
            transition(name="slide-fade" mode="out-in")
                .cats__item-main-name(v-if="!isEdit" key="5") {{ updatedDop.name }}
                input.cats__item-main-input(v-if="isEdit" key="6" type="text" v-model="updatedDop.name" v-focus)

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
            var confirmation = confirm(`Вы действительно хотите удалить дополнение "${this.dop.name}"`);
            if (confirmation) this.$store.dispatch('lk/removeDop', this.dop)
        },
        edit() {
            this.isEdit = true
        },
        save() {
            this.isEdit = false
            const index = this.$store.state.auth.user.dops.indexOf(this.dop)
            this.$store.state.auth.user.dops[index].name = this.updatedDop.name
            this.$store.dispatch('lk/editDop', this.updatedDop)
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

