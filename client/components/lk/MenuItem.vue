<template lang="pug">
    .menu-item(v-bind:class="{ flash: flash }")
        //- .menu-item__more(@click="openDetail(item)")
        .menu-item__more(@click="openDetail(item)")
        .menu-item__img
            .menu-item__img-pic.placeholder(v-if="!item.images.length" v-bind:style="{ backgroundImage: 'url(../../food-placeholder.png)' }")

            picture(v-if="item.images.length == 1").menu-item__img-pic
                source(:srcset="`../../uploads/171-${item.images[0]}.webp 1x, ../../uploads/342-${item.images[0]}.webp 2x`" type="image/webp" media="(max-width: 380px)")
                source(:srcset="`../../uploads/196-${item.images[0]}.webp 1x, ../../uploads/392-${item.images[0]}.webp 2x`" type="image/webp" media="(max-width: 430px)")
                source(:srcset="`../../uploads/255-${item.images[0]}.webp 1x, ../../uploads/520-${item.images[0]}.webp 2x`" type="image/webp" media="(min-width: 431px)")
                img(:src="`../../uploads/400-${item.images[0]}`" :srcset="`../../uploads/400-${item.images[0]} 1x, ../../uploads/800-${item.images[0]} 2x`" :alt="`${item.name}, ${$store.state.guest.companyData.name}, qrtone.com`" loading="lazy")

            VueSlickCarousel(:arrows="true" :dots="false" v-if="item.images.length > 1")
                picture(v-for="(image, key) in item.images" :key="key" ).menu-item__img-pic
                    source(:srcset="`../../uploads/171-${image}.webp 1x, ../../uploads/342-${image}.webp 2x`" type="image/webp" media="(max-width: 380px)")
                    source(:srcset="`../../uploads/196-${image}.webp 1x, ../../uploads/392-${image}.webp 2x`" type="image/webp" media="(max-width: 430px)")
                    source(:srcset="`../../uploads/255-${image}.webp 1x, ../../uploads/520-${image}.webp 2x`" type="image/webp" media="(min-width: 431px)")
                    img(:src="`../../uploads/400-${image}`" :srcset="`../../uploads/400-${image} 1x, ../../uploads/800-${image} 2x`" :alt="`${item.name}, ${$store.state.guest.companyData.name}, qrtone.com`" loading="lazy")

        .menu-item__content
            .menu-item__content-inner
                .menu-item__vegan(v-if="item.isVegan") Вегетарианское

                .menu-item__name
                    .menu-item__name-translation {{item.translation}}
                    .menu-item__name-title {{item.name}}
                    .menu-item__name-descr(v-if="item.description") {{item.description}}
                    
                .menu-item__data
                    .menu-item__data-calories(v-if="item.weights[0]") {{ item.weights[0] }}г 
                
                .menu-item__options(v-if="item.prices.length > 1")
                    span.menu-item__options-label Еще {{ item.prices.length - 1 }} 
                    span.menu-item__options-label(v-if="item.prices.length - 1 == 1") вариант
                    span.menu-item__options-label(v-if="item.prices.length - 1 > 1 && item.prices.length - 1 < 5") варианта
                    span.menu-item__options-label(v-if="item.prices.length - 1 > 4 && item.prices.length - 1 < 21") вариантов

            .menu-item__bottom
                transition(name="slide-fade" mode="out-in")
                    .menu-item__button(
                        key="10"
                        @click="plusMulti"
                        v-if="!$store.state.guest.user.cart[$store.state.guest.companyData.place._id] || !$store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id)")
                        //- span(v-if="item.prices.length > 1") Еще {{item.prices.length}} 
                        span {{ item.prices[checkedPrice] }}{{$store.state.guest.companyData.currencySymbol}}
                    .menu-item__counter(key="11" v-if="$store.state.guest.user.cart[$store.state.guest.companyData.place._id] && $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id)")
                        .menu-item__counter-control(@click="item.prices.length > 1 ? openDetail(item) : minusMulti()")
                            v-icon mdi-minus
                        .menu-item__counter-value {{ $store.state.guest.user.cart[$store.state.guest.companyData.place._id].goods.find(e => e._id == item._id).count }} 
                            span.menu-item__counter-value-price(v-if="item.prices.length == 1")  x {{item.prices[0]}}{{$store.state.guest.companyData.currencySymbol}}
                        .menu-item__counter-control(@click="item.prices.length > 1 ? openDetail(item) : plusMulti()")
                            v-icon mdi-plus

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
        openDetail(item) {
            this.$router.push({path: $nuxt.$route.fullPath, query: {d: 1}})
            document.documentElement.style.overflow = 'hidden'
        // document.documentElement.style.height = '100%'
        // document.documentElement.style.overscrollBehavior = 'none'
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

