<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Редактировать данные
                .dropzone-wrapper
                    dropzone(
                        ref="waiter_dropzone_edit"
                        id="#waiter_dropzone_edit" 
                        @vdropzone-file-added="afterComplete"
                        :options="dropOptions"
                        @vdropzone-drag-over="dragOver"
                        @vdropzone-drag-leave="dragLeave"
                        @vdropzone-removed-file="vremoved")
                        .dz-message__inner.mb-4
                            .st-dropzone
                                .st-dropzone__inner
                                    .st-dropzone__content
                                        transition(name="slide-fade" mode="out-in")
                                            .st-dropzone__image(
                                                key='waiter_edit_dropzone_image'
                                                v-if="uploadImage.src"
                                                :style="{ backgroundImage: `${newWaiter.photo.upload ? 'url(' + uploadImage.src + ')' : 'url(../../uploads/' + uploadImage.src + ')' }` }")
                                            .st-dropzone__image(
                                                v-if="!uploadImage.src"
                                                key='waiter_edit_dropzone_placeholder'
                                                v-bind:style="{ backgroundImage: 'url(../../icons8-folder-240.png)' }")
                                        h4.st-dropzone__title Фото официанта
                                        transition(name="slide-fade" mode="out-in")
                                            p.st-dropzone__note(v-if="!isDragOver" key='waiter_edit_dropzone_def') Перетащите сюда файл, или кликните для загрузки
                                            p.st-dropzone__note(v-if="isDragOver" key='waiter_edit_dropzone_catch') Можно отпускать


                    .st-dropzone__links(v-if="newWaiter.photo")
                        .st-dropzone__links-item.-red(@click="remove") Удалить

                v-form(
                    @submit.prevent="fetchAddWaiter"
                    v-model="isAddWaiterValid")
                    v-text-field(
                        label="Имя"
                        v-model="newWaiter.name"
                        :rules="requiredRule"
                        type="text"
                        required
                        hide-details="auto").mb-3  
                    v-text-field(
                        label="Id"
                        v-model="newWaiter.id"
                        :rules="requiredRule"
                        type="number"
                        required
                        hide-details="auto"
                        prefix="chachachay.me/").mb-3
                    h4 Заведения
                    .e-card__line-inner.wrap
                        .e-card__place(v-for="place in $store.state.auth.user.places")
                            v-checkbox(@change="togglePlace(place)" :input-value="!!newWaiter.places.find(p => p == place._id)" :label="place.name" hide-details="auto" :id="place._id").mt-1

                    .e-card__bottom
                        v-btn(@click="closePopup" depressed color="error").e-card__bottom-item Отмена
                        v-btn(
                            depressed 
                            color="primary"
                            :disabled="!isAddWaiterValid"
                            type="submit"
                        ).e-card__bottom-item Сохранить

                
</template>

<script>
import Dropzone from 'nuxt-dropzone'
const axios = require('axios').default

export default {
    components: {
      Dropzone
    },
    data () {
        return {
            newWaiter: {
                photo: '',
                name: '',
                id: '',
                places: []
            },

            uploadImage: {},
            deletePic: '',

            isDragOver: false,
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
            },

            requiredRule: [
                (v) => !!v || 'Обязательное поле',
            ],

            isAddWaiterValid: true
        }
    },
    mounted() {
        this.newWaiter = Object.assign({}, this.$store.state.view.popup.editWaiterPopup.data)
        this.uploadImage.src = this.newWaiter.photo
    },
    methods: {
        togglePlace(place) {
            const arr = this.newWaiter.places
            if (arr.indexOf(place._id) > -1) {
                arr.splice(arr.indexOf(place._id), 1)
            } else {
                arr.push(place._id)
            }
        },
        async fetchAddWaiter() {
            try {
                const uploadNewWaiter = async () => {
                    const add = await axios({
                        method: 'post',
                        url: '/api/edit-waiter',
                        data: this.newWaiter
                    })
console.log(add.data)
                    if (add.data) {
                        
                        this.$store.state.view.popup.editWaiterPopup.visible = false
                        this.$store.state.auth.user.waiters = add.data
                        this.$notify({ group: 'custom-style', type: 'n-success', title: 'Изменения сохранены' })

                        if (this.deletePic) {
                            this.$store.dispatch("lk/deletePic", this.deletePic)
                        }
                    }
                }

                if (this.newWaiter.photo.upload) {

                    const bodyFormData = new FormData();
                    bodyFormData.append("image", this.newWaiter.photo);
                
                    const uploadPhoto = await axios({
                        method: "post",
                        url: "/api/upload-company-logo",
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })

                    if (uploadPhoto.data) {
                        this.newWaiter.photo = uploadPhoto.data.path
                        uploadNewWaiter()
                    }
                } else {
                    uploadNewWaiter()
                }

            } catch (error) {
                console.error(error)
            }
        },
        closePopup() {
            this.$confirm({
                message: `Завершить редактирование официанта?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.editWaiterPopup.visible = false
                        this.$store.state.view.popup.editWaiterPopup.data = {}
                    }
                }
            })
        },
        afterComplete(file) {
            this.deletePic = this.newWaiter.photo
            this.isDragOver = false
            this.uploadImage = {
                src: URL.createObjectURL(file)
            }
            this.newWaiter.photo = file
        },
        dragOver() {
            this.isDragOver = true
        },
        dragLeave() {
            this.isDragOver = false
        },
        vremoved() {
            this.uploadImage = {}
        },
        remove() {
            if (!this.newWaiter.photo.upload) {
                this.deletePic = this.newWaiter.photo
            }
            this.uploadImage = {}
            this.newWaiter.photo = ''
        }
    }
}
</script>

<style lang="scss">

</style>