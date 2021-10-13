<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Создание позиции
                .e-card
                    v-form(
                        @submit.prevent="fetchAddItem"
                        v-model="isAddItemValid")
                        dropzone(
                            ref="dropzone"
                            id="#foo" 
                            @vdropzone-file-added="afterComplete" 
                            :options="dropOptions"
                            @vdropzone-drag-over="dragOver"
                            @vdropzone-drag-leave="dragLeave"
                            @vdropzone-removed-file="vremoved")
                            .dz-message__inner
                                .st-dropzone
                                    .st-dropzone__inner
                                        .st-dropzone__content
                                            transition(name="slide-fade" mode="out-in")
                                                .st-dropzone__image(
                                                    key='logo_dropzone_placeholder'
                                                    v-bind:style="{ backgroundImage: 'url(../../icons8-folder-240.png)' }")
                                            h4.st-dropzone__title Фото 
                                            transition(name="slide-fade" mode="out-in")
                                                p.st-dropzone__note(v-if="!isDragOver" key='logo_dropzone_def') Перетащите файлы сюда <br> или кликните, чтобы загрузить фото
                                                p.st-dropzone__note(v-if="isDragOver" key='logo_dropzone_catch') Можно отпускать

                        draggable(
                            class="previews"
                            v-model="uploadImages"
                            v-bind="dragOptions"
                            @start="drag = true"
                            @end="drag = false")
                            transition-group(type="transition" :name="!drag ? 'flip-list' : null")
                                .preview(v-for="(element, i) in uploadImages" :key="element.file.upload.uuid")
                                    .preview__img(:style="{ backgroundImage: 'url(' + element.src + ')' }")
                                    .preview__bottom
                                        .preview__bottom-item(@click="removePic(element.file)")
                                            v-icon(light).trash mdi-trash-can-outline
                                        .preview__bottom-item
                                            v-icon(light) mdi-drag-vertical
                        .e-card__line
                            v-text-field(
                                :rules="nameRules"
                                v-model="newItem.name"
                                label="Название *"
                                type="text"
                                hide-details="auto")
                        
                        .e-card__line
                            v-text-field(
                                v-model="newItem.translation"
                                label="Перевод"
                                type="text"
                                hide-details="auto")

                        .e-card__line
                            v-select(:items="$store.state.auth.user.categories" v-model="newItem.category" :rules="nameRules" label="Категория *" item-text="name" item-value="_id" hide-details="auto")
                            .e-card__add-link(@click="addCategoryPopup") Управление категориями

                        .e-card__line
                            v-textarea(
                                v-model="newItem.description"
                                auto-grow
                                label="Описание"
                                rows="1"
                                row-height="20"
                                hide-details="auto")

                        .e-card__line
                            v-checkbox(v-model="newItem.isVegan" :label="`Вегетарианское блюдо`" hide-details="auto")

                        .e-card__line.highlight(v-for="(i, key) in prices" :key="key")

                            v-textarea(
                                v-if="i > 1"
                                :rules="!newItem.weights[i - 1] ? modDescrRules : [true]"
                                v-model="newItem.modifications[i - 1]"
                                auto-grow
                                label="Описание"
                                rows="1"
                                row-height="20"
                                hide-details="auto")

                            .e-card__line-inner
                                v-text-field(
                                    :rules="nameRules"
                                    v-model="newItem.prices[i - 1]"
                                    label="Цена*"
                                    type="number"
                                    hide-details="auto").mr-5
                                v-text-field(
                                    :rules="i > 1 && !newItem.modifications[i - 1] ? modDescrRules : [true]"
                                    v-model="newItem.weights[i - 1]"
                                    label="Вес (г)"
                                    type="number"
                                    hide-details="auto")

                            // Калории
                            .e-card__line-inner
                                v-text-field(
                                    v-model="newItem.calories[i - 1]"
                                    type="number"
                                    label="Ккал"
                                    hide-details="auto").mr-5
                                v-text-field(
                                    v-model="newItem.proteins[i - 1]"
                                    type="number"
                                    label="Белки"
                                    hide-details="auto")
                            .e-card__line-inner
                                v-text-field(
                                    v-model="newItem.fats[i - 1]"
                                    type="number"
                                    label="Жиры"
                                    hide-details="auto").mr-5
                                v-text-field(
                                    v-model="newItem.carbo[i - 1]"
                                    type="number"
                                    label="Углеводы"
                                    hide-details="auto")

                            .e-card__remove(
                                @click="removePriceItem(i)"
                                v-if="i > 1") Удалить
                            
                        .e-card__add-link(@click="addPrice" v-bind:class="{ disabled: !newItem.prices[prices - 1] || !newItem.weights[prices - 1] && !newItem.modifications[prices - 1] && prices != 1 }") Добавить модификацию

                        .e-card__section
                            h4(v-if="!$store.state.auth.user.dops.length") Дополнения к блюду
                            v-select(v-if="$store.state.auth.user.dops.length" hide-details="auto" :items="$store.state.auth.user.dops" v-model="newItem.dops" :rules="nameRules" label="Дополнения к блюду" :item-text="dopSelectText" item-value="_id" multiple chips)
                            .e-card__add-link(@click="addDopPopup") Управление дополнениями

                        .e-card__section
                            h4 Активировать в:
                            .e-card__line-inner.wrap
                                div(v-for="place in $store.state.auth.user.places").e-card__place
                                    v-checkbox(@change="togglePlace(place)" :label="place.name" hide-details="auto" :id="place.id").mt-1

                        .e-card__bottom
                            v-btn(@click="closePopup" depressed large).red--text.e-card__bottom-item Отмена
                            v-btn(
                                color="primary" 
                                :disabled="!isAddItemValid"
                                type="submit"
                                depressed
                                large
                                :loading="$store.state.view.loading.addNewMenuItem"
                            ).e-card__bottom-item.white--text Создать
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
            drag: false,
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
                modifications: [],
                category: null,
                weight: null,
                places: [],
                dops: [],
                description: '',
                translation: '',
                calories: [],
                fats: [],
                proteins: [],
                carbo: [],
                isVegan: false
            },
            nameRules: [
                (v) => !!v || 'Обязатльное поле',
            ],
            modDescrRules: [
                (v) => !!v || 'Заполните вес или описание',
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
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
    methods: {
        dopSelectText(item) {
            return `${item.name}, ${item.price ? item.price : 'Бесплатно'}${item.price ? this.$store.state.auth.user.currencySymbol : ''}`
        },
        removePic(file) {
            this.$refs.dropzone.removeFile(file)
        },
        fetchAddItem() {
            this.$store.state.view.loading.addNewMenuItem = true
            this.$store.dispatch('lk/addNewMenuItem', {
                images: this.uploadImages,
                item: this.newItem
            })
        },
        togglePlace(place) {
            const arr = this.newItem.places
            if (arr.indexOf(place._id) > -1) {
                arr.splice(arr.indexOf(place._id), 1)
            } else {
                arr.push(place._id)
            }
        },
        closePopup() {
            this.$confirm({
                message: `Завершить создание позиции меню?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.addMenuItemPopup.visible = false
                    }
                }
            })
        },
        afterComplete(file) {
            this.isDragOver = false
            this.uploadImages.push({
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
        vremoved(file) {
            const fl = this.uploadImages.find(e => e.file == file)
            const index = this.uploadImages.indexOf(fl)
            this.uploadImages.splice(index, 1)
        } ,
        addPrice() {
            if (this.newItem.weights[this.prices - 1] || this.newItem.prices[this.prices - 1]) {
                this.prices += 1
            }
        },
        removePriceItem(i) {
            this.newItem.prices.splice(i - 1, 1)
            this.newItem.weights.splice(i - 1, 1) 

            this.newItem.calories.splice(i - 1, 1) 
            this.newItem.fats.splice(i - 1, 1) 
            this.newItem.proteins.splice(i - 1, 1) 
            this.newItem.carbo.splice(i - 1, 1) 

            this.newItem.modifications.splice(i - 1, 1)
            this.prices -= 1
        },
        addCategoryPopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = true
        },
        addDopPopup() {
            this.$store.state.view.popup.addDopPopup.visible = true
        }
    }
}
</script>


<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}

.sortable-ghost {
    opacity: 0.5;
}

@import '../../assets/preview.scss';
@import '../../assets/e-card.scss';

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
//   transform: translateY(10px);
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
        border: 1px dashed #003b55;
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

// .popup {
//     position: fixed;
//     left: 0;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     padding: 30px;
//     z-index: 20;
//     background-color: rgba(0,0,0,0.6);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     overflow-y: scroll;

//     &__closer {
//         position: absolute;
//         right: 20px;
//         top: 25px;
//         cursor: pointer;

//         .v-icon {
//             color: #000;
//             transition: transform .3s;
//             &:hover {
//                 transform: rotate(140deg);
//             }
//         }
//     }

//     &__container {
//         position: relative;
//         margin-top: auto;
//         margin-bottom: auto;
//         background-color: #fff;
//         border-radius: 20px;
//         padding: 15px;
//         width: 100%;
//         max-width: 400px;
//     }

//     &__title {
//         margin-bottom: 15px;
//     }
// }


</style>
