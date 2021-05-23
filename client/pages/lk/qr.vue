<template lang="pug">
    .qr(v-if="$store.state.auth.user")
        h1.qr__title QR-коды
        .qr__field
            .qr__field-content
                h2.qr__field-title QR-код меню
                // Текст если заведений несколько
                .qr__field-text(v-if="$store.state.auth.user.places.length > 1") Код открывает меню выбранного заведения, без привязки к столику 
                // Else
                .qr__field-text(v-else) Код открывает меню заведения, без привязки к столику

                div(v-if="$store.state.auth.user.places.length > 1")
                    .qr__field-text Выберите заведение:
                    .qr__field-line(v-for="place in $store.state.auth.user.places")
                        input(
                            type="radio" 
                            :id='`simple_${place._id}`' 
                            name='simpleQR'
                            v-on:change="checkQRPlace(place)" )
                        label(:for='`simple_${place._id}`' ) {{ place.name }}
                    v-btn(
                        color="primary"
                        text
                        :disabled="!$store.state.view.popup.styleQRPopup.place"
                        @click="openStyleQRPopup"
                    ) Стилизовать и скачать
                div(v-else-if="$store.state.auth.user.places.length == 1")
                    div для {{$store.state.auth.user.places[0].name}}
                    v-btn(
                        color="primary"
                        text
                        @click="openStyleQRPopup(e, $store.state.auth.user.places[0])"
                    ) Стилизовать и скачать
                div(v-else)
                    .button.-black(@click="openAddPlacePopup") Добавить заведение

            .qr__field-pic
        .qr__field
            .qr__field-content
                h2.qr__field-title QR-коды столиков
                .qr__field-text Код открывает меню выбранного заведения с привязкой к столику. Дает возможность сделать заказ к столику, а также позвать официанта или попросить счет
                
                div(v-if="isAvailable")
                    div(v-if="$store.state.auth.user.places.length > 1")
                        .qr__field-text Выберите заведение:
                        .qr__field-line(v-for="place in $store.state.auth.user.places")
                            input(
                                type="radio" 
                                :id='`multi_${place._id}`'  
                                name='multiQR'
                                v-on:change="checkMultiQRPlace(place)" )
                            label(:for='`multi_${place._id}`') {{ place.name }}
                        v-btn(
                            color="primary"
                            text
                            :disabled="!$store.state.view.popup.tablesPopup.place"
                            @click="openTablesPopup"
                        ) Управление столиками
                    div(v-else-if="$store.state.auth.user.places.length == 1")
                        .qr__field-text Для {{$store.state.auth.user.places[0].name}}
                        v-btn(
                            color="primary"
                            text
                            @click="openTablesPopup(e, $store.state.auth.user.places[0])"
                        ) Управление столиками
                    div(v-else)
                        .button.-black(@click="openAddPlacePopup") Добавить заведение


                div(v-else)
                    v-btn(
                        color="primary"
                        text
                        to="/lk/settings"
                    ) Доступно с Premium
            .qr__field-pic

        StyleQRPopup(
            v-if="$store.state.view.popup.styleQRPopup.visible"
        )
        TablesPopup(
            v-if="$store.state.view.popup.tablesPopup.visible"
        )

</template>

<script>
import moment from 'moment';

export default {
    layout: 'lk',
    data() {
        return {
            
        }
    },
    computed: {
        isAvailable() {
            const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
            // const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired
        }
    },
    methods: {
        openAddPlacePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = true
        },
        checkQRPlace(place) {
            this.$store.state.view.popup.styleQRPopup.place = place
        },
        checkMultiQRPlace(place) {
            this.$store.state.view.popup.tablesPopup.place = place
        },
        openStyleQRPopup(e, place) {
            if (place) {
                this.$store.state.view.popup.styleQRPopup.place = place
            }
            this.$store.state.view.popup.tablesPopup.tables = null
            this.$store.state.view.popup.styleQRPopup.visible = true
        },
        openTablesPopup(e, place) {
            if (place) {
                this.$store.state.view.popup.tablesPopup.place = place
            }
            this.$store.state.view.popup.tablesPopup.visible = true
        }
    },
    beforeDestroy() {
        this.$store.state.view.popup.styleQRPopup.place = null
        this.$store.state.view.popup.tablesPopup.place = null
    }
}
</script>

<style lang="scss">
.qr {
    &__title {
        margin-bottom: 20px;
    }
    &__field {
        background: #F5F7FB;
        border-radius: 15px;
        padding: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        max-width: 650px;
        &:last-child {
            margin-bottom: 0;
        }
        &-content {
            width: 100%;
            max-width: 350px;
            margin-right: 20px;
        }
        &-pic {
            margin-left: auto;
            width: 160px;
            height: 160px;
            background-color: #fff;
        }
        &-download {
            cursor: pointer;
            margin-top: 15px;
            color: rgb(14, 98, 177);
            text-decoration: underline;
        }
        &-text {
            margin-bottom: 15px;
        }
    }
}
</style>
