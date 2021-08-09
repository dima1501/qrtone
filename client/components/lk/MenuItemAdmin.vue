<template lang="pug">
    .menu-item(v-bind:class="{ flash: flash }")
        .menu-item__img
            .menu-item__img-pic.placeholder(v-if="!item.images.length" v-bind:style="{ backgroundImage: 'url(../../food-placeholder.png)' }")

            picture(v-if="item.images.length == 1").menu-item__img-pic
                source(:srcset="`../../uploads/171-${item.images[0]}.webp 1x, ../../uploads/342-${item.images[0]}.webp 2x`" type="image/webp" media="(max-width: 380px)")
                source(:srcset="`../../uploads/196-${item.images[0]}.webp 1x, ../../uploads/392-${item.images[0]}.webp 2x`" type="image/webp" media="(max-width: 430px)")
                source(:srcset="`../../uploads/255-${item.images[0]}.webp 1x, ../../uploads/520-${item.images[0]}.webp 2x`" type="image/webp" media="(max-width: 600px)")
                source(:srcset="`../../uploads/400-${item.images[0]}.webp 1x, ../../uploads/800-${item.images[0]}.webp 2x`" type="image/webp" media="(min-width: 601px)")
                img(:src="`../../uploads/400-${item.images[0]}`" :srcset="`../../uploads/400-${item.images[0]} 1x, ../../uploads/800-${item.images[0]} 2x`" alt="Изображения")

            VueSlickCarousel(:arrows="true" :dots="false" v-if="item.images.length > 1")
                picture(v-for="(image, key) in item.images" :key="key" ).menu-item__img-pic
                    source(:srcset="`../../uploads/171-${image}.webp 1x, ../../uploads/342-${image}.webp 2x`" type="image/webp" media="(max-width: 380px)")
                    source(:srcset="`../../uploads/196-${image}.webp 1x, ../../uploads/392-${image}.webp 2x`" type="image/webp" media="(max-width: 430px)")
                    source(:srcset="`../../uploads/255-${image}.webp 1x, ../../uploads/520-${image}.webp 2x`" type="image/webp" media="(max-width: 600px)")
                    source(:srcset="`../../uploads/400-${image}.webp 1x, ../../uploads/800-${image}.webp 2x`" type="image/webp" media="(min-width: 601px)")
                    img(:src="`../../uploads/400-${image}`" :srcset="`../../uploads/400-${image} 1x, ../../uploads/800-${image} 2x`" alt="Изображения")


        .menu-item__content
            .menu-item__content-inner

                .menu-item__name
                    .menu-item__name-translation {{item.translation}}
                    .menu-item__name-title {{item.name}}

                .menu-item__prices(v-if="item.modifications")
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
            this.$confirm({
                message: `Вы действительно хотите удалить "${this.item.name}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch("lk/deleteMenuItem", this.item)
                        this.item.images.forEach(element => {
                            this.$store.dispatch("lk/deletePic", element)
                        })
                    }
                }
            })
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

.slick-dots {
    bottom: 12px;
    padding-left: 0 !important;
}

.slick-dots li button, .slick-dots li {
    width: 15px;
    height: 15px;
}

</style>

