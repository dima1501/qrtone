<template lang="pug">
    .info-popup
        .info-popup__overlay(@click="closePopup")
        .info-popup__container
            .info-popup__closer(@click="closePopup")
                v-icon(light) mdi-close
            .info-popup__content
                h2.info-popup__title {{ $store.state.guest.companyData.name }}
                div.info-popup__descr(v-if="$store.state.guest.companyData.description") {{ $store.state.guest.companyData.description }}
                .info-popup__line(v-if="$store.state.guest.companyData.place.phone")
                    .info-popup__subtitle Телефон:
                    a(:href="`tel:${$store.state.guest.companyData.place.phone}`").info-popup__link
                        span.link {{ $store.state.guest.companyData.place.phone }}

                .info-popup__line(v-if="$store.state.guest.companyData.place.address.full")
                    .info-popup__subtitle Адрес:
                    a(:href="`https://maps.google.com/?q=${$store.state.guest.companyData.name}, ${$store.state.guest.companyData.place.address.value}, ${$store.state.guest.companyData.place.address.description}`" target="_blank").info-popup__address
                        span.info-popup__address-title.link(v-if="!$store.state.guest.companyData.place.address.value") {{ $store.state.guest.companyData.place.address.full }}
                        span.info-popup__address-title.link {{ $store.state.guest.companyData.place.address.value }}<br>
                        span.info-popup__address-descr.link {{ $store.state.guest.companyData.place.address.description }}

                .info-popup__line(v-if="$store.state.guest.companyData.place.website") 
                    .info-popup__subtitle Сайт:
                    a(:href="`${$store.state.guest.companyData.place.website.includes('http') ? '' : 'https://'}${$store.state.guest.companyData.place.website}`" target="_blank").info-popup__link
                        span.link {{ $store.state.guest.companyData.place.website }}
                        
                .info-popup__line(v-if="$store.state.guest.companyData.place.times") 
                    .info-popup__subtitle График:
                    div.info-popup__link
                        span {{ $store.state.guest.companyData.place.times }}
                .info-popup__soc
                    a(:href="`https://t.me/${$store.state.guest.companyData.place.telegram}`" target="_blank" v-if="$store.state.guest.companyData.place.telegram").info-popup__soc-item
                        img(src="/icon-telegram.svg")
                    a(:href="`https://vk.com/${$store.state.guest.companyData.place.vk}`" target="_blank" v-if="$store.state.guest.companyData.place.vk").info-popup__soc-item
                        img(src="/icon-vk.svg")
                    a(:href="`https://www.instagram.com/${$store.state.guest.companyData.place.instagram}`" target="_blank"  v-if="$store.state.guest.companyData.place.instagram").info-popup__soc-item
                        img(src="/icon-instagram.svg")
                    a(:href="`https://wa.me/${$store.state.guest.companyData.place.whatsapp}`" target="_blank"  v-if="$store.state.guest.companyData.place.whatsapp").info-popup__soc-item
                        img(src="/icon-whatsapp.svg")
                .info-popup__reserve(v-if="isAvailable && $store.state.guest.companyData.place.reservationsEnabled")
                    v-btn(
                        depressed
                        @click="openReservePopup"
                    ).blue--text.e-card__bottom-item Забронировать столик
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            
        }
    },
    computed: {
        isAvailable() {
            const isStandart = this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.guest.companyData.subscription[this.$store.state.guest.companyData.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.guest.companyData.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.infoPopup = false
        },
        openReservePopup() {
            this.$store.state.view.popup.infoPopup = false
            this.$store.state.view.popup.reservePopup.visible = true
        }
    }
}
</script>


<style lang="scss">
.info-popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 23;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    padding: 15px;
    @media screen and (min-width: 500px) {
        padding: 30px;
    }
    &__overlay {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    &__descr {
        margin-bottom: 10px;
        line-height: 1.3;
        white-space: pre-wrap; 
        word-wrap: break-word;
    }
    &__subtitle {
        font-size: 14px;
        color: $color-black;
        opacity: 0.8;
    }
    &__line {
        margin-bottom: 10px;
    }
    &__link {
        display: flex;
        align-items: center;
        text-decoration: none;
        padding-bottom: 5px;
        span {
            color: $color-black;
            &.link {
                color: $color-blue;
            }
        }
    }
    &__soc {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 15px 0;
        &-item {
            margin: 0 5px;
            text-decoration: none;
            .v-icon {
                font-size: 28px;
                &.telegram {
                    color: #0088cc;
                }
                &.vk {
                    color: #2787F5;
                }
                &.instagram{ 
                    background-color: #d6249f;
                    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 28px;
                }
                &.whatsapp {
                    color: #25D366;
                }
            }
        }
    }
    &__reserve {
        text-align: center;
    }

    &__closer {
        position: absolute;
        right: 20px;
        top: 20px;
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
        padding: 15px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 10px;
        padding-right: 40px;
    }

    &__address {
        display: block;
        text-decoration: none;
        line-height: 1.25;
        &-title {
            font-weight: bold;
            color: $color-blue;
        }
        &-descr {
            font-size: 14px;
            color: $color-grey-dark;
        }
    }
}
</style>
