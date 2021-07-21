<template lang="pug">
     .popup
        .popup__container.-wide
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close

            
            .c-qr
                .c-qr__inner
                    .c-qr__content
                        h2.popup__title(v-if="!$store.state.view.popup.tablesPopup.tables") QR-код меню для {{ $store.state.view.popup.styleQRPopup.place.name }}
                        h2.popup__title(v-else) QR-коды столиков {{ '#' + $store.state.view.popup.tablesPopup.tables }} {{$store.state.view.pdf.title}}

                        .c-qr__templates(@click="openPDFPopup")
                            .c-qr__templates-title Шаблоны <span v-if="$store.state.view.pdf.ref">({{ $store.state.view.pdf.data.name }})</span>

                        .c-qr__section
                            .c-qr__section-title Внешний вид
                            .c-qr__section-line
                                .c-qr__section-line-title Цвет кода
                                .c-qr__section-line-content
                                    .c-qr__color
                                        .c-qr__color-item.-black(@click="checkColor('#1F2224')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#1F2224'.toLowerCase() }")
                                        .c-qr__color-item.-blue(@click="checkColor('#307EF2')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#307EF2'.toLowerCase() }")
                                        .c-qr__color-item.-green(@click="checkColor('#40a53c')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#40a53c'.toLowerCase() }")
                                        .c-qr__color-item.-red(@click="checkColor('#E54325')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#E54325'.toLowerCase() }")
                                        .c-qr__color-item.-rainbow(@click="openColorPicker()" :class="{ '-active': isColorPickerActive }")
                                    .c-qr__colorpicker(v-if="isColorPickerActive")
                                        v-color-picker(
                                            dot-size="15"
                                            swatches-max-height="200"
                                            v-model="easyqr.colorDark"
                                            hide-mode-switch
                                            @input="updateQR"
                                            v-lazy-input:debounce="250"
                                            mode="hexa"
                                            elevation="10")
                            .c-qr__section-line
                                .c-qr__section-line-title Логотип
                                .c-qr__section-line-content
                                    .c-qr__logo
                                        .c-qr__logo-item.empty(
                                            :class="{ active: !easyqr.logo }" 
                                            @click="checkEmptyCompanyLogo()")
                                            v-icon(light) mdi-cancel

                                        .c-qr__logo-item(
                                            :class="{ active: easyqr.logo == '../../uploads/' + $store.state.auth.user.photo }"
                                            @click="checkCompanyLogo($store.state.auth.user.photo)"
                                            v-if="$store.state.auth.user.photo")
                                            .c-qr__logo-item-image(:style="{ backgroundImage: 'url(../../uploads/'+ $store.state.auth.user.photo +')' }")
                                        .c-qr__logo-item.upload(
                                            :class="{ active: easyqr.logo ? easyqr.logo.includes('data:image') : false }")
                                            v-icon(light) mdi-upload
                                            input(type="file" id='upload_logo_qr' @change="uploadQRLogo").c-qr__logo-item-file
                                            label(for='upload_logo_qr').c-qr__logo-item-label

                            .c-qr__section-line(v-if="$store.state.view.pdf.ref")
                                .c-qr__section-line-title Контент
                                .c-qr__section-line-content
                                    v-textarea(
                                        v-if="'title' in $store.state.view.pdf.data"
                                        v-model="$store.state.view.pdf.data.title"
                                        type="text"
                                        name="input-10-1"
                                        :label="'Заголовок'"
                                        v-lazy-input:debounce="250"
                                        @input="updatePdf()"
                                        rows="2"
                                        auto-grow
                                        outlined)
                                    v-textarea(
                                        v-if="'subtitle' in $store.state.view.pdf.data"
                                        v-model="$store.state.view.pdf.data.subtitle"
                                        type="text"
                                        :label="'Текст'"
                                        v-lazy-input:debounce="250"
                                        @input="updatePdf()"
                                        rows="2"
                                        auto-grow
                                        outlined)

                        .c-qr__bottom
                            .c-qr__bottom-item
                                v-btn(
                                    depressed 
                                    color="normal").error--text Отмена

                            .c-qr__bottom-item(v-if="!$store.state.view.pdf.ref")
                                v-btn(
                                    depressed 
                                    color="primary"
                                    @click="downloadSVGorPNG('svg')").white--text Скачать SVG
                            .c-qr__bottom-item(v-if="!$store.state.view.pdf.ref")
                                v-btn(
                                    depressed 
                                    color="primary"
                                    @click="downloadSVGorPNG('png')").white--text Скачать PNG
                            .c-qr__bottom-item(v-if="$store.state.view.pdf.ref")
                                v-btn(
                                    depressed 
                                    color="primary"
                                    @click="download()").white--text Скачать PDF

                    .c-qr__preview
                        .c-qr__preview-loader(v-if="$store.state.view.loading.pdfUpdating && $store.state.view.pdf.ref")
                            v-icon(light) mdi-loading

                        .c-qr__preview-svg(v-show="!$store.state.view.pdf.ref")
                            div(ref="qrcode")
                        img.c-qr__preview-image(:src='preview' v-show="$store.state.view.pdf.ref")
                        
            
            //- .popup__content
                
            //-     .sqr
            //-         //- .sqr__pic#image(v-html="qr")
            //-         img#img(:src="asdasd")
            //-         v-qr(
            //-             :text="str"
            //-             :qrcodeColor="settings.mainColor"
            //-             :backgroundColor="settings.bgColor"
            //-             :logo="`http://localhost:3000/uploads/${$store.state.auth.user.photo}`"
            //-             :size="300"
            //-             :logoSize="50"
            //-             :ratio="1"
            //-             level="M"
            //-             :on-finish="onFinish()")#qr_preview

            //-         .sqr__pdf(@click="openPDFPopup") Шаблоны для печати
            //-         .sqr__name {{ $store.state.view.popup.styleQRPopup.place.name }}
            //-         .sqr__line
            //-             .sqr__line-label Лого
            //-             .sqr__line-value
            //-                 input(type="checkbox" v-model="settings.logo" @change="updateQR()")

            //-         // Настраиваемые поля
            //-         .sqr__line(v-if="'title' in $store.state.view.pdf.data") Заголовок
            //-             input(type="text" v-model="$store.state.view.pdf.data.title")
            //-         .sqr__line(v-if="'subtitle' in $store.state.view.pdf.data") Текст
            //-             input(type="text" v-model="$store.state.view.pdf.data.subtitle")
            //-         // Настраиваемые поля

            //-         .sqr__line
            //-             .sqr__line-label Основной цвет
            //-             .sqr__line-value
            //-                 input(type="text" v-model="settings.mainColor" @input="updateQR()")
            //-                 v-color-picker(
            //-                     dot-size="15"
            //-                     swatches-max-height="200"
            //-                     v-model="settings.mainColor"
            //-                     @input="updateQR()"
            //-                     hide-mode-switch
            //-                     mode="hexa")
            //-         .sqr__line
            //-             .sqr__line-label Цвет фона
            //-             .sqr__line-value
            //-                 input(type="text" v-model="settings.bgColor" @input="updateQR()")
            //-                 v-color-picker(
            //-                     dot-size="15"
            //-                     swatches-max-height="200"
            //-                     v-model="settings.bgColor"
            //-                     @input="updateQR()"
            //-                     hide-mode-switch
            //-                     mode="hexa")
  
            //-         .sqr__bottom
            //-             .sqr__bottom-item
            //-                 .sqr__disable Отмена
            //-             .sqr__bottom-item
            //-                 a.sqr__save(@click="download()") Скачать

            //-         div {{asdasd}}


            // Для печати
            .pdf(v-if="$store.state.view.popup.styleQRPopup.visible")
                .pdf__print
                    .pdf__list(ref="pdf1" v-show="$store.state.view.pdf.ref == 'pdf1'")
                        pdf1
                    .pdf__list(ref="pdf2" v-show="$store.state.view.pdf.ref == 'pdf2'")
                        pdf2
</template>

<script>
import vkQr from '@vkontakte/vk-qr';
import fileDownload from 'js-file-download'

import jsPDF from 'jspdf'

import * as QRCode from 'easyqrcodejs'

import {lazyInput} from 'vue-lazy-input'

export default {
    props: {
        // qrs: String
    },
    directives:{
        lazyInput
    },
    data() {
        return {
            qr: '',
            str: '',
            settings: {
                // logo: true,
                mainColor: '#ccc',
                // bgColor: '#fff',
                onRenderingEnd: (e, x) => {
                    this.ended(e, x)
                }
            },

            asdasd: '',
            isSet: false,
            preview: '',

            easyqr: {
                text: this.str,
                colorDark: '#1F2224',
                logo: false,
                onRenderingEnd: (e, x) => {
                    this.$store.state.view.pdf.qr = x
                }
            },

            generatedQr: null,
            isColorPickerActive: false
        }
    },
    watch:{
        '$store.state.view.pdf.ref'(value, oldValue) {
            if (value) this.updatePdf(value)
        }
    },
    async mounted() {
        const id = this.$store.state.auth.user._id
        const place = this.$store.state.view.popup.styleQRPopup.place._id
        const tables = this.$store.state.view.popup.tablesPopup.tables
        this.easyqr.text = this.$store.state.view.popup.wifiPopup.string ? this.$store.state.view.popup.wifiPopup.string : `${process.env.ORIGIN || "localhost:3000"}/qr/${id}/?place=${place}`

        this.updateQR()
    },
    methods: {
        async downloadSVGorPNG(type) {
            const place = this.$store.state.view.popup.styleQRPopup.place
            const logo = this.easyqr.logo ? (this.easyqr.logo.includes('data:image') ? this.easyqr.logo : `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.easyqr.logo}`) : ''

            if (this.generatedQr) this.generatedQr.clear()
                
            this.generatedQr = await new QRCode(this.$refs.qrcode, {
                text: this.easyqr.text,
                colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                logo: logo,
                drawer: type,
                onRenderingEnd: (e, x) => {
                    if (type == 'png') {
                        var download = document.createElement('a');
                        download.href = x;
                        download.download = `${place.link}_menu_qr.${type}`;
                        download.click()
                    } else {
                        fileDownload(x, `${place.link}_menu_qr.${type}`)
                    }
                }
            })
        },
        uploadQRLogo(e) {
            if (e.target.files[0]) {
                let reader = new FileReader()
                reader.readAsDataURL(e.target.files[0])
                reader.onload = () => {
                    this.easyqr.logo = reader.result
                    this.updateQR()
                }
            }
        },
        checkEmptyCompanyLogo() {
            this.easyqr.logo = false
            this.updateQR()
        },
        checkCompanyLogo(logo) {
            this.easyqr.logo = '../../uploads/' + logo
            this.updateQR()
        },
        openColorPicker() {
            this.isColorPickerActive = true
        },
        checkColor(color) {
            this.isColorPickerActive = false
            if (!this.$store.state.view.loading.pdfUpdating && color.toLowerCase() !== this.easyqr.colorDark.toLowerCase()) {
                this.easyqr.colorDark = color.toLowerCase()
                this.updateQR()
            }
        },
        ended(e, x) {
            console.log(x)
        },
        async updatePdf(value) {
            const el = this.$refs[value ? value : this.$store.state.view.pdf.ref ]
            if (el) {
                this.$store.state.view.loading.pdfUpdating = true
                this.preview = await this.$html2canvas(el, { type: 'dataURL' })
                this.$store.state.view.loading.pdfUpdating = false
            }
        },
        openPDFPopup() {
            this.$store.state.view.popup.PDFPopup.visible = true
        },
        async updateQR(e) {
            if (this.$refs.qrcode) {
                if (this.generatedQr) this.generatedQr.clear()
                
                this.generatedQr = await new QRCode(this.$refs.qrcode, {
                    text: this.easyqr.text,
                    colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                    logo:  this.easyqr.logo ? this.easyqr.logo : '',
                    drawer: 'canvas',
                    onRenderingEnd: (e, x) => {
                        this.$store.state.view.pdf.qr = x
                        this.updatePdf()
                    }
                })
            }
        },
        closePopup() {
            this.$store.state.view.popup.styleQRPopup.visible = false
            this.$store.state.view.pdf.ref = null
        },
        async download() {
            const id = this.$store.state.auth.user._id
            const place = this.$store.state.view.popup.styleQRPopup.place
            const tables = this.$store.state.view.popup.tablesPopup.tables
            const el = this.$refs[this.$store.state.view.pdf.ref]

            let tablesArr = []
            let doc = new jsPDF("p", "mm", [this.$store.state.view.pdf.data.height, this.$store.state.view.pdf.data.width])

            if (tables) {
                if (tables.split('-').length == 2) {
                    for (let i = tables.split('-')[0]; i <= tables.split('-')[1]; i++ ) {
                        tablesArr.push(i)
                    }
                } else if (tables.split('-').length == 1) {
                    tablesArr.push(tables)
                } else {
                    console.log('Некорректные данные')
                }


                var i = 0;
                const nextStep = async () => {
                    
                    if(i >= tablesArr.length) return

                    const str = `${process.env.ORIGIN || "localhost:3000"}/qr/${id}/?place=${place._id}&table=${tablesArr[i]}`
                    const logo = this.easyqr.logo ? (this.easyqr.logo.includes('data:image') ? this.easyqr.logo : `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.easyqr.logo}`) : ''
                    
                    this.generatedQr.clear()
                    this.generatedQr = await new QRCode(this.$refs.qrcode, {
                        text: str,
                        colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                        logo: logo,
                        drawer: 'canvas',
                        onRenderingEnd: async (e, x) => {
                            this.$store.state.view.pdf.qr = x

                            const canvas = await this.$html2canvas(el, { type: 'dataURL' })

                            doc.addImage(canvas, 'JPEG', 0, 0)
                            if (i < (tablesArr.length - 1)) {
                                doc.addPage()
                            } else {
                                doc.save("sampqweqwle.pdf")
                            }
                            i++
                            nextStep()
                        }
                    })
                }
                nextStep()

                // for (let i = 0; i < tablesArr.length; i++) {
                    

                //     this.generatedQr.clear()
                //     this.generatedQr = await new QRCode(this.$refs.qrcode, {
                //         text: str,
                //         colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                //         logo:  this.easyqr.logo ? `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.easyqr.logo}` : '',
                //         drawer: 'canvas',
                //         onRenderingEnd: async (e, x) => {
                //             this.$store.state.view.pdf.qr = x
                //             const canvas = await this.$html2canvas(el, { type: 'dataURL' })
                //             doc.addImage(canvas, 'JPEG', 0, 0)
                //             if (i < (tablesArr.length - 1)) {
                //                 doc.addPage()
                //             } else {
                //                 doc.save("sampqweqwle.pdf")
                //             }
                            
                //         }
                //     })
                    
                    
                // }
                
            } else {

                if (this.$store.state.view.pdf.ref) {

                    const el = this.$refs[this.$store.state.view.pdf.ref];
                    doc.addImage(this.preview, 'JPEG', 0, 0)
                    doc.save("sample.pdf")
                    
                } else {
                    console.log(this.preview)
                    fileDownload(this.preview, `${place.link}_menu_qr.png`)
                }

            }
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
        z-index: 3;

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

        &.-wide {
            max-width: 900px;
        }
    }

    &__title {
        margin-bottom: 15px;
    }
}

.sqr {
    &__pic {
        width: 190px;
        height: 190px;
        margin: 0 auto 15px auto;
        svg {
            width: 100%;
            height: 100%;
        }
    }
    &__name {
        text-align: center;
    }
    &__line {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        &-label {
            flex-shrink: 0;
            width: 120px;
            margin-right: 20px;
        }
        &-value {
            flex-grow: 1;
            input {
                width: 100%;
                padding: 5px 10px;
                background: #F5F7FB;
                border-radius: 10px;
            }
        }
    }
    &__bottom {
        display: flex;
        padding: 15px 0;
        justify-content: center;
        &-item {
            margin: 0 10px;
        }
    }
}

.pdf {
    &__print {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        opacity: 0;
        pointer-events: none;
        z-index: -1000;
    }
}

.c-qr {
    &__inner {
        display: flex;
    }
    &__content {
        width: 50%;
        display: flex;
        flex-direction: column;
    }
    &__preview {
        position: relative;
        width: 50%;
        min-height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px 15px;
        &-image {
            max-width: 100%;
            height: auto;
            box-shadow: 0 0 15px rgba(0,0,0,0.4);
        }
        &-loader {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 2;
            background-color: rgba(255,255,255,0.5);
            display: flex;
            justify-content: center;
            .v-icon {
                font-size: 36px;
                color: $color-blue;
                animation: load 1s ease-in-out infinite;
            }
        }
    }
    &__templates {
        cursor: pointer;
        margin-bottom: 10px;
        &-title {
            color: $color-blue;
            span {
                font-weight: bold;
                color: $color-black;
            }
        }
    }
    &__section {
        margin-bottom: 15px;
        &-title {
            margin-bottom: 15px;
        }
        &-line {
            margin-bottom: 10px;
            &-title {
                font-size: 14px;
                margin-bottom: 10px;
            }
            &-content {
                
            }
        }
    }
    &__color {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        &-item {
            position: relative;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            margin-right: 15px;
            &:hover {
                opacity: 0.9;
            }
            &.-black {
                background-color: $color-black;
            }
            &.-blue {
                background-color: $color-blue;
            }
            &.-green {
                background-color: #40a53c;
            }
            &.-red {
                background-color: $color-red;
            }
            &.-rainbow {
                background-image: url('../../static/rainbow.png');
                background-size: cover;
                background-position: center;
            }
            &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale(0);
                width: 8px;
                height: 8px;
                background-color: #fff;
                border-radius: 50%;
                transition: transform .3s;
            }
            &.-active {
                &:after {
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        }
    }
    &__logo {
        display: flex;
        &-item {
            position: relative;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e7e8ec;
            border-radius: 6px;
            width: 65px;
            height: 65px;
            cursor: pointer;
            &:hover {
                opacity: 0.9;
            }
            &-image {
                width: 31px;
                height: 31px;
                background-size: cover;
                background-position: center;
            }
            &.active {
                border-color: #5c9ce6;
            }
            .v-icon {
                font-size: 30px;
                color: #abafbd;
            }
            &-file {
                position: absolute;
                z-index: -100;
                visibility: hidden;
                pointer-events: none;
            }
            &-label {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: 2;
                cursor: pointer;
            }
        }
    }
    &__bottom {
        display: flex;
        margin-top: auto;
        &-item {
            margin-right: 15px;
        }
    }
}
</style>
