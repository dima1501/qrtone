<template lang="pug">
    .popup.-wide
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title(@click="downloadWithCSS") Выберите шаблон
                p Текст можно изменить
                .pdf
                    // Превьюшки
                    .pdf__list
                        .pdf__list-preview.-empty(@click="setTemplate()") Без шаблона
                        .pdf__list-preview(@click="setTemplate('pdf_1')")
                            img(src="/PDF_1.png")
                        //-     include ../../assets/pdf/pdf_1/pdf_1.pug
                        //- .pdf__list-item
                        //-     include ../../assets/pdf/pdf_1/pdf_1.pug
                        //- .pdf__list-item
                        //-     include ../../assets/pdf/pdf_1/pdf_1.pug
                    
</template>

<script>

import jsPDF from 'jspdf' 
import html2canvas from "html2canvas"

export default {
    methods: {
        setTemplate(template) {
            this.$store.state.view.pdf.ref = template
        },
        closePopup() {
            this.$store.state.view.popup.PDFPopup.visible = false
        },
        downloadWithCSS() {
            /** WITH CSS */
            var canvasElement = document.createElement('canvas')
            
            var width = this.$refs.pdf.offsetWidth;
            var height = this.$refs.pdf.offsetHeight;

            var doc = new jsPDF("p", "px")

            console.log(width, height)

            canvasElement.width = width - 1;
            canvasElement.height = height;

            html2canvas(this.$refs.pdf, { 
                canvas: canvasElement
            }).then(function (canvas) {
                const img = canvas.toDataURL("image/jpeg", 1);
                doc.addImage(img, 'JPEG', 0, 0)
                doc.save("sample.pdf");
                canvasElement.remove()
            })
        }
    },
    async mounted() {
        
    }
}
</script>

<style lang="scss">
.popup {
    &.-wide {
        .popup__container {
            max-width: 1000px;
        }
    }
}
.pdf {
    position: relative;
    overflow: hidden;
    &__list {
        display: flex;
        flex-wrap: wrap;
        &-preview {
            width: 30%;
            margin-right: 3%;
            margin-bottom: 20px;
            img {
                max-width: 100%;
            }
        }
    }
}

</style>