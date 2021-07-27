<template lang="pug">
    .popup
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title QR-код для wi-fi

                v-form(
                    @submit.prevent="printWifiCode()"
                    v-model="isFormValid")
                    v-text-field(
                        v-model="wifiName"
                        label="Название Wi-Fi сети"
                        required
                        :rules="[!!wifiName || 'Введите название Wi-Fi сети']"
                        hide-details="auto")
                    v-text-field(
                        v-model="wifiPass"
                        label="Пароль Wi-Fi сети"
                        required
                        :rules="radioGroup !== 'false' ? wifiPassRules : [true]"
                        hide-details="auto")

                    v-radio-group(v-model="radioGroup")
                        v-radio(
                            label="WPA/WPA2"
                            value="T:WPA;"
                            checked)
                        v-radio(
                            label="WEP"
                            value="T:WEP;")
                        v-radio(
                            label="Без шифрования"
                            value="false")

                //- div
                //-     label(for="wifiWPA") WPA/WPA2
                //-     input(type="radio" id="wifiWPA" v-model="wifiType" checked name="wifiEnc" value="T:WPA;")
                //- div
                //-     label(for="wifiWEP") WEP
                //-     input(type="radio" id=" wifiWEP" v-model="wifiType" name="wifiEnc" value="T:WEP;")
                //- div
                //-     label(for="wifiNoEncryption") Без шифрования
                //-     input(type="radio" id="wifiNoEncryption" v-model="wifiType" name="wifiEnc" value="")

                v-btn(
                    depressed
                    color="blue"
                    :disabled="!isFormValid"
                    @click="printWifiCode()").white--text Далее

</template>

<script>
export default {
    data() {
        return {
            isFormValid: true,
            radioGroup: 'T:WPA;',
            wifiName: '',
            wifiPass: '',
            wifiType: 'T:WPA;',
            wifiPassRules: [
                (e) => !!e || 'Введите название Wi-Fi сети',
                (e) => e.length > 7 || 'Мин. длина 8 символов',
            ]
        }
    },
    mounted() {
        
    },
    methods: {
        closePopup() {
            

            this.$confirm({
                message: `Завершить создание QR-кода для wi-fi?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (confirm) {
                        this.$store.state.view.popup.wifiPopup.visible = false
                    }
                }
            })
        },
        printWifiCode() {
            const url = `WIFI:${this.radioGroup !== 'false' ? this.radioGroup : ''}S:${this.wifiName};P:${this.wifiPass};;`
            
            this.$store.state.view.popup.styleQRPopup.type = "wifi"

            this.$store.state.view.popup.wifiPopup.string = url
            this.$store.state.view.popup.styleQRPopup.place = this.$store.state.auth.user.places[0]
            this.$store.state.view.popup.tablesPopup.tables = null
            this.$store.state.view.popup.wifiPopup.visible = false
            this.$store.state.view.popup.styleQRPopup.visible = true
        }
    }
}
</script>

<style lang="scss">


</style>