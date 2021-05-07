<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление категориями
                p Изменения сохранятся автоматически
                .cats
                    draggable(
                        class="drag"
                        v-model="$store.state.auth.user.categories"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="drag = false"
                        handle=".handle"
                        @change="change")
                        transition-group(type="transition" :name="!drag ? 'flip-list' : null")
                            .cats__item(v-for="(cat, key) in $store.state.auth.user.categories" v-bind:key="cat")
                                .cats__item-name {{ cat }}
                                .cats__item-controls
                                    .cats__item-controls-btn
                                        v-icon(light) mdi-trash-can-outline
                                    .cats__item-controls-btn.handle
                                        v-icon(light) mdi-drag
</template>

<script>
import draggable from 'vuedraggable'

export default {
    components: {
      draggable
    },
    data() {
        return {
            drag: false
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = false
        },
        fetchEditPlace() {
            // this.$store.dispatch('lk/editPlace', this.editablePlace)
        },
        change() {
            this.$store.dispatch('lk/updateCats')
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description2",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
}
</script>


<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
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
        right: 20px;
        top: 25px;
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
        padding: 20px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 15px;
    }
}
</style>
