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
                        div {{list}}
                        draggable(
                            v-model="list"
                            items=".dz-preview"
                            ghost-class="ghost"
                            :sort="false"
                            @change="log")
                            dropzone(
                                id="#foo" 
                                @vdropzone-file-added="afterComplete" 
                                :options="dropOptions"
                                @vdropzone-drag-over="dragOver"
                                @vdropzone-drag-leave="dragLeave"
                                @vdropzone-removed-file="vremoved")
                                .dz-message__inner
                                    v-icon(light) mdi-camera
                                    transition(name="slide-fade" mode="out-in")
                                        .dz-message__title(v-if="!isDragOver" key='1') Перетащите файлы сюда <br> или кликните, чтобы загрузить фото
                                        .dz-message__title(v-if="isDragOver" key='2') Можно отпускать

                        .e-card__line
                            .e-card__line-label Название:
                            v-text-field(
                                ref="name"
                                :rules="nameRules"
                                v-model="newItem.name"
                                type="text")

                        .e-card__line
                            .e-card__line-label Категория:
                            v-select(:items="$store.state.auth.user.categories" v-model="newItem.category")
                        v-btn(
                            color="blue"
                            @click="addCategory"
                        ) Новая категория
                                
                        .e-card__line(v-for="(i, key) in prices" v-bind:key="key")
                            .e-card__line-label.short Цена:
                            v-text-field(
                                ref="price"
                                :rules="nameRules"
                                v-model="newItem.prices[i - 1]"
                                type="number")
                            .e-card__line-label.short Вес:
                            v-text-field(
                                ref="price"
                                :rules="prices > 1 ? nameRules : [true]"
                                v-model="newItem.weights[i - 1]"
                                type="number")
                            .e-card__remove(
                                @click="removePriceItem(i)"
                                v-if="i > 1")
                                v-icon(light) mdi-trash-can-outline
                        
                        v-btn(
                            color="blue"
                            :disabled="!newItem.weights[prices - 1] || !newItem.prices[prices - 1]"
                            @click="addPrice"
                        ) Добавить цену и вес

                        div(v-for="place in $store.state.auth.user.places")
                            label {{ place.name }}
                            input(type='checkbox' @change="togglePlace(place)" :id="place.id")
                        .e-card__bottom
                            v-btn(color="red" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                color="blue" 
                                :disabled="!isAddItemValid"
                                type="submit"
                            ).e-card__bottom-item Создать
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import draggable from 'vuedraggable'
export default {
    components: {
      Dropzone,
      draggable
    },
    data() {
        return {
            list: [],
            isDragOver: false,
            isAddItemValid: false,
            newItemImageFile: null,
            newItemImageSrc: null,
            uploadImages: [],
            prices: 1,
            newItem: {
                images: [],
                name: '',
                prices: [],
                weights: [],
                category: null,
                weight: null,
                places: []
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            dropOptions: {
                url: "https://httpbin.org/post",
                autoProcessQueue: false,
                maxFilesize: 5,
                // maxFiles: 4,
                chunking: true,
                chunkSize: 500,
                thumbnailWidth: 83,
                thumbnailHeight: 83,
                addRemoveLinks: true,
                acceptedFiles: 'image/*',
                dictRemoveFile: '',
                dictRemoveFileConfirmation: null
            }
        }
    },
    methods: {
        log() {

        },
        fetchAddItem() {
            this.$store.dispatch('lk/addNewMenuItem', {
                images: this.uploadImages,
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
        },
        afterComplete(file) {
            this.isDragOver = false
            this.uploadImages.push(file)
        },
        dragOver() {
            this.isDragOver = true
        },
        dragLeave() {
            this.isDragOver = false
        },
        vremoved(file) {
            const index = this.uploadImages.indexOf(file)
            this.uploadImages.splice(index, 1)
        } ,
        addPrice() {
            this.prices += 1
        },
        removePriceItem(i) {
            this.newItem.prices.splice(i - 1, 1)
            this.newItem.weights.splice(i - 1, 1)
            this.prices -= 1
        },
        addCategory() {

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

.fade-enter-active, .fade-leave-active {
  transition: all .12s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.vue-dropzone {
    display: flex;
    flex-wrap: wrap;
}

.dz-image {
    img {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 10px;
    }
}

.dz-preview {
    position: relative;
    width: 23.5%;
    margin: 0 2% 2% 0;
    border: 1px solid #00364d;
    border-radius: 10px;
    &:nth-child(4n + 1) {
        margin-right: 0;
    }
    &:hover {
        .dz-remove {
            opacity: 1;
            visibility: visible;
        }
    }
}

.dz-remove {
    position: absolute;
    left: 50%;
    top: 50%;
    opacity: 0;
    visibility: hidden;
    transition: opacity .3s, visibility .3s;
    transform: translate(-50%, -50%);
    text-decoration: none;
    &:after {
        content: '-';
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        background-color: #fff;
        color: red;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(0,0,0,0.4);
        font-size: 18px;
        font-weight: bold;
    }
}

.dz-message {
    cursor: pointer;
    width: 100%;
    margin-bottom: 2%;
    &:hover {
        .dz-message__inner {
            background-color: #F5F7FB;
        }
    }
    &__inner {
        height: 130px;
        border-radius: 14px;
        border: 1px dashed #00293B;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        pointer-events: none;

        
    }
    &__title {
        min-height: 48px;
        display: flex;
        align-items: center;
    }
}

.dz-details,
.dz-progress,
.dz-error-message,
.dz-success-mark,
.dz-error-mark {
    display: none;
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
            &.short {
                width: 60px;
            }
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
