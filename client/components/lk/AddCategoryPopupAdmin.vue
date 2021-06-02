<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление категориями
                p Изменения сохранятся автоматически {{user.name}}
                .cats
                    .cats__add
                        .cats__add-field
                            v-text-field(
                                ref="newCat"
                                v-model="newCat"
                                type="text"
                                label="Новая категория")
                            transition(name="slide-fade" mode="out-in")
                                .cats__item-controls-btn(@click="create" v-if="newCat.length")
                                    v-icon(light) mdi-checkbox-marked-circle-outline

                    draggable(
                        ref="asdas"
                        class="drags"
                        v-model="user.categories"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="drag = false"
                        handle=".handleit"
                        @change="change"
                        :forceFallback="true")
                        div(v-for="(cat, i) in user.categories" :key="cat._id" )
                            CategoryItemAdmin(:cat="cat" :user="user")

</template>

<script>
import draggable from 'vuedraggable'

export default {
    props: {
        user: Object
    },
    components: {
      draggable
    },
    data() {
        return {
            drag: false,
            newCat: '',
            updatedCats: []
        }
    },
    mounted() {
        this.updatedCats = [...this.user.categories]
        this.user.categories.length = 0
        this.user.categories = this.updatedCats
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = false
        },
        change(e) {
            this.$store.dispatch('admin/updateCatsAdmin', { user: this.user })
        },
        create() {
            this.$store.dispatch('admin/createCatAdmin', {_id: this.user._id, cat: this.newCat})
            this.newCat = ''
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "categories",
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
    &__add {
        &-field {
            display: flex;
            align-items: center;
        }
    }
}

.popup {
    position: absolute;
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
