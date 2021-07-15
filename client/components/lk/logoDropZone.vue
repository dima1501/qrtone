<template lang="pug">
    .dropzone-wrapper
        dropzone(
            ref="logo_dropzone"
            id="#logo_dropzone" 
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
                                .st-dropzone__image(v-if="$store.state.view.loading.uploadLogo" key='logo_dropzone_image_loading')
                                    v-icon(light) mdi-loading
                                .st-dropzone__image(
                                    key='logo_dropzone_image_uploaded'
                                    v-if="$store.state.auth.user.photo && !uploadImage.src && !$store.state.view.loading.uploadLogo"
                                    v-bind:style="{ backgroundImage: 'url(../../uploads/' + $store.state.auth.user.photo + ')' }")
                                .st-dropzone__image(
                                    key='logo_dropzone_image'
                                    v-if="uploadImage.src && !$store.state.view.loading.uploadLogo"
                                    v-bind:style="{ backgroundImage: 'url(' + uploadImage.src + ')' }")
                                .st-dropzone__image(
                                    v-if="!$store.state.auth.user.photo && !uploadImage.src && !$store.state.view.loading.uploadLogo"
                                    key='logo_dropzone_placeholder'
                                    v-bind:style="{ backgroundImage: 'url(../../icons8-folder-240.png)' }")
                            h4.st-dropzone__title Лого компании
                            transition(name="slide-fade" mode="out-in")
                                p.st-dropzone__note(v-if="!isDragOver" key='logo_dropzone_def') Перетащите сюда файл, или кликните для загрузки
                                p.st-dropzone__note(v-if="isDragOver" key='logo_dropzone_catch') Можно отпускать

        transition(name="slide-fade")
            .st-dropzone__links(v-if="uploadImage.src" key='logo_dropzone_logo')
                .st-dropzone__links-item.-red(@click="disable") Отмена
                .st-dropzone__links-item.-blue(@click="apply") Сохранить
            .st-dropzone__links(v-if="$store.state.auth.user.photo && !uploadImage.src" key='logo_dropzone_logo_delete')
                .st-dropzone__links-item.-red(@click="remove") Удалить
</template>

<script>
import Dropzone from 'nuxt-dropzone'

export default {
    props: {
        isOnboard: Boolean
    },
    components: {
      Dropzone
    },
    data() {
        return {
            uploadImage: {},
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
        remove() {
            let confirmation = confirm(`Вы действительно хотите удалить логотип?`)
            if (confirmation) {
                this.$store.dispatch("lk/deletePic", this.$store.state.auth.user.photo)
                this.$store.dispatch('lk/deleteCompanyLogo')
            }
        },
        apply() {
            this.$store.state.view.loading.uploadLogo = true
             if (this.$store.state.auth.user.photo) this.$store.dispatch("lk/deletePic", this.$store.state.auth.user.photo)
            this.$store.dispatch('lk/updateCompanyLogo', this.uploadImage.file)
            this.uploadImage = {}
        },
        disable() {
            this.uploadImage = {}
        },
        afterComplete(file) {
            this.isDragOver = false
            this.uploadImage = {
                file: file,
                src: URL.createObjectURL(file)
            }

            if (this.isOnboard) {
                this.apply()
            }
        },
        dragOver() {
            this.isDragOver = true
        },
        dragLeave() {
            this.isDragOver = false
        },
        vremoved() {
            this.uploadImage = {}
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/dropzone.scss';
</style>