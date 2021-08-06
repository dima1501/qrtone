<template lang="pug">
     .popup
        .popup__overlay(@click="closePopup")
        .popup__container.-wide
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            
            .c-qr
                .c-qr__inner
                    .c-qr__content
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'simple'") QR-код меню для {{ $store.state.view.popup.styleQRPopup.place.name }}
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'wifi'") QR-код Wi-Fi для {{ $store.state.view.popup.styleQRPopup.place.name }}
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'multi'") 
                            span.main QR-коды столиков для {{ $store.state.view.popup.styleQRPopup.place.name }} 
                            <br>
                            span.tables(v-for="table in $store.state.view.popup.tablesPopup.tables") {{ table }}
                            span.edit(@click="openTablesPopup()" v-if="$store.state.view.popup.tablesPopup.tables.length")
                                v-icon(light) mdi-pencil-outline

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
                                        :label="'Заголовок'"
                                        v-lazy-input:debounce="250"
                                        @input="updatePdf()"
                                        rows="1"
                                        auto-grow
                                        outlined)

                                    v-textarea(
                                        v-if="'subtitle' in $store.state.view.pdf.data"
                                        v-model="$store.state.view.pdf.data.subtitle"
                                        type="text"
                                        :label="'Текст'"
                                        v-lazy-input:debounce="250"
                                        @input="updatePdf()"
                                        rows="1"
                                        auto-grow
                                        outlined)

                                    v-textarea(
                                        v-if="'feature_text' in $store.state.view.pdf.data"
                                        v-model="$store.state.view.pdf.data.feature_text"
                                        type="text"
                                        :label="'Описание'"
                                        v-lazy-input:debounce="250"
                                        @input="updatePdf()"
                                        rows="1"
                                        auto-grow
                                        outlined)

                                    v-checkbox(
                                        v-model="$store.state.view.pdf.data.table" 
                                        v-if="'table' in $store.state.view.pdf.data && $store.state.view.popup.styleQRPopup.type == 'multi'" 
                                        v-lazy-input:debounce="250" 
                                        @change="updatePdf()"
                                        :label="`Номер столика`" 
                                        hide-details="auto").mt-0

                                    v-checkbox(
                                        v-model="$store.state.view.pdf.data.link" 
                                        v-if="'link' in $store.state.view.pdf.data && $store.state.view.popup.styleQRPopup.type !== 'wifi'"
                                        v-lazy-input:debounce="250" 
                                        @change="updatePdf()"
                                        :label="`Ссылка на меню`" 
                                        hide-details="auto").mt-0

                        .c-qr__bottom(v-if="$store.state.view.popup.tablesPopup.tables && $store.state.view.popup.tablesPopup.tables.length || $store.state.view.popup.styleQRPopup.type == 'simple' || $store.state.view.popup.styleQRPopup.type == 'wifi'")
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
                        .c-qr__bottom(v-else)
                            .c-qr__bottom-item
                                v-btn(
                                    depressed 
                                    color="primary"
                                    @click="openTablesPopup()").white--text Указать столики

                    .c-qr__preview
                        .c-qr__preview-loader(v-if="$store.state.view.loading.pdfUpdating && $store.state.view.pdf.ref")
                            v-icon(light) mdi-loading

                        .c-qr__preview-svg(v-show="!$store.state.view.pdf.ref")
                            div(ref="qrcode")
                            div(ref="qrcode_generate" hidden)
                        img.c-qr__preview-image(:src='preview' v-show="$store.state.view.pdf.ref")
                        //- .c-qr__preview-image(v-html='preview.toDataURL()' v-show="$store.state.view.pdf.ref")

            .c-qr__preview-loader(v-if="generating")
                v-icon(light) mdi-loading

            // Для печати
            .pdf(v-if="$store.state.view.popup.styleQRPopup.visible")
                .pdf__print
                    .pdf__list(ref="pdf1" v-show="$store.state.view.pdf.ref == 'pdf1'")
                        pdf1
                    .pdf__list(ref="pdf2" v-show="$store.state.view.pdf.ref == 'pdf2'")
                        pdf2
                    .pdf__list(ref="pdf3" v-show="$store.state.view.pdf.ref == 'pdf3'")
                        pdf3
                    .pdf__list(ref="pdf4" v-show="$store.state.view.pdf.ref == 'pdf4'")
                        pdf4
</template>

<script>
import fileDownload from 'js-file-download'
import jsPDF from 'jspdf'
import * as QRCode from 'easyqrcodejs'
import {lazyInput} from 'vue-lazy-input'
import JSZip from 'jszip'

import domtoimage from 'dom-to-image-more'

export default {
    directives:{
        lazyInput
    },
    data() {
        return {
            qr: '',
            str: '',

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
            downloadQr: null,
            isColorPickerActive: false,

            generating: false
        }
    },
    watch:{
        '$store.state.view.pdf.ref'(value, oldValue) {
            if (value) {
                this.updatePdf(value)
            }
        }
    },
    async mounted() {
        const place = this.$store.state.view.popup.styleQRPopup.place._id

        this.easyqr.text = this.$store.state.view.popup.styleQRPopup.type == "wifi" ? this.$store.state.view.popup.wifiPopup.string :  `${process.env.ORIGIN || "localhost:3000"}/qr/${place}`

        this.updateQR()
    },
    methods: {
        openTablesPopup() {
            this.$store.state.view.popup.tablesPopup.visible = true
        },
        async downloadSVGorPNG(type) {
            const place = this.$store.state.view.popup.styleQRPopup.place
            const logo = this.easyqr.logo ? (this.easyqr.logo.includes('data:image') ? this.easyqr.logo : `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.easyqr.logo}`) : ''
            const tablesArr = this.$store.state.view.popup.tablesPopup.tables

            if (tablesArr && tablesArr.length) {
                const zip = new JSZip()
                this.$confirm({
                    message: `Скачать файлы по отдельности или сжатым ZIP архивом?`,
                    button: {
                        no: 'ZIP архив',
                        yes: 'Файлами'
                    },
                    callback: async (confirm) => {
                        if (confirm == 'true') {
                            downloadFiles('files')
                        } else if (confirm == 'false') {
                            downloadFiles('zip')
                        }
                    }
                })

                const downloadFiles = (kind) => {
                    this.generating = true
                    var i = 0
                    const nextStep = async () => {
                        if (i >= tablesArr.length) {
                            this.generating = false
                            if (kind == 'zip') {
                                zip.generateAsync({
                                    type: "blob"
                                }).then((blob) => {
                                    fileDownload(blob, `${place.name}_tables_menu.zip`)
                                }, (err) => {
                                    alert('export failed')
                                })
                            }
                            return
                        }

                        const str = `${process.env.ORIGIN || "localhost:3000"}/qr/${place._id}?t=${tablesArr[i]}`
                        
                        this.downloadQr = await new QRCode(this.$refs.qrcode_generate, {
                            text: str.replaceAll(' ', '%20'),
                            colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                            logo: logo,
                            drawer: type,
                            width: 500,
                            height: 500,
                            colorLight: 'transparent',
                            onRenderingEnd: (e, x) => {
                                if (type == 'png') {
                                    if (kind == 'files') {
                                        var download = document.createElement('a');
                                        download.href = x;
                                        download.download = `${place.name}_table_${tablesArr[i]}.${type}`;
                                        download.click()
                                    } else {
                                        zip.file(`${place.name}_table_${tablesArr[i]}.${type}`, this.b64toBlob(x))
                                    }
                                } else {
                                    if (kind == 'files') {
                                        fileDownload(x, `${place.name}_table_${tablesArr[i]}.${type}`)
                                    } else {
                                        zip.file(`${place.name}_table_${tablesArr[i]}.${type}`, x)
                                    }
                                }
                                i++
                                nextStep()
                            }
                        })
                    }
                    nextStep()
                }

                
            } else {
                this.generating = true
                this.downloadQr = await new QRCode(this.$refs.qrcode_generate, {
                    text: this.easyqr.text.replaceAll(' ', '%20'),
                    colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                    logo: logo,
                    drawer: type,
                    width: 500,
                    height: 500,
                    colorLight: 'transparent',
                    onRenderingEnd: (e, x) => {
                        if (type == 'png') {
                            var download = document.createElement('a');
                            download.href = x;
                            download.download = `${place.name}_menu_qr.${type}`;
                            download.click()
                        } else {
                            fileDownload(x, `${place.name}_menu_qr.${type}`)
                        }
                        this.generating = false
                    }
                })
            }
        },
        b64toBlob(dataURI) {
    
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: 'image/jpeg' });
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
        async updatePdf(value) {
            this.$store.state.view.loading.pdfUpdating = true
            const el = this.$refs[value ? value : this.$store.state.view.pdf.ref ]
            console.log(el)
            if (el) {
                this.preview = await domtoimage.toPng(el)
            }
            this.$store.state.view.loading.pdfUpdating = false
        },
        openPDFPopup() {
            this.$store.state.view.popup.PDFPopup.visible = true
        },
        async updateQR(e) {
            if (this.$refs.qrcode) {
                if (this.generatedQr) {
                    this.generatedQr.clear()
                }
                console.log(this.$store.state.view.pdf.data.defaultColor)
                this.generatedQr = await new QRCode(this.$refs.qrcode, {
                    text: this.easyqr.text,
                    colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                    logo:  this.easyqr.logo ? this.easyqr.logo : '',
                    drawer: 'canvas',
                    width: 500,
                    height: 500,
                    colorLight: this.$store.state.view.pdf.data.defaultColor ? this.$store.state.view.pdf.data.defaultColor : 'transparent',
                    onRenderingEnd: (e, x) => {
                        this.$store.state.view.pdf.qr = x
                        this.$store.state.view.pdf.link = this.easyqr.text
                        this.updatePdf()
                    }
                })
            }
        },
        closePopup() {
            this.$confirm({
                message: `Завершить создание QR-кода?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.styleQRPopup.visible = false
                        this.$store.state.view.pdf.ref = null

                        if (this.$store.state.view.popup.tablesPopup.place) {
                            this.$store.state.view.popup.tablesPopup.tables = [...this.$store.state.view.popup.tablesPopup.place.tables]
                        }
                    }
                }
            })
        },
        async download() {
            const id = this.$store.state.auth.user._id
            const place = this.$store.state.view.popup.styleQRPopup.place
            const tablesArr = this.$store.state.view.popup.tablesPopup.tables
            const el = this.$refs[this.$store.state.view.pdf.ref]

            this.generating = true

            let doc = new jsPDF("p", "mm", [this.$store.state.view.pdf.data.height, this.$store.state.view.pdf.data.width])

            if (tablesArr.length) {

                var i = 0;
                const nextStep = async () => {
                    
                    if(i >= tablesArr.length) {
                        this.generating = false
                        return
                    }

                    const str = `${process.env.ORIGIN || "localhost:3000"}/qr/${place._id}?t=${tablesArr[i]}`
                    const logo = this.easyqr.logo ? (this.easyqr.logo.includes('data:image') ? this.easyqr.logo : `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.easyqr.logo}`) : ''

                    this.generatedQr.clear()
                    this.generatedQr = await new QRCode(this.$refs.qrcode, {
                        text: str.replaceAll(' ', '%20'),
                        colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                        logo: logo,
                        drawer: 'canvas',
                        width: 500,
                        height: 500,
                        colorLight: 'transparent',
                        onRenderingEnd: async (e, x) => {
                            this.$store.state.view.pdf.qr = x
                            this.$store.state.view.pdf.table = tablesArr[i]
                            this.$store.state.view.pdf.link = str

                            const canvas = await domtoimage.toPng(el)

                            doc.addImage(canvas, 'JPEG', 0, 0)
                            if (i < (tablesArr.length - 1)) {
                                doc.addPage()
                            } else {
                                doc.save(`${place.name}_tables_menu.pdf`)
                            }
                            i++
                            nextStep()
                        }
                    })
                }
                nextStep()
                
            } else {

                if (this.$store.state.view.pdf.ref) {
                    doc.addImage(this.preview, 'JPEG', 0, 0)
                    doc.save(`${place.name}_menu_qr.pdf`)
                    this.generating = false
                    
                } else {
                    fileDownload(this.preview, `${place.name}_menu_qr.png`)
                    this.generating = false
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
        &-svg {
            canvas {
                max-width: 100%;
                height: auto;
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
