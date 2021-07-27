<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление категориями
                .cats
                    .cats__add
                        transition(name="slide-fade" mode="out-in")
                            .cats__add-link(@click="addCategory = true" v-if="!addCategory") Новая категория
                            v-form(v-if="addCategory" @submit.prevent="create" v-model="isFormValid")
                                .cats__add-field
                                    v-text-field(
                                        ref="newCat"
                                        v-model="newCat"
                                        type="text"
                                        label="Новая категория"
                                        hide-details="auto"
                                        :rules="nameRules")
                                    transition(name="slide-fade" mode="out-in")
                                        button.cats__item-controls-btn(type="submit" v-if="newCat.length")
                                            v-icon(light) mdi-checkbox-marked-circle-outline

                    draggable(
                        ref="asdas"
                        class="drags"
                        v-model="$store.state.auth.user.categories"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="drag = false"
                        handle=".handleit"
                        @change="change"
                        :forceFallback="true")
                        //- transition-group(type="transition" name="flip-list")
                        div(v-for="(cat, i) in $store.state.auth.user.categories" :key="cat._id" )
                            CategoryItem(:cat="cat" :user="$store.state.auth.user")

</template>

<script>
import draggable from 'vuedraggable'

export default {
    components: {
      draggable
    },
    data() {
        return {
            drag: false,
            newCat: '',
            updatedCats: [],
            addCategory: false,
            nameRules: [
                (v) => !!v || 'Обязательное поле',
            ],
            isFormValid: true
        }
    },
    mounted() {
        this.updatedCats = [...this.$store.state.auth.user.categories]
        this.$store.state.auth.user.categories.length = 0
        this.$store.state.auth.user.categories = this.updatedCats
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = false
        },
        change(e) {
            this.$store.dispatch('lk/updateCats')
        },
        create() {
            if (this.newCat.length) {
                this.$store.dispatch('lk/createCat', this.newCat)
                this.addCategory = false
                this.newCat = ''
            }
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
        &-link {
            text-align: center;
            margin: 15px 0;
            cursor: pointer;
            color: $color-blue;
        }
        &-field {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
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
