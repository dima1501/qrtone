<template lang="pug">
    .board(v-if="$store.state.auth.user && !loading")
            .board__choose(v-if="!place" key="check_place")
                .board__choose-content
                    .board__choose-title Выберите заведение
                    .board__choose-row
                        .board__choose-item(v-for="(place, key) in $store.state.auth.user.places" :key="place._id")
                            .board__choose-item-name {{ place.name }}
                            .board__choose-item-addr {{ place.address.full }}
                            v-btn(depressed color="normal" @click="changePlace(place._id)").board__choose-item-btn Выбрать

            .board__main(v-if="place" key="place_checked")
                .board__main-select
                    v-select(:items="$store.state.auth.user.places" v-model="place" label="Выберите заведение" item-text="name" item-value="_id" @change="changePlace")
                .board__main-content
                    .board__main-content-section.-main(:class="{ visible: mobileVisible == 'main' }")
                        .board__main-content-section-top Заказы <span v-if="getPendingOrders">{{ getPendingOrders }}</span>
                            span.toggler(@click="toggleMobileSection('aside')") Уведомления <span v-if="getPendingNotifications">{{ getPendingNotifications }}</span>

                        transition(name="slide-fade" mode="out-in")
                            .board__main-content-section-loading(v-if="$store.state.view.loading.orders" key="orders_loader")
                                v-icon(light) mdi-loading

                            .board__main-content-section-content(v-else key="orders_content")
                                vuescroll(:ops="ops" ref="vss")
                                    transition-group(type="transition" name="flip-list")
                                        OrderCard(v-for="(order, key) in $store.state.auth.user.orders" :key="order.orderId" v-bind:order="order")

                                    .board__main-content-link(@click="loadMoreOrders" v-if="$store.state.auth.user.orders.length && !$store.state.view.loading.moreOrders") Загрузить еще 

                                    .board__main-content-loader(v-if="$store.state.view.loading.moreOrders")
                                        v-icon(light) mdi-loading              
                            
                    .board__main-content-section.-aside(:class="{ visible: mobileVisible == 'aside' }")
                        .board__main-content-section-top Уведомления <span v-if="getPendingNotifications">{{ getPendingNotifications }}</span>
                            span.toggler(@click="toggleMobileSection('main')") Заказы <span v-if="getPendingOrders">{{ getPendingOrders }}</span>
                        transition(name="slide-fade" mode="out-in")
                            .board__main-content-section-loading(v-if="$store.state.view.loading.notifications" key="notify_loader")
                                v-icon(light) mdi-loading
                            .board__main-content-section-content(v-else key="notify_content")
                                vuescroll(:ops="ops" ref="vsss")
                                    transition-group(type="transition" name="flip-list")
                                        NotificationCard(v-for="(notify, key) in $store.state.auth.user.notifications" :key="notify._id" v-bind:notify="notify")

                                    .board__main-content-link(@click="loadMoreNotifications" v-if="$store.state.auth.user.notifications.length && !$store.state.view.loading.moreNotifications") Загрузить еще 

                                    .board__main-content-loader(v-if="$store.state.view.loading.moreNotifications")
                                        v-icon(light) mdi-loading     

</template>

<script>

import Vue from 'vue';
import vuescroll from 'vuescroll';
import moment from 'moment';

Vue.use(vuescroll);

const axios = require('axios').default

export default {
    layout: 'lk',
    components: {
        vuescroll
    },
    data() {
        return {
            mobileVisible: 'main',
            loading: true,
            orders: [],
            place: '',
            ops: {
                vuescroll: {
                    mode: 'native',
                    sizeStrategy: 'percent',
                    detectResize: true,
                    locking: false,
                },
                scrollPanel: {
                    initialScrollY: 0,
                    initialScrollX: 0,
                    speed: 250,
                    easing: 'easeInQuad',
                    verticalNativeBarPos: 'right'
                },
                rail: {
                    background: '#fff',
                    opacity: 1,
                    size: '3px',
                    specifyBorderRadius: false,
                    gutterOfEnds: null,
                    gutterOfSide: '2px',
                    keepShow: false
                },
                bar: {
                    showDelay: 500,
                    onlyShowBarOnScroll: false,
                    keepShow: false,
                    background: '#000',
                    opacity: 1,
                    hoverStyle: false,
                    specifyBorderRadius: false,
                    minSize: 0,
                    size: '3px',
                    disable: false
                }
            }
        }
    },
    mounted() {
        const place = localStorage.getItem("place")
        if (place) {
            this.place = place
        }
        this.loading = false
    },
    computed: {
        getPendingOrders() {
            return this.$store.state.auth.user.orders.filter(e => e.status == 'pending').length
        },
        getPendingNotifications() {
            return this.$store.state.auth.user.notifications.filter(e => e.status == 'pending').length
        },
        isAvailable() {
            const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        }
    },
    methods: {
        toggleMobileSection(name) {
            this.mobileVisible = name
        },
        loadMoreOrders() {
            this.$store.dispatch('lk/loadMoreOrders', { place: this.place, items: this.$store.state.auth.user.orders.length } )
        },
        loadMoreNotifications() {
            this.$store.dispatch('lk/loadMoreActions', { place: this.place, items: this.$store.state.auth.user.notifications.length } )
        },
        changePlace(place) {
            if (place) {
                this.place = place
            }

            localStorage.setItem("place", this.place);
            this.$store.dispatch('lk/setPlaceSocketId', {
                place: this.place,
                socketId: this.$nuxt.$socket.id
            })
            this.$store.dispatch('lk/loadOrders', { place: this.place, items: 0 } )
            this.$store.dispatch('lk/loadActions', { place: this.place, items: 0 })
        }
    },
}
</script>

<style lang="scss">
@keyframes load {
 0% { transform: rotate(0deg) }
 100% { transform: rotate(360deg) }
}

.board {
    display: flex;
    @media screen and (min-width: 768px) {
        min-height: calc(100vh - 40px);
    }

    @media screen and (min-width: 1024px) {
        min-height: calc(100vh - 60px);
    }
    
    &__choose {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        &-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        &-row {
            display: flex;
            flex-wrap: wrap;
        }
        &-item {
            padding: 15px;
            border-radius: 14px;
            border: 3px solid #F5F7FB;
            box-shadow: 0 0 20px rgb(0 0 0 / 10%);
            transition: box-shadow .3s;
            margin: 0 15px 15px 0;
            max-width: 255px;
            display: flex;
            flex-direction: column;
            &:hover {
                box-shadow: 0 0 20px rgb(0 0 0 / 20%);
            }
            &:last-child {
                margin-right: 0;
            }
            &-name {
                font-size: 18px;
                font-weight: bold;
            }
            &-addr {
                font-size: 14px;
                color: rgb(182, 182, 182);
                line-height: 1.3;
                margin-bottom: 15px;
            }
            &-btn {
                margin-top: auto;
            }
        }
    }

    &__main {
        width: 100%;
        display: flex;
        flex-direction: column;
        @media screen and (min-width: 1280px) {
            
        }
        &-select {
            max-width: 320px;
            padding-right: 40px;
            @media screen and (min-width: 1024px) {
                padding-right: 0;
            }
        }
        &-content {
            display: flex;
            height: 100%;
            &-section {
                border-radius: 14px;
                border: 3px solid #F5F7FB;
                box-shadow: 0 0 20px rgb(0 0 0 / 10%);
                height: calc(100vh - 110px);
                // height: calc(var(--vh, 1vh) * 100 - 110px);
                background-color: #eef1f8;
                overflow: hidden;
                @media screen and (min-width: 1024px) {
                    height: calc(100vh - 130px);
                }
                display: none;
                opacity: 0;
                transition: opacity .3s;
                width: 100%;
                &.visible {
                    display: block;
                    opacity: 1;
                }
                @media screen and (min-width: 768px) {
                    display: block;
                    opacity: 1;
                }
                &.-main {
                    @media screen and (min-width: 768px) {
                        width: 50%;
                        flex-shrink: 0;
                        margin-right: 15px;
                    }
                    @media screen and (min-width: 1280px) {
                        width: 500px;
                        margin-right: 30px;
                    }
                }
                &.-aside {
                    
                    @media screen and (min-width: 768px) {
                        width: 50%;
                    }
                    @media screen and (min-width: 1280px) {
                        width: 400px;
                        flex-shrink: 0;
                    }
                }
                &-top {
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: bold;
                    padding: 10px 20px;
                    box-shadow: 0 0 20px rgb(0 0 0 / 5%);
                    @media screen and (min-width: 768px) {
                        font-size: 22px;
                    }
                    span {
                        color: $color-blue;
                        border-radius: 50%;
                        margin-left: 5px;
                        &.toggler {
                            font-size: 14px;
                            margin-left: auto;
                            font-weight: lighter;
                            span {
                                font-weight: bold;
                            }
                            @media screen and (min-width: 768px) {
                                display: none;
                            }
                        }
                    }
                }
                &-content {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 166px);
                    @media screen and (min-width: 1024px) {
                        height: calc(100vh - 189px);
                    }
                }
                &-loading {
                    font-size: 24px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                    .v-icon {
                        font-size: 36px;
                        color: $color-blue;
                        animation: load 1s ease-in-out infinite;
                    }
                }
            }
            &-link {
                text-align: center;
                padding: 15px 0;
                color: $color-blue;
                cursor: pointer;
            }
            &-loader {
                font-size: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 54px;
                .v-icon {
                    font-size: 36px;
                    color: $color-blue;
                    animation: load 1s ease-in-out infinite;
                }
            }
        }
    }

    &__orders {
        flex-grow: 1;
        padding-right: 20px;
    }
    &__aside {
        width: 300px;
        flex-shrink: 0;
    }
    &__top {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-time {
            font-weight: bold;
        }
    }
    &__place {
        margin-bottom: 20px;
    }
    &__section {
        width: 100%;
        margin-bottom: 30px;
        &-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        &-orders {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column-reverse;
            
            &-item {
                // width: calc(33.3333% - 20px);
                margin-right: 20px;
                margin-bottom: 20px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}
@import '../../assets/sorder.scss';
</style>

