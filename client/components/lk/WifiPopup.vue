<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title QR-код для wi-fi
                p Введите данные
                input(type="text" placeholder="Название wi-fi сети" v-model='wifiName')
                input(type="text" placeholder="Пароль wi-fi сети" v-model='wifiPass')
                div
                    label(for="wifiWPA") WPA/WPA2
                    input(type="radio" id="wifiWPA" v-model="wifiType" checked name="wifiEnc" value="T:WPA;")
                div
                    label(for="wifiWEP") WEP
                    input(type="radio" id=" wifiWEP" v-model="wifiType" name="wifiEnc" value="T:WEP;")
                div
                    label(for="wifiNoEncryption") Без шифрования
                    input(type="radio" id="wifiNoEncryption" v-model="wifiType" name="wifiEnc" value="")

                v-btn(@click="printWifiCode()") Стилизовать и скачать

</template>

<script>
export default {
    data() {
        return {
            wifiName: '',
            wifiPass: '',
            wifiType: 'T:WPA;',
        }
    },
    mounted() {
        
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.wifiPopup.visible = false
        },
        printWifiCode() {
            if (this.wifiName !== '' || this.wifiPassp !== '') {
                const url = `WIFI:${this.wifiType}S:${this.wifiName};P:${this.wifiPass};;`
                this.$store.state.view.popup.wifiPopup.string = url
                
                this.$store.state.view.popup.styleQRPopup.place = this.$store.state.auth.user.places[0]
                this.$store.state.view.popup.tablesPopup.tables = null
                this.$store.state.view.popup.styleQRPopup.visible = true
            }
        }
    }
}
</script>

<style lang="scss">


</style>