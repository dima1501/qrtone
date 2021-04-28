<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Добавление товара
                .e-card
                    v-form(
                        @submit.prevent="fetchAddItem"
                        v-model="isAddItemValid")
                        .e-card__img
                            .e-card__img-pic(v-if="newItemImageSrc" v-bind:style="{ backgroundImage: 'url(' + newItemImageSrc + ')' }")
                            v-file-input(
                                accept="image/*"
                                placeholder=""
                                prepend-icon="mdi-camera"
                                label="Загрузить изображение"
                                @change="addImage")
                        .e-card__line
                            .e-card__line-label Название:
                            v-text-field(
                                ref="name"
                                :rules="nameRules"
                                v-model="newItem.name"
                                type="text")
                        .e-card__line
                            .e-card__line-label Цена:
                            input(type="text").e-card__line-input
                        .e-card__line
                            .e-card__line-label Категория:
                            v-text-field(
                                ref="cat"
                                :rules="nameRules"
                                v-model="newItem.category"
                                type="text")
                        .e-card__line
                            .e-card__line-label Вес:
                            input(type="text").e-card__line-input
                        div(v-for="place in $store.state.auth.user.places")
                            label {{ place.name }}
                            input(type='checkbox' @change="togglePlace(place)" :id="place.id")
                        .e-card__bottom
                            // v-btn(color="red" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                color="blue" 
                                :disabled="!isAddItemValid"
                                type="submit"
                            ).e-card__bottom-item Создать
</template>

<script>
export default {
    data() {
        return {
            isAddItemValid: false,
            newItemImageFile: null,
            newItemImageSrc: null,
            newItem: {
                image: null,
                name: '',
                price: null,
                category: null,
                weight: null,
                places: []
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
        }
    },
    methods: {
        addImage(e) {
            if (e) {
                this.newItemImageSrc = URL.createObjectURL(e)
                this.newItemLogoFile = e
            } else {
                this.newItemImageSrc = null
                this.newItemLogoFile = null
            }
        },
        fetchAddItem() {
            this.$store.dispatch('lk/addNewMenuItem', {
                image: this.newItemLogoFile,
                item: this.newItem
            })
        },
        togglePlace(place) {
            const arr = this.newItem.places
            if (arr.indexOf(place) > -1) {
                arr.splice(arr.indexOf(place), 1)
            } else {
                arr.push(place)
            }
        },
        closePopup() {
            this.$store.state.view.popup.addMenuItemPopup.visible = false
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

.e-card {
    &__img {
        margin-bottom: 20px;
        background: #F5F7FB;
        border-radius: 16px;
        padding: 15px;
        display: flex;
        align-items: center;
        &-pic {
            width: 100px;
            height: 100px;
            background-position: center;
            background-size: cover;
        }
    }
    &__line {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        &-label {
            width: 100px;
            margin-right: 20px;
            flex-shrink: 0;
        }
        &-input {
            flex-grow: 1;
            padding: 5px 10px;
            background: #F5F7FB;
            border-radius: 10px;
        }
    }
    &__bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        &-item {
            margin: 0 10px;
            cursor: pointer;
        }
    }
}
</style>
