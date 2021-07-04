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
            .dz-message__inner
                .st-dropzone
                    .st-dropzone__inner
                        .st-dropzone__image(v-if="$store.state.view.loading.uploadLogo")
                            v-icon(light) mdi-loading 
                        .st-dropzone__image(
                            v-if="$store.state.auth.user.photo && !uploadImage.src && !$store.state.view.loading.uploadLogo"
                            v-bind:style="{ backgroundImage: 'url(../../uploads/' + $store.state.auth.user.photo + ')' }")

                        .st-dropzone__image(
                            v-if="uploadImage.src && !$store.state.view.loading.uploadLogo"
                            v-bind:style="{ backgroundImage: 'url(' + uploadImage.src + ')' }")

                        .st-dropzone__content
                            h4.st-dropzone__title Лого<br> компании
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

<style lang="scss" scoped>

.dropzone-wrapper {
    position: relative;
}

.dz-message__inner {
    padding: 0;
    height: auto;
    margin-bottom: 15px;
}

@keyframes load {
 0% { transform: rotate(0deg) }
 100% { transform: rotate(360deg) }
}

.st-dropzone {
    width: 280px;
    text-align: left;
    height: 126px;
    position: relative;
    &__title {
        margin-bottom: 5px;
        color: $color-black;
        line-height: 1.3;
    }
    &__note {
        font-size: 14px;
        opacity: 0.8;
        color: $color-black;
        line-height: 1.3;
        margin-bottom: 5px;
    }
    &__inner {
        padding: 10px;
        display: flex;
    }
    &__image {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        background-position: center;
        background-size: cover;
        overflow: hidden;
        border-radius: 10px;
        margin-right: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        .v-icon {
            animation: load 2s ease-in-out infinite;
        }
    }
    &__links {
        position: absolute;
        bottom: -4px;
        // transform: translateX(-50%);
        width: 100%;
        text-align: center;
        z-index: 14;
        cursor: pointer;
        display: flex;
        justify-content: center;
        &-item {
            margin-right: 10px;
            font-size: 14px;
            &.-red {
                color: $color-red;
            }
            &.-blue {
                color: $color-blue;
            }
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
</style>