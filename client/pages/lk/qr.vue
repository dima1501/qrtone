<template lang="pug">
    .qr(v-if="$store.state.auth.user")
        h1.qr__title QR-коды
        .qr__field
            .qr__field-content
                h2.qr__field-title QR-код меню
                // Текст если заведений несколько
                .qr__field-text Код открывает меню выбранного заведения, без привязки к столику 
                // Else
                // .qr__field-text Код открывает меню заведения, без привязки к столику
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
            .qr__field-pic
        .qr__field
            .qr__field-content
                h2.qr__field-title QR-коды столиков
                .qr__field-text Код открывает меню выбранного заведения с привязкой к столику. Дает возможность сделать заказ к столику, а также позвать официанта или попросить счет
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
            .qr__field-pic

        StyleQRPopup(
            v-if="$store.state.view.popup.styleQRPopup.visible"
        )
        TablesPopup(
            v-if="$store.state.view.popup.tablesPopup.visible"
        )

</template>

<script>
export default {
    layout: 'lk',
    data() {
        return {
            
        }
    },
    methods: {
        checkQRPlace(place) {
            this.$store.state.view.popup.styleQRPopup.place = place
        },
        checkMultiQRPlace(place) {
            this.$store.state.view.popup.tablesPopup.place = place
        },
        openStyleQRPopup() {
            this.$store.state.view.popup.tablesPopup.tables = null
            this.$store.state.view.popup.styleQRPopup.visible = true
        },
        openTablesPopup() {
            this.$store.state.view.popup.tablesPopup.visible = true
        }
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
    }
}
</style>
