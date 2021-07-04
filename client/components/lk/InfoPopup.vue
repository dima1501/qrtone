<template lang="pug">
    .info-popup
        .info-popup__container
            .info-popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .info-popup__content
                h2.info-popup__title {{ $store.state.guest.companyData.name }}
                div.info-popup__descr(v-if="$store.state.guest.companyData.description") {{ $store.state.guest.companyData.description }}
                div(v-if="place.phone")
                    .info-popup__subtitle Телефон:
                    a(:href="`tel:${place.phone}`").info-popup__link
                        span.link {{ place.phone }}
                div(v-if="place.address.full")
                    .info-popup__subtitle Адрес:
                    a(:href="`http://maps.google.com/?q=${$store.state.guest.companyData.name}, ${place.address.full}`" target="_blank").info-popup__address
                        span.info-popup__address-title.link {{ place.address.value }}<br>
                        span.info-popup__address-descr.link {{ place.address.description }}
                div(v-if="place.website") 
                    .info-popup__subtitle Сайт:
                    a(:href="`${place.website.includes('http') ? '' : 'https://'}${place.website}`" target="_blank").info-popup__link
                        span.link {{ place.website }}
                div(v-if="place.addr") 
                    .info-popup__subtitle Место:
                    a(:href="`https://yandex.ru/maps/?ll=37.62,55.75&z=12`" target="_blank").info-popup__link
                        span.link {{ place.addr }}
                div(v-if="place.times") 
                    .info-popup__subtitle График:
                    div.info-popup__link
                        span {{ place.times }}
                .info-popup__soc
                    a(:href="`https://t.me/${place.telegram}`" target="_blank" v-if="place.telegram").info-popup__soc-item
                        v-icon.telegram mdi-telegram
                    a(:href="`https://vk.com/${place.vk}`" target="_blank" v-if="place.vk").info-popup__soc-item
                        v-icon.vk mdi-vk
                    a(:href="`https://www.instagram.com/${place.instagram}`" target="_blank"  v-if="place.instagram").info-popup__soc-item
                        v-icon.instagram mdi-instagram 
                    a(:href="`https://wa.me/${place.whatsapp}`" target="_blank"  v-if="place.whatsapp").info-popup__soc-item
                        v-icon.whatsapp mdi-whatsapp
                // Будет когда будет todo
                //- .info-popup__reserve Забронировать
</template>

<script>
export default {
    props: {
        place: Object
    },
    data() {
        return {
            
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.infoPopup = false
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
    &__link {
        display: flex;
        align-items: center;
        text-decoration: none;
        padding-bottom: 5px;
        margin-bottom: 5px;
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
        padding: 10px;
        color: $color-black;
        text-decoration: underline;
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
