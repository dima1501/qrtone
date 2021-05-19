<template lang="pug">
     .popup
        .popup__container
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .popup__content
                h2.popup__title(v-if="!$store.state.view.popup.tablesPopup.tables") QR-код меню
                h2.popup__title(v-else) QR-коды столиков # {{ $store.state.view.popup.tablesPopup.tables }}
                .sqr
                    .sqr__pic(v-html="qr")
                    .sqr__name {{ $store.state.view.popup.styleQRPopup.place.name }}
                    .sqr__line
                        .sqr__line-label Лого
                        .sqr__line-value
                            input(type="checkbox" v-model="settings.logo" @change="updateQR()") 
                    .sqr__line
                        .sqr__line-label Основной цвет
                        .sqr__line-value
                            input(type="text" v-model="settings.mainColor" @input="updateQR()")
                            v-color-picker(
                                dot-size="15"
                                swatches-max-height="200"
                                v-model="settings.mainColor"
                                @input="updateQR()"
                                hide-mode-switch
                                mode="hexa")
                    .sqr__line
                        .sqr__line-label Цвет фона
                        .sqr__line-value
                            input(type="text" v-model="settings.bgColor" @input="updateQR()")
                            v-color-picker(
                                dot-size="15"
                                swatches-max-height="200"
                                v-model="settings.bgColor"
                                @input="updateQR()"
                                hide-mode-switch
                                mode="hexa")
  
                    .sqr__bottom
                        .sqr__bottom-item
                            .sqr__disable Отмена
                        .sqr__bottom-item
                            a.sqr__save(@click="download") Скачать
</template>

<script>
import Vue from 'vue'
import vkQr from '@vkontakte/vk-qr';
import fileDownload from 'js-file-download'

export default {
    data() {
        return {
            qr: '',
            settings: {
                logo: false,
                mainColor: '#000',
                bgColor: '#fff'
            }
        }
    },
    mounted() {
        this.updateQR()
    },
    methods: {
        updateQR() {
            const id = this.$store.state.auth.user._id
            const place = this.$store.state.view.popup.styleQRPopup.place._id

            const qrSvg = vkQr.createQR(`${process.env.ORIGIN || "localhost:3000"}/qr/${id}/?place=${place}`, {
                qrSize: 190,
                isShowLogo: this.settings.logo,
                logoData: this.settings.logo ? `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.$store.state.auth.user.photo}` : '',
                isShowBackground: true,
                backgroundColor: this.settings.bgColor,
                foregroundColor: this.settings.mainColor
            })
            this.qr = qrSvg
        },
        closePopup() {
            this.$store.state.view.popup.styleQRPopup.visible = false
        },
        download() {
            const id = this.$store.state.auth.user._id
            const place = this.$store.state.view.popup.styleQRPopup.place
            const tables = this.$store.state.view.popup.tablesPopup.tables
            let tablesArr = []
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

                for (let i = 0; i < tablesArr.length; i++) {
                    const qrSvg = vkQr.createQR(`${process.env.ORIGIN || "localhost:3000"}/qr/${id}/?place=${place._id}&table=${tablesArr[i]}`, {
                        qrSize: 256,
                        isShowLogo: this.settings.logo,
                        logoData: this.settings.logo ? `${process.env.ORIGIN || "http://localhost:3000"}/uploads/${this.$store.state.auth.user.photo}` : '',
                        isShowBackground: true,
                        backgroundColor: this.settings.bgColor,
                        foregroundColor: this.settings.mainColor
                    })
                    fileDownload(qrSvg, `${place.name}-${tablesArr[i]}.svg`)
                }
            } else {
                fileDownload(this.qr, `${place.name}_menu_qr.svg`)
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
</style>
