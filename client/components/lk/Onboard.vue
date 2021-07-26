<template lang="pug">
.popup(v-if="$store.state.auth.user")
    .popup__container
        .popup__content
            .onboard
                .onboard__section(v-if="step == 1")
                    .onboard__title Добро пожаловать<br> на <span>qrtone.com</span>
                    .onboard__text Для начала работы необходимо заполнить данные о компании
                    .onboard__text Также будет возможность ознакомиться с основами работы с проектом
                    .onboard__text 

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="closePopup()") Заполню позже
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Давайте

                .onboard__section(v-if="step == 2")

                    .onboard__section-title Данные о компании

                    v-form(v-model="mainSettingsForm" @submit.prevent="fetchMainSettings")
                        v-text-field(
                            type="text"
                            label="Название компании"
                            v-model="mainSettings.newCompanyName"
                            :rules="nameRules"
                            required
                            hide-details="auto").onboard__input
                        v-textarea(
                            type="text"
                            label="Описание компании"
                            v-model="mainSettings.newCompanyDescription"
                            auto-grow
                            rows="2"
                            row-height="20"
                            hide-details).onboard__input

                        .onboard__bottom
                            .onboard__bottom-item
                                v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                            .onboard__bottom-item
                                v-btn(type="submit" depressed color="primary" :disabled="!mainSettingsForm") Далее

                .onboard__section(v-if="step == 3")

                    .onboard__section-title Лого и фон
                    .onboard__section-text Загрузите логотип компании и фоновое изображение для меню

                    .onboard__drop
                        logoDropZone(:isOnboard="true")
                    .onboard__drop
                        bgDropZone(:isOnboard="true")

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Далее

                .onboard__section(v-if="step == 4")
                   
                    .onboard__section-title Создание заведения
                    .onboard__section-text К нему будут привязаны qr-коды, телеграм бот и позиции меню

                    .onboard__section-link(@click="addPlace") Новое заведение

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Далее

                .onboard__section(v-if="step == 5")
                    .onboard__section-title Telegram бот
                    .onboard__section-qr(v-html="qr")   
                    .onboard__section-text Получать уведомления можно в нашем боте
                    .onboard__section-text Для подключения перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR-код выше
                    .onboard__section-text Введите команду <code>/login</code>, далее введите код <code>{{$store.state.auth.user.bot_token}}</code>

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Далее

                .onboard__section(v-if="step == 6")
                    .onboard__section-title QR-коды
                    .onboard__section-text На странице "QR-коды" можно сгенерировать коды для заведений
                    .onboard__section-text Скачайте в формате svg или выберите один из готовых PDF шаблонов 
                    .onboard__section-text Также есть возможность сгенерировать код для быстрого подключения к wi-fi

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Далее

                .onboard__section(v-if="step == 7")
                    .onboard__section-title Быстрые команды
                    .onboard__section-text Посетители смогут отправить уведомление всего в 2 клика
                    .onboard__section-text Активируйте уже созданные или создайте свои

                    OnboardFastAction(v-for="(action, key) in $store.state.auth.user.actions" :key="action._id" :action="action")

                    .onboard__section-link(@click="addFastAction") Создать быстрое действие

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="checkStep(step + 1)") Далее

                .onboard__section(v-if="step == 8")
                    .onboard__section-title Почти закончили
                    .onboard__section-text Осталось только распечатать коды и заполнить меню
                    .onboard__section-text При наличии подписки мы поможем с заполнением меню, просто отправьте все данные на почту <a href="mailto:info@qrtone.com">info@qrtone.com</a>

                    .onboard__bottom
                        .onboard__bottom-item
                            v-btn(depressed color="normal" @click="checkStep(step - 1)") Назад
                        .onboard__bottom-item
                            v-btn(depressed color="primary" @click="closePopup()") Спасибо

</template>

<script>
import QRCode from 'qrcode'
const axios = require('axios').default

export default {
    data() {
        return {
            step: 1,
            mainSettingsForm: true,
            nameRules: [
                (v) => !!v || 'Введите название компании',
            ],
            mainSettings: {
                newCompanyName: '',
                newCompanyDescription: ''
            },
            qr: null
        }
    },
    async mounted() {
        const qr = await QRCode.toString(`https://t.me/SafetyMenuBot`)
        this.qr = qr

        this.mainSettings.newCompanyName = this.$store.state.auth.user.name
        this.mainSettings.newCompanyDescription = this.$store.state.auth.user.description
    },
    methods: {
        async closePopup() {
            this.$store.state.view.popup.onboardPopup.visible = false
            this.$store.state.auth.user.isOnboardCompleted = true

            const res = await axios({
                method: 'post',
                url: '/api/complete-onboard'
            })
        },
        checkStep(n) {
            this.step = n
        },
        addPlace() {
            this.$store.state.view.popup.addPlacePopup.visible = true
        },
        addFastAction() {
            this.$store.state.view.popup.addActionPopup = true
        },
        fetchMainSettings() {
            this.$store.dispatch('lk/updateUserData', {
                name: this.mainSettings.newCompanyName,
                description: this.mainSettings.newCompanyDescription,
                notify: this.$notify
            })
            this.checkStep(this.step + 1)
            this.$store.state.auth.user.name = this.mainSettings.newCompanyName
            this.$store.state.auth.user.description = this.mainSettings.newCompanyDescription
        }
    }
}
</script>

<style lang="scss">
.onboard {
    &__title {
        font-size: 26px;
        font-weight: bold;
        line-height: 1.25;
        margin-bottom: 10px;
        color: $color-black;
        text-align: center;
        span {
            color: $color-blue;
        }
    }
    &__text {
        color: $color-black;
        text-align: center;
        opacity: 0.9;
        line-height: 1.3;
        max-width: 260px;
        margin: 0 auto 15px;
    }
    &__drop {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    &__section {
        &-title {
            color: $color-black;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 18px;
            line-height: 1.25;
            text-align: center;
        }
        &-text {
            text-align: center;
            color: $color-black;
            line-height: 1.25;
            max-width: 260px;
            margin: 0 auto 15px;
        }
        &-link {
            text-align: center;
            margin: 15px 0;
            color: $color-blue;
            cursor: pointer;
        }
        &-qr {
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
    }
    &__bottom {
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
        &-item {
            margin: 0 10px;
        }
    }
    &__input {
        margin-bottom: 15px;
        &:last-child {
            margin-bottom: 0;   
        }
    }
    &__fast-action {
        border: 3px solid #F5F7FB;
        background-color: #e7ecf5;
        box-shadow: 0 0 20px rgb(0 0 0 / 20%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        padding: 5px 15px;
        color: $color-black;
        margin-bottom: 15px;
        transition: background-color .3s;
        &.isActive {
            background-color: #fff;
        }
        &-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        &-text {
            font-size: 14px;
            line-height: 1.25;
        }
    }
}
</style>