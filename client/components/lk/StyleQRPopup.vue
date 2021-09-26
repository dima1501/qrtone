<template lang="pug">
     .popup
        .popup__overlay(@click="closePopup")
        .popup__container.-wide(@click="isCodeColorOpened = false, isBgColorOpened = false")
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            
            .c-qr
                .c-qr__inner
                    .c-qr__content
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'simple'") QR-код меню для {{ $store.state.view.popup.styleQRPopup.place.name }}
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'wifi'") QR-код Wi-Fi для {{ $store.state.view.popup.styleQRPopup.place.name }}
                        h2.popup__title(v-if="$store.state.view.popup.styleQRPopup.type == 'multi'") 
                            span.main QR-коды столиков для {{ $store.state.view.popup.styleQRPopup.place.name }} 
                        .popup__tables(v-if="$store.state.view.popup.tablesPopup.tables.length")
                            span.popup__tables-item(v-for="table in $store.state.view.popup.tablesPopup.tables") {{ table.replaceAll('%20', ' ') }}
                            span.popup__tables-edit(@click="openTablesPopup()" v-if="$store.state.view.popup.tablesPopup.tables.length")
                                v-icon(light) mdi-pencil-outline

                        //- .c-qr__content-svg(v-if="type == '0'")
                        //-     .c-qr__content-svg-preview(v-html="$store.state.view.pdf.qr")
                        //- .c-qr__content-preview(v-if="type !== '0'")
                        //-     .c-qr__preview-template-svg(v-html="$refs.svgToRender.children[0].outerHTML")

                        .c-qr__main-preview
                            .c-qr__main-preview-image(v-if="type == '0'" v-html="$store.state.view.pdf.qr")
                            .c-qr__main-preview-image(v-if="type !== '0'" v-html="$refs.svgToRender.children[0].outerHTML")

                        .c-qr__section
                            .c-qr__section-line
                                .c-qr__section-line-title Тип
                                .c-qr__section-line-content
                                    v-radio-group(v-model="type" hide-details="auto" row @change="updateQR()").mt-0.mb-3
                                        v-radio(label="Только код" value="0")
                                        v-radio(label="С текстом" value="1")
                                        v-radio(label="Текст + описание" value="2")

                            .c-qr__section-line
                                .c-qr__section-line-title Цвет кода
                                .c-qr__section-line-content
                                    .c-qr__color(@click.stop)
                                        .c-qr__color-item.-black(@click="checkColor('#1F2224')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#1F2224'.toLowerCase() }")
                                        .c-qr__color-item.-blue(@click="checkColor('#307EF2')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#307EF2'.toLowerCase() }")
                                        .c-qr__color-item.-green(@click="checkColor('#40a53c')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#40a53c'.toLowerCase() }")
                                        .c-qr__color-item.-red(@click="checkColor('#E54325')" :class="{ '-active': easyqr.colorDark.toLowerCase() == '#E54325'.toLowerCase() }")
                                        .c-qr__color-item.-rainbow(@click="isCodeColorOpened = true" :class="{ '-active': isCodeColorOpened }")
                                        .c-qr__colorpicker(v-if="isCodeColorOpened" )
                                            v-color-picker(
                                                dot-size="15"
                                                swatches-max-height="200"
                                                v-model="easyqr.colorDark"
                                                hide-mode-switch
                                                @input="updateQR"
                                                v-lazy-input:debounce="150"
                                                mode="hexa"
                                                elevation="10")

                            .c-qr__section-line(v-if="type !== '0'")
                                .c-qr__section-line-content
                                    v-switch(
                                        v-model="configs[type].background.visible" 
                                        v-if="'background' in configs[type]" 
                                        v-lazy-input:debounce="100" 
                                        @change="updateQR()"
                                        label="Фон" 
                                        hide-details="auto").mt-0.mb-2
                                    .c-qr__color(v-if="configs[type].background.visible" @click.stop)
                                        .c-qr__color-item.-black(@click="checkBgColor('#1F2224')" :class="{ '-active': configs[type].background.color.toLowerCase() == '#1F2224'.toLowerCase() }")
                                        .c-qr__color-item.-blue(@click="checkBgColor('#307EF2')" :class="{ '-active': configs[type].background.color.toLowerCase() == '#307EF2'.toLowerCase() }")
                                        .c-qr__color-item.-green(@click="checkBgColor('#40a53c')" :class="{ '-active': configs[type].background.color.toLowerCase() == '#40a53c'.toLowerCase() }")
                                        .c-qr__color-item.-red(@click="checkBgColor('#E54325')" :class="{ '-active': configs[type].background.color.toLowerCase() == '#E54325'.toLowerCase() }")
                                        .c-qr__color-item.-rainbow(@click="isBgColorOpened = true" :class="{ '-active': isBgColorOpened }")
                                        .c-qr__colorpicker(v-if="isBgColorOpened" )
                                            v-color-picker(
                                                dot-size="15"
                                                swatches-max-height="200"
                                                v-model="configs[type].background.color"
                                                hide-mode-switch
                                                @input="updateQR"
                                                v-lazy-input:debounce="150"
                                                mode="hexa"
                                                elevation="10")

                            .c-qr__section-line
                                .c-qr__section-line-title Логотип
                                .c-qr__section-line-content
                                    .c-qr__logo
                                        .c-qr__logo-item.empty(
                                            :class="{ active: logoType === 0 }" 
                                            @click="checkEmptyCompanyLogo()")
                                            v-icon(light) mdi-cancel

                                        .c-qr__logo-item(
                                            :class="{ active: logoType === 1 }"
                                            @click="checkCompanyLogo($store.state.auth.user.photo)"
                                            v-if="$store.state.auth.user.photo")
                                            .c-qr__logo-item-image(:style="{ backgroundImage: 'url(../../uploads/'+ $store.state.auth.user.photo +')' }")
                                            
                                        .c-qr__logo-item.upload(
                                            :class="{ active: logoType === 2 }")
                                            v-icon(light) mdi-upload
                                            input(type="file" id='upload_logo_qr' @change="uploadQRLogo").c-qr__logo-item-file
                                            label(for='upload_logo_qr').c-qr__logo-item-label

                            .c-qr__section-line(v-if="type !== '0'")
                                .c-qr__section-line-title Контент
                                .c-qr__section-line-content

                                    v-textarea(
                                        v-if="'description' in configs[type]"
                                        v-model="configs[type].description"
                                        type="text"
                                        :label="'Описание'"
                                        v-lazy-input:debounce="100"
                                        @input="updateQR()"
                                        rows="1"
                                        auto-grow
                                        outlined)

                                    v-textarea(
                                        v-if="'text' in configs[type]"
                                        v-model="configs[type].text"
                                        type="text"
                                        label="Текст"
                                        v-lazy-input:debounce="100"
                                        @input="updateQR()"
                                        rows="1"
                                        auto-grow
                                        outlined
                                        hide-details="auto")

                            .c-qr__section-line(v-if="type !== '0'")
                                .c-qr__section-line-content
                                    v-switch(
                                        v-model="configs[type].table"
                                        v-if="'table' in configs[type] && $store.state.view.popup.styleQRPopup.type == 'multi'" 
                                        v-lazy-input:debounce="250" 
                                        @change="updateQR()"
                                        :label="`Номер столика`" 
                                        hide-details="auto").mt-0

                                    v-switch(
                                        v-model="configs[type].link" 
                                        v-if="'link' in configs[type] && $store.state.view.popup.styleQRPopup.type !== 'wifi'"
                                        v-lazy-input:debounce="250"
                                        @change="updateQR()"
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

                        div(ref="svgGenerate" hidden)

                        .c-qr__preview-svg(v-if="type == '0'")
                            div(v-html="$store.state.view.pdf.qr" ref="svgToRender")

                        .c-qr__preview-template(v-if="type !== '0'")
                            .c-qr__preview-template-svg#svgGenerate(ref="svgToRender")

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
import { lazyInput } from 'vue-lazy-input'
import JSZip from 'jszip'

import domtoimage from 'dom-to-image-more'

import vkQr from '@vkontakte/vk-qr'

import Canvg from 'canvg'
import * as svg from 'save-svg-as-png'

export default {
    directives:{
        lazyInput
    },
    data() {
        return {
            isCodeColorOpened: false,
            isBgColorOpened: false,
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
            generating: false,

            type: '0',
            logoType: 0,

            configs: [
                {
                    size: 280
                },
                {
                    type: '1',
                    text: 'Отсканируйте для просмотра меню',
                    size: 198,
                    width: 238,
                    height: 238,
                    background: {
                        visible: false,
                        color: "#1F2224"
                    },
                    table: false,
                    link: false
                },
                {
                    type: '2',
                    text: 'Отсканируйте для просмотра меню',
                    description: 'Сделать заказ, позвать официанта или попросить счет',
                    background: {
                        visible: false,
                        color: "#1F2224"
                    },
                    size: 198,
                    width: 238,
                    height: 238,
                    table: false,
                    link: false
                }
            ]
        }
    },
    watch:{
        '$store.state.view.pdf.ref'(value, oldValue) {
            if (value) {
                this.$nextTick(async () => {
                    this.updatePdf(value)
                })
            }
        }
    },
    async mounted() {
        const place = this.$store.state.view.popup.styleQRPopup.place._id
        this.easyqr.text = this.$store.state.view.popup.styleQRPopup.type == "wifi" ? this.$store.state.view.popup.wifiPopup.string :  `https://toffee.menu/qr/${place}`
        this.updateQR()
    },
    methods: {
        openTablesPopup() {
            this.$store.state.view.popup.tablesPopup.visible = true
        },
        async downloadSVGorPNG(type) {
            const place = this.$store.state.view.popup.styleQRPopup.place
            const logo = this.easyqr.logo ? this.easyqr.logo : ''
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

                        const str = `https://toffee.menu/qr/${place._id}?t=${tablesArr[i]}`
                        this.downloadQr = await new QRCode(this.$refs.svgGenerate, {
                            text: str.replaceAll(' ', '%20'),
                            colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                            logo: logo,
                            drawer: type,
                            width: 500,
                            height: 500,
                            onRenderingEnd: async (e, x) => {
                                if (type == 'png') {
                                    if (kind == 'files') {
                                        if (this.type !== '0') {
                                            this.$store.state.view.pdf.qr = x
                                            this.$store.state.view.pdf.table = tablesArr[i]
                                            this.$store.state.view.pdf.link = str
                                            this.generateTemplate()
                                            svg.saveSvgAsPng(this.$refs.svgToRender.children[0],  `${place.name}_table_${tablesArr[i]}.${type}`)
                                        } else {
                                            var download = document.createElement('a');
                                            download.href = x;
                                            download.download = `${place.name}_table_${tablesArr[i]}.${type}`;
                                            download.click()
                                        }
                                    } else {
                                        if (this.type !== '0') {
                                            this.$store.state.view.pdf.qr = x
                                            this.$store.state.view.pdf.table = tablesArr[i]
                                            this.$store.state.view.pdf.link = str
                                            this.generateTemplate()
                                            await svg.svgAsPngUri(this.$refs.svgToRender.children[0]).then(uri => {
                                                zip.file(`${place.name}_table_${tablesArr[i]}.${type}`, this.b64toBlob(uri))
                                            })

                                        } else {
                                            zip.file(`${place.name}_table_${tablesArr[i]}.${type}`, this.b64toBlob(x))
                                        }
                                    }
                                } else {
                                    
                                    let data

                                    if (this.type == '0') {
                                        data = (new XMLSerializer()).serializeToString(this.$refs.svgGenerate.children[0])
                                    } else {
                                        await svg.svgAsPngUri(this.$refs.svgGenerate.children[0]).then(uri => {
                                            this.$store.state.view.pdf.qr = uri
                                            this.$store.state.view.pdf.table = tablesArr[i]
                                            this.$store.state.view.pdf.link = str
                                            this.generateTemplate()
                                        })

                                        data = (new XMLSerializer()).serializeToString(this.$refs.svgToRender.children[0])
                                    }

                                    if (kind == 'files') {
                                        fileDownload(data, `${place.name}_table_${tablesArr[i]}.${type}`)
                                    } else {
                                        zip.file(`${place.name}_table_${tablesArr[i]}.${type}`, data)
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
                const str = `https://toffee.menu/m/${place.link}`
                this.$store.state.view.pdf.link = str
                if (this.type !== '0') this.generateTemplate()
                if (type == 'png') {
                    svg.saveSvgAsPng(this.$refs.svgToRender.children[0],  `${place.name}_menu_qr.${type}`)
                } else {
                    var data = (new XMLSerializer()).serializeToString(this.$refs.svgToRender.children[0])
                    fileDownload(data, `${place.name}_menu_qr.${type}`)
                }
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
                this.logoType = 2
            }
        },
        checkEmptyCompanyLogo() {
            this.easyqr.logo = false
            this.updateQR()
            this.logoType = 0
        },
        async checkCompanyLogo(logo) {
            this.logoType = 1
            let blob = await fetch('../../uploads/' + logo).then(r => r.blob())
            let reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onload = () => {
                this.easyqr.logo = reader.result
                this.updateQR()
            }
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
        checkBgColor(color) {
            this.configs[this.type].background.color = color
            this.updateQR()
        },
        async updatePdf(value) {
            this.$store.state.view.loading.pdfUpdating = true
            const el = this.$refs[value ? value : this.$store.state.view.pdf.ref ]
            if (el) {
                this.preview = await domtoimage.toPng(el)
            }
            this.$store.state.view.loading.pdfUpdating = false
        },
        openPDFPopup() {
            this.$store.state.view.popup.PDFPopup.visible = true
        },
        async updateQR() {
            this.$store.state.view.pdf.qr = ''
            if (this.generatedQr) this.generatedQr.clear()
            this.generatedQr = await new QRCode(this.$refs.svgGenerate, {
                text: this.easyqr.text.replaceAll(' ', '%20'),
                colorDark: this.easyqr.colorDark ? this.easyqr.colorDark : '#000',
                logo: this.easyqr.logo ? this.easyqr.logo : '',
                drawer: this.type == '0' ? 'svg' : 'canvas',
                width: this.type == '0' ? 250 : 500,
                height: this.type == '0' ? 250 : 500,
                onRenderingEnd: (e, x) => {
                    this.$store.state.view.pdf.qr = x

                    if (this.type !== '0') {
                        this.generateTemplate()
                    }
                }
            })

        },
        generateTemplate() {
            const el = document.getElementById("svgGenerate");
            el.innerHTML = ""

            const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            const str = this.configs[this.type].text
            const strArr = str.match(/.{1,21}(\s|$)/g) || ['']

            const description = this.configs[this.type].description
            const descriptionArr = description && description.match(/.{1,21}(\s|$)/g) || ['']

            const background = this.configs[this.type].background

            const table = this.configs[this.type].table
            const link = this.configs[this.type].link

            const calcHeight = this.configs[this.type].height + (!!description ? (16 + descriptionArr.length * 16) - 5 : 0) + (!!str ? 30 + strArr.length * 18 : 0) + (table ? 20 : 0) + (link ? 20 : 0)

            if (table) {
                const tableBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                tableBg.setAttribute("fill", "black");
                tableBg.setAttribute("width", 238);
                tableBg.setAttribute("height", 24);
                tableBg.setAttribute("x", 0);
                tableBg.setAttribute("y", link ? calcHeight - 42 : calcHeight - 22);
                svg1.appendChild(tableBg)

                const tableText = document.createElementNS("http://www.w3.org/2000/svg", "text")
                tableText.setAttributeNS(null, "x", "50%");     
                tableText.setAttributeNS(null, "y", link ? calcHeight - 31 : calcHeight - 11); 
                tableText.setAttributeNS(null, "font-size", 10);
                tableText.setAttributeNS(null, "font-weight","medium");
                tableText.setAttributeNS(null, "font-family","sans-serif");
                tableText.setAttributeNS(null, "letter-spacing","0.02em");
                tableText.setAttributeNS(null, "fill","white");
                tableText.setAttributeNS(null, 'dominant-baseline', 'middle')
                tableText.setAttributeNS(null, 'text-anchor', 'middle')
                tableText.innerHTML = this.$store.state.view.pdf.table ? "Столик " + this.$store.state.view.pdf.table.replaceAll("%20", ' ') : 'Столик 12'
                svg1.appendChild(tableText)
            }

            if (link) {
                const linkBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                linkBg.setAttribute("fill", "black");
                linkBg.setAttribute("width", 238);
                linkBg.setAttribute("height", 20);
                linkBg.setAttribute("x", 0);
                linkBg.setAttribute("y", calcHeight - 20);
                svg1.appendChild(linkBg)

                const linkText = document.createElementNS("http://www.w3.org/2000/svg", "text")
                linkText.setAttributeNS(null, "x", "50%");     
                linkText.setAttributeNS(null, "y", calcHeight - 11);
                linkText.setAttributeNS(null, "font-size", 10);
                linkText.setAttributeNS(null, "font-weight","medium");
                linkText.setAttributeNS(null, "font-family","sans-serif");
                linkText.setAttributeNS(null, "letter-spacing","0.02em");
                linkText.setAttributeNS(null, "fill","white");
                linkText.setAttributeNS(null, 'dominant-baseline', 'middle')
                linkText.setAttributeNS(null, 'text-anchor', 'middle')

                if (this.$store.state.view.popup.styleQRPopup.type == 'multi') {
                    linkText.innerHTML = `toffee.menu/m/${this.$store.state.view.popup.styleQRPopup.place.link}?t=${this.$store.state.view.pdf.table ? this.$store.state.view.pdf.table.replaceAll('%20', ' ') : 1}`
                } else {
                    linkText.innerHTML = `toffee.menu/m/${this.$store.state.view.popup.styleQRPopup.place.link}`
                }

                svg1.appendChild(linkText)
            }

            if (background && background.visible) {
                const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                bgRect.setAttribute("fill", this.configs[this.type].background.color);
                bgRect.setAttribute("width", "100%");
                bgRect.setAttribute("height", 258 + (!!description ? (16 + descriptionArr.length * 16) - 4 : 0));
                bgRect.setAttribute("x", 0);
                bgRect.setAttribute("y", 0);
                svg1.appendChild(bgRect)

                const svgBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                svgBg.setAttribute("fill", "white");
                svgBg.setAttribute("width", 198);
                svgBg.setAttribute("height", 198);
                svgBg.setAttribute("x", 20);
                svgBg.setAttribute("y", 20);
                svgBg.setAttribute("rx", 10);
                svg1.appendChild(svgBg)
            }

            if (description) {
                for(let i in descriptionArr) {
                    const descriptionText = document.createElementNS("http://www.w3.org/2000/svg", "text")
                    descriptionText.setAttributeNS(null, "x", "50%");     
                    descriptionText.setAttributeNS(null, "y", 244 + (16 * i)); 
                    descriptionText.setAttributeNS(null, "font-size", 14);
                    descriptionText.setAttributeNS(null, "font-weight","medium");
                    descriptionText.setAttributeNS(null, "font-family","sans-serif");
                    descriptionText.setAttributeNS(null, "letter-spacing","0.02em");
                    descriptionText.setAttributeNS(null, "fill", background && background.visible ? 'white' : 'black');
                    descriptionText.setAttributeNS(null, 'dominant-baseline', 'middle')
                    descriptionText.setAttributeNS(null, 'text-anchor', 'middle')
                    descriptionText.innerHTML = descriptionArr[i]
                    svg1.appendChild(descriptionText)
                }
            }

            svg1.setAttribute("width", "100%");
            
            svg1.setAttribute("viewBox", `0 0 ${this.configs[this.type].width} ${calcHeight}`);

            var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
            svgimg.setAttribute("width", this.configs[this.type].background && this.configs[this.type].background.visible ? 158 : 198);
            svgimg.setAttribute("height", this.configs[this.type].background && this.configs[this.type].background.visible ? 158 : 198);
            svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href', this.$store.state.view.pdf.qr);
            svgimg.setAttribute("x", this.configs[this.type].background && this.configs[this.type].background.visible ? "40" : "20");
            svgimg.setAttribute("y", this.configs[this.type].background && this.configs[this.type].background.visible ? "40" : "20");
            svgimg.setAttributeNS(null, 'visibility', 'visible');
            svg1.appendChild(svgimg);

            const textBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            textBg.setAttribute("fill", "#000");
            textBg.setAttribute("width", "100%");
            textBg.setAttribute("height", 32 + strArr.length * 18);
            textBg.setAttribute("x", "0");
            textBg.setAttribute("y", 238 + (!!description ? (16 + descriptionArr.length * 16) - 4 : 0));
            svg1.appendChild(textBg)

            if (str) {
                for(let i in strArr) {
                    const mainText = document.createElementNS("http://www.w3.org/2000/svg", "text")
                    mainText.setAttributeNS(null, "x", "50%");     
                    mainText.setAttributeNS(null, "y", 238 + (!!description ? (16 + descriptionArr.length * 16) - 4 : 0) + 25 + (18 * i)); 
                    mainText.setAttributeNS(null, "font-size", 17);
                    mainText.setAttributeNS(null, "font-weight","medium");
                    mainText.setAttributeNS(null, "font-family","sans-serif");
                    mainText.setAttributeNS(null, "letter-spacing","0.02em");
                    mainText.setAttributeNS(null, "fill","white");
                    mainText.setAttributeNS(null, 'dominant-baseline', 'middle')
                    mainText.setAttributeNS(null, 'text-anchor', 'middle')
                    mainText.innerHTML = strArr[i]
                    svg1.appendChild(mainText)
                }
            }

            el.appendChild(svg1)
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
    }
}
</script>


<style lang="scss">

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
        margin-bottom: 20px;
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
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        z-index: -1000;
    }
}

.c-qr {
    &__inner {
        display: flex;
    }
    &__main-preview {
        margin-bottom: 20px;
        @media screen and (min-width: 768px) {
            display: none;
            margin: 0;
        }
        &-image {
            display: flex;
            justify-content: center;
            max-width: 320px;
            margin: 0 auto;
        }
    }
    &__content {
        display: flex;
        flex-direction: column;
        width: 100%;
        @media screen and (min-width: 768px) {
            width: 50%;
        }
        &-preview {
            width: 100%;
            height: auto;
            max-width: 400px;
            margin: 0 auto 20px;
            @media screen and (min-width: 768px) {
                display: none;
            }
        }
        &-svg {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            img {
                width: 100%;
                height: auto;
            }
            &-preview {
                display: flex;
                justify-content: center;
            }
        }
    }
    &__preview {
        display: none;
        @media screen and (min-width: 768px) {
            position: relative;
            width: 50%;
            min-height: 400px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 30px 15px;
            align-self: flex-start;
        }
        &-template {
            &-svg {
                svg {
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
            }
        }
        &-image {
            max-width: 100%;
            height: auto;
            box-shadow: 0 0 15px rgba(0,0,0,0.4);
        }
        &-loader {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 23;
            background-color: rgba(255,255,255,0.5);
            display: flex;
            justify-content: center;
            height: 100vh;
            width: 100vw;
            @media screen and (min-width: 768px) {
                position: absolute;
                width: auto;
                height: auto;
            }
            .v-icon {
                font-size: 36px;
                color: $color-blue;
                animation: load 1s ease-in-out infinite;
            }
        }
        &-svg {
            canvas {
                width: 90%;
                max-width: 380px;
                height: auto;
                margin: 0 auto;
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
    &__colorpicker {
        position: absolute;
        top: calc(100% + 10px);
        left: 0;
        z-index: 10;
    }
    &__color {
        position: relative;
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
            overflow: hidden;
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
        flex-wrap: wrap;
        @media screen and (min-width: 768px) {
            margin-top: auto;
        }
        &-item {
            margin-right: 15px;
            margin-bottom: 15px;
            @media screen and (min-width: 768px) {
                margin-bottom: 0;
            }
        }
    }
}

.v-color-picker__input {
    span {
        display: none;
    }
    input {
        margin-bottom: 0;
    }
}
</style>
