<template lang="pug">
    .popup.-wide
        .popup__overlay(@click="closePopup")
        .popup__container
            transition(name="fade-pdf")
                .pdf__loader(v-if="$store.state.view.loading.pdfUpdating" key="pdf_loader")
                    v-icon(light) mdi-loading
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Выберите шаблон
                .pdf
                    .pdf__list
                        .pdf__list-preview(
                            v-for="(preview, key) in pdfs"
                            :key="key"
                            @click="setTemplate(preview)"
                            :class="{ 'active': $store.state.view.pdf.ref == preview.ref, '-empty': !preview.ref }")

                            .pdf__list-preview-pic(v-if="preview.pic")
                                img.pdf__list-preview-pic-img(:src="preview.pic")

                            .pdf__list-preview-empty(v-else)
                                .pdf__list-preview-empty-icon
                                    v-icon(light) mdi-cancel
                                .pdf__list-preview-empty-text Без шаблона

                            .pdf__list-preview-name {{preview.name}}
                    
</template>

<script>
import pdfs from 'assets/pdf/pdf.js'

export default {
    data() {
        return {
            pdfs: null
        }
    },
    mounted() {
        this.pdfs = pdfs
    },
    methods: {
        setTemplate(template) {
            this.$store.state.view.pdf.ref = template.ref
            this.$store.state.view.pdf.data = template
        },
        closePopup() {
            this.$store.state.view.popup.PDFPopup.visible = false
        }
    }
}
</script>

<style lang="scss">

.fade-pdf-enter-active, .fade-pdf-leave-active {
  transition: all .25s ease;
}

.fade-pdf-enter, 
.fade-pdf-leave-to {
  opacity: 0;
}


@keyframes load {
 0% { transform: rotate(0deg) }
 100% { transform: rotate(360deg) }
}

.popup {
    &__container {
        position: relative;
        overflow: hidden;
    }
    &.-wide {
        .popup__container {
            max-width: 1000px;
        }
    }
}
.pdf {
    position: relative;
    &__loader {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(255,255,255,0.6);
        .v-icon {
            font-size: 30px;
            animation: load 0.7s ease-in-out infinite;
        }
    }
    &__list {
        display: flex;
        flex-wrap: wrap;
        &-preview {
            width: 30%;
            margin-right: 3%;
            margin-bottom: 20px;
            border: 3px solid transparent;
            cursor: pointer;
            box-shadow: 0 0 20px rgb(0 0 0 / 20%);
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            &.active {
                border: 3px solid #a9b0be;
                box-shadow: 0 0 20px rgb(0 0 0 / 30%);
            }
            &-pic {
               &-img {
                   width: 100%;
                   height: auto;
                   display: block;
                   box-shadow: 0 0 20px rgb(0 0 0 / 30%);
               }
            }
            &-name {
                text-align: center;
                font-weight: bold;
                padding: 5px 10px;
                margin-top: auto;
            }
            &-empty {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                &-icon {
                    margin-bottom: 10px;
                    opacity: 0.5;
                    .v-icon {
                        font-size: 68px;
                    }
                }
                &-text {
                    font-weight: bold;
                    font-size: 14px;
                    text-transform: uppercase;
                }
            }
        }
    }
}

</style>