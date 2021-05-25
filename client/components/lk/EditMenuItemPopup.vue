<template lang="pug">
    .popup(v-if="updatedMenuItem")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Добавление товара
                .e-card
                    v-form(
                        @submit.prevent="fetchEditItem"
                        v-model="isAddItemValid")
                        dropzone(
                            ref="dropzone2"
                            id="#foo2" 
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

                        draggable(
                            class="previews"
                            v-model="updatedMenuItem.images"
                            v-bind="dragOptions"
                            @start="drag = true"
                            @end="drag = false")
                            transition-group(type="transition" :name="!drag ? 'flip-list' : null")
                                .preview(v-for="(element, i) in updatedMenuItem.images" :key="element.src ? element.src : element")
                                    .preview__img(v-bind:style="{ backgroundImage: `url( ${ element.src ? element.src : '../../uploads/' + element } )` }")
                                    .preview__bottom
                                        .preview__bottom-item(@click="removePic(element.file ? element.file : element, i)")
                                            v-icon(light) mdi-trash-can-outline
                                        .preview__bottom-item
                                            v-icon(light) mdi-drag-horizontal
                        .e-card__line
                            v-text-field(
                                ref="name"
                                :rules="nameRules"
                                v-model="updatedMenuItem.name"
                                label="Название"
                                type="text")

                        .e-card__line
                            v-text-field(
                                ref="translation"
                                v-model="updatedMenuItem.translation"
                                label="Перевод"
                                type="text")

                        .e-card__line
                            v-textarea(
                                v-model="updatedMenuItem.description"
                                auto-grow
                                label="Описание"
                                rows="2"
                                row-height="20"
                            )

                        .e-card__line
                            // .e-card__line-label Категория:
                            v-select(:items="$store.state.auth.user.categories" v-model="updatedMenuItem.category" :rules="nameRules" label="Категория" item-text="name" item-value="_id")

                        .e-card__add-link(@click="addCategoryPopup") Управление категориями
                                
                        .e-card__line(v-for="(i, key) in prices" v-bind:key="key")
                            .e-card__line-label.short Цена:
                            v-text-field(
                                ref="price"
                                :rules="nameRules"
                                v-model="updatedMenuItem.prices[i - 1]"
                                type="number"
                                :prefix="$store.state.auth.user.currencySymbol").mr-5
                            .e-card__line-label.short Вес:
                            v-text-field(
                                ref="price"
                                :rules="prices > 1 ? nameRules : [true]"
                                v-model="updatedMenuItem.weights[i - 1]"
                                type="number"
                                prefix="г.")
                            .e-card__remove(
                                @click="removePriceItem(i)"
                                v-if="i > 1")
                                v-icon(light) mdi-trash-can-outline
                        
                        .e-card__add-link(@click="addPrice" v-bind:class="{ disabled: !updatedMenuItem.weights[prices - 1] || !updatedMenuItem.prices[prices - 1] }") Добавить цену и вес

                        .e-card__section
                            h4(v-if="!$store.state.auth.user.dops.length") Дополнения к блюду
                            v-select(v-if="$store.state.auth.user.dops.length" :items="$store.state.auth.user.dops" v-model="updatedMenuItem.dops" :rules="nameRules" label="Дополнения к блюду" :item-text="dopSelectText" item-value="_id" multiple chips)
                            .e-card__add-link(@click="addDopPopup") Управление дополнениями

                        // .e-card__section
                            h4 Активировать в:
                            div(v-for="place in $store.state.auth.user.places")
                                label {{ place.name }}
                                input(type='checkbox' @change="togglePlace(place)" :id="place.id")

                        .e-card__bottom
                            v-btn(color="red" @click="closePopup").e-card__bottom-item Отмена
                            v-btn(
                                color="blue"
                                :disabled="!isAddItemValid"
                                type="submit"
                            ).e-card__bottom-item Сохранить
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import draggable from 'vuedraggable'
export default {
    props: {
        editableMenuItem: Object
    },
    components: {
      Dropzone,
      draggable
    },
    data() {
        return {
            updatedMenuItem: null,
            drag: false,
            isDragOver: false,
            isAddItemValid: false,
            newItemImageFile: null,
            newItemImageSrc: null,
            // uploadImages: [],
            prices: 1,
            newItem: {
                images: [],
                name: '',
                prices: [],
                weights: [],
                category: null,
                weight: null,
                places: [],
                dops: []
            },
            nameRules: [
                (v) => !!v || 'error_company_name',
            ],
            dropOptions: {
                url: "https://httpbin.org/post",
                autoProcessQueue: false,
                maxFilesize: 5,
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
    mounted() {
        this.updatedMenuItem = Object.assign({}, this.editableMenuItem)
        this.updatedMenuItem.images = [...this.editableMenuItem.images]
        this.updatedMenuItem.prices = [...this.editableMenuItem.prices]
        this.updatedMenuItem.weights = [...this.editableMenuItem.weights]
        this.prices = this.updatedMenuItem.prices.length
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description3",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
    methods: {
        dopSelectText: item => `${item.name} ${item.price} ${this.$store.state.auth.user.currencySymbol}`,
        removePic(file, index) {
            if (file.upload) {
                this.$refs.dropzone2.removeFile(file)
            }
            this.updatedMenuItem.images.splice(index, 1)
        },
        fetchEditItem() {
            this.$store.dispatch('lk/editMenuItem', {
                item: this.updatedMenuItem
            })
        },
        togglePlace(place) {
            const arr = this.updatedMenuItem.places
            if (arr.indexOf(place) > -1) {
                arr.splice(arr.indexOf(place), 1)
            } else {
                arr.push(place)
            }
        },
        closePopup() {
            this.$store.state.view.popup.editMenuItemPopup.visible = false
        },
        afterComplete(file) {
            this.isDragOver = false

            this.updatedMenuItem.images.unshift({
                file: file,
                src: URL.createObjectURL(file)
            })
        },
        dragOver() {
            this.isDragOver = true
        },
        dragLeave() {
            this.isDragOver = false
        },
        addPrice() {
            if (this.updatedMenuItem.weights[this.prices - 1] || this.updatedMenuItem.prices[this.prices - 1]) {
                this.prices += 1
            }
        },
        removePriceItem(i) {
            this.updatedMenuItem.prices.splice(i - 1, 1)
            this.updatedMenuItem.weights.splice(i - 1, 1)
            this.prices -= 1
        },
        addCategoryPopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = true
        },
        addDopPopup() {
            this.$store.state.view.popup.addDopPopup.visible = true
        },
        vremoved(file) {
            // const fl = this.uploadImages.find(e => e.file == file)
            // const index = this.uploadImages.indexOf(fl)
            // this.uploadImages.splice(index, 1)
        }
    }
}
</script>


<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}

.previews {
    span {
        display: flex;
        flex-wrap: wrap;
    }
}
.sortable-ghost {
    opacity: 0.5;
}
.preview {
    width: 23.5%;
    margin: 0 2% 2% 0;
    &:nth-child(4n) {
        margin-right: 0;
    }

    &__img {
        width: 100%;
        height: 84px;
        background-size: cover;
        background-position: center;
        border: 1px solid #00364d;
        border-radius: 10px;
    }
    &__bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        &-item {
            cursor: pointer;
        }
    }
}

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

.dz-preview {
    display: none;
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
        // margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
        &-label {
            width: 100px;
            margin-right: 20px;
            flex-shrink: 0;
            &.short {
                width: auto;
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
    &__add-link {
        text-align: center;
        margin: 0 0 10px 0;
        color: rgb(25, 118, 210);
        cursor: pointer;
        font-size: 14px;
        transition: color .3s;
        &.disabled {
            pointer-events: none;
            color: rgba(0, 0, 0, 0.4);
        }
    }
    &__section {
        margin: 10px 0;
    }
}
</style>
