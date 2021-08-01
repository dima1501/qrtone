<template lang="pug">
    .qr(v-if="$store.state.auth.user")
        h1.qr__title QR-коды

        .qr__field
            .qr__field-content
                h2.qr__field-title QR-код меню
                .qr__field-text(v-if="$store.state.auth.user.places.length > 1") Код открывает меню выбранного заведения, без привязки к столику 
                .qr__field-text(v-else) Код открывает меню заведения, без привязки к столику
                
                div(v-if="$store.state.auth.user.places.length")
                    v-select(:items="$store.state.auth.user.places" v-model="checkedSimplePlace" label="Выберите заведение" item-text="name" item-value="_id" hide-details="auto" v-on:change="checkQRPlace").qr__field-select
                    v-btn(
                        depressed
                        color="primary"
                        :disabled="!checkedSimplePlace"
                        @click="openStyleQRPopup('simple')").white--text Создать

                div(v-else)
                    v-btn(
                        depressed 
                        color="primary"
                        @click="openAddPlacePopup") Добавить заведение

        .qr__field
            .qr__field-content
                h2.qr__field-title QR-коды столиков
                .qr__field-text Код открывает меню выбранного заведения с привязкой к столику. Дает возможность сделать заказ к столику, а также позвать официанта или попросить счет
                
                div(v-if="isAvailable")
                    div(v-if="$store.state.auth.user.places.length")
                        v-select(:items="$store.state.auth.user.places" v-model="checkedMultiPlace" label="Выберите заведение" item-text="name" item-value="_id" hide-details="auto" v-on:change="checkMultiQRPlace").qr__field-select
                        v-btn(
                            depressed
                            color="primary"
                            :disabled="!checkedMultiPlace"
                            @click="openTablesPopup()") Создать

                    div(v-else)
                        v-btn(
                            depressed 
                            color="primary"
                            @click="openAddPlacePopup") Добавить заведение

                div(v-else)
                    v-btn(
                        depressed
                        color="primary"
                        to="/lk/settings") Доступно с Premium

        .qr__field
            .qr__field-content
                h2.qr__field-title QR-код Wi-Fi
                .qr__field-text Можно отсканировать и сразу подключиться к wi-if, пароль вводить не нужно
                v-btn(
                    depressed
                    color="primary"
                    @click="openWifiPopup()") Создать

        StyleQRPopup(
            v-if="$store.state.view.popup.styleQRPopup.visible"
        )
        TablesPopup(
            v-if="$store.state.view.popup.tablesPopup.visible"
        )
        PDFPopup(
            v-if="$store.state.view.popup.PDFPopup.visible"
        )
        WifiPopup(
            v-if="$store.state.view.popup.wifiPopup.visible"
        )

</template>

<script>
import moment from 'moment'

export default {
    layout: 'lk',
    data() {
        return {
            checkedSimplePlace: null,
            checkedMultiPlace: null
        }
    },
    computed: {
        isAvailable() {
            const isStandart = this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].type == 'standart'
            const isNotExpired = !moment(this.$store.state.auth.user.subscription[this.$store.state.auth.user.subscription.length - 1].expires).isBefore()
            const isTrial = !moment(this.$store.state.auth.user.subscription[0].expires).isBefore()
            return !isStandart && isNotExpired || isTrial
        }
    },
    methods: {
        openAddPlacePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = true
        },
        checkQRPlace(place) {
            const findPlace = this.$store.state.auth.user.places.find(e => e._id == place)
            this.$store.state.view.popup.styleQRPopup.place = findPlace
        },
        checkMultiQRPlace(place) {
            const findPlace = this.$store.state.auth.user.places.find(e => e._id == place)
            this.$store.state.view.popup.tablesPopup.place = findPlace
        },
        openStyleQRPopup(type) {
            this.$store.state.view.popup.tablesPopup.tables = []
            this.$store.state.view.popup.styleQRPopup.visible = true
            this.$store.state.view.popup.styleQRPopup.type = type
        },
        openTablesPopup(place) {
            if (place) {
                this.$store.state.view.popup.tablesPopup.place = place
            }
            this.$store.state.view.popup.tablesPopup.tables = [ ...this.$store.state.view.popup.tablesPopup.place.tables]
            this.$store.state.view.popup.tablesPopup.visible = true
        },
        openWifiPopup() {
            this.$store.state.view.popup.wifiPopup.visible = true
        }
    }
}
</script>

<style lang="scss">
.qr {
    &__title {
        margin-bottom: 20px;
        color: $color-black;
    }
    &__field {
        border: 3px solid #F5F7FB;
        box-shadow: 0 0 20px rgb(0 0 0 / 20%);
        border-radius: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        max-width: 400px;
        &:last-child {
            margin-bottom: 0;
        }
        &-content {
            width: 100%;
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
            color: $color-blue;
            text-decoration: underline;
        }
        &-title {
            color: $color-black;
        }
        &-text {
            margin-bottom: 15px;
            color: $color-black;
            line-height: 1.35;
        }
        &-select {
            margin-bottom: 15px;
        }
    }
}
</style>
