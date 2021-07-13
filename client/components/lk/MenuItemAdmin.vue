<template lang="pug">
    .menu-item(v-bind:class="{ flash: flash }")
        .menu-item__img
            .menu-item__img-pic(v-if="item.images.length == 1" v-bind:style="{ backgroundImage: 'url(../../uploads/' + item.images[0] + ')' }")
            VueSlickCarousel(:arrows="false" :dots="true" v-if="item.images.length > 1")
                .menu-item__img-pic(v-for="(image, key) in item.images" :key="key" :style="{ backgroundImage: 'url(../../uploads/' + image + ')' }")
        .menu-item__content
            .menu-item__content-inner
                .menu-item__name {{ item.name }}
                .menu-item__translation(v-if="item.translation") {{ item.translation }} (en)

                .menu-item__price(v-if="item.modifications")
                    div.menu-item__price-label.-admin(v-for="(mod, key) in item.prices")
                        div
                            span {{ item.prices[key] }}{{$store.state.auth.user.currencySymbol}} 
                            span(v-if="item.weights[key]") &bull; {{ item.weights[key] }}г
                            span(v-if="item.calories[key]")  &bull; {{ item.calories[key] }} Ккал
                        div
                            span(v-if="item.modifications[key]") {{ item.modifications[key] }}

            .menu-item__bottom
                .menu-item__bottom-item
                    v-btn(
                        depressed
                        color="normal"
                        @click="openEditPopup()"
                    ).e-card__bottom-item Изменить
                .menu-item__bottom-item
                    v-btn.red--text(
                        depressed
                        color="normal"
                        @click="removeMenuItem()"
                    ).e-card__bottom-item Удалить
                .menu-item__bottom-item.handles
                    v-icon(light) mdi-drag

</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
    props: {
        item: Object,
        placeId: String
    },
    components: {
        VueSlickCarousel
    },
    data() {
        return {
            checkedPrice: 0,
            flash: false
        }
    },
    methods: {
        removeMenuItem() {
            let confirmation = confirm(`Вы действительно хотите удалить "${this.item.name}"?`)
            if (confirmation) {
                this.$store.dispatch("lk/deleteMenuItem", this.item)
                this.item.images.forEach(element => {
                    this.$store.dispatch("lk/deletePic", element)
                })
            }
        },
        openEditPopup() {
            this.$emit('openEditPopup', this.item)
        },
        openDetail(item) {
            this.flashCard()
            this.$store.dispatch('guest/openDetail', {
                item, checkedPrice: this.checkedPrice
            })
        },
        getPlaceId() {
            return this.$store.state.guest.companyData.places.find(e => e.link == this.placeId)._id
        },
        plusMulti() {
            if (this.item.prices.length > 1) {
                this.openDetail(this.item)
            } else {
                this.flashCard()
                this.$store.dispatch('guest/addToCart', {
                    place: this.placeId,
                    item: this.item,
                    price: this.checkedPrice
                })
            }
        },
        minusMulti() {
            if (this.item.prices.length > 1) {
                this.openDetail(this.item)
            } else {
                this.flashCard()
                this.$store.dispatch('guest/minusCartItemMulti', {
                    place: this.placeId,
                    item: this.item,
                    price: this.checkedPrice
                })
            }
        },
        flashCard() {
            if (!this.flash) {
                this.flash = true
                const timer = setInterval(() => {
                    this.flash = false
                    clearInterval(timer)
                }, 50);
            }
        }
    }
}
</script>

<style lang="scss">
.menu-item {
    width: 100%;
    position: relative;
    transition: transform .1s;
    background-color: #fff;
    border-radius: 14px;
    box-shadow: 0 0 20px rgba(0,0,0,0.15);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.flash {
        transform: scale(0.95);
    }
    &__img {
        &-pic {
            background-position: center;
            background-size: cover;
            &:after {
                content: "";
                display: block;
                padding-bottom: 100%;
            }
            @media screen and (min-width: 768px) {
                // height: 20vw;
            }
        }
    }
    &__content {
        padding: 8px;
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        &-inner {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
    &__button {
        width: 100%;
        padding: 7px 10px;
        background-color: rgb(224, 223, 223);
        border-radius: 14px;
        margin-top: 10px;
        font-size: 16px;
        text-transform: none;
        cursor: pointer;
        position: relative;
        z-index: 4;
        text-align: center;
        &:after {
            content: '';
            position: absolute;
            left: -5px;
            right: -5px;
            top: -5px;
            bottom: -5px;
        }
    }
    &__bottom {
        width: 100%;
        display: flex;
        align-items: center;
        &-item {
            margin-top: 10px;
            .v-btn {
                margin-left: 0;
            }
            &.handles {
                cursor: pointer;
                position: relative;
                &:after {
                    content: '';
                    position: absolute;
                    left: -5px;
                    top: -5px;
                    right: -5px;
                    bottom: -5px;
                }
            }
        }
    }
    &__more {
        position: absolute;
        z-index: 3;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
    }
    &__counter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-radius: 14px;
        margin-top: 10px;
        position: relative;
        z-index: 4;

        &-control {
            border-radius: 5px;
            background-color: rgb(224, 223, 223);
            width: 38px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 14px;
            cursor: pointer;
            .v-icon {
                pointer-events: none;
            }
        }
    }
    &__price {
        line-height: 14px;
        &-radio {
            visibility: hidden;
            opacity: 0;
            position: absolute;
        }
        &-label {
            color: rgb(163, 163, 163);
            font-size: 14px;
            line-height: 1.3;
            &.-admin {
                display: flex;
                flex-direction: column;
                padding-bottom: 5px;
                margin-bottom: 5px;
                border-bottom: 1px solid rgb(163, 163, 163);
                &:last-child {
                    margin-bottom: 0;
                    border: none;
                }
            }
        }
    }
    &__name {
        margin-bottom: 4px;
        line-height: 1.3;
    }
    &__translation {
        font-size: 14px;
    }
}
</style>

