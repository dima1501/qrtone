<template lang="pug">
//- .popup(v-if="$store.state.auth.user")
//-     .popup__overlay(@click="closePopup()")
//-     .popup__container
//-         .popup__content
//-             .popup__closer
//-                 v-icon(light @click="closePopup") mdi-close
.onboard(v-if="$store.state.auth.user")
    .onboard__overlay(@click="closePopup")
    .onboard__area
        .onboard__closer
            v-icon(light @click="closePopup") mdi-close
        transition(name="slide-fade" mode="out-in")
            .onboard__section(v-if="step == 1" key="onboard_1")
                .onboard__content
                    .onboard__title-main Добро пожаловать<br> на <span>toffee.menu</span>
                    .onboard__text Для начала работы необходимо заполнить данные о компании
                    .onboard__text Также будет возможность ознакомиться с основами работы с проектом
                
            .onboard__section(v-if="step == 2" key="onboard_2")
                .onboard__content
                    .onboard__title Данные о компании
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
                            rows="1"
                            row-height="20"
                            hide-details).onboard__input

            .onboard__section(v-if="step == 3" key="onboard_3")
                .onboard__content
                    .onboard__title Лого и фон
                    .onboard__section-text Загрузите логотип компании и фоновое изображение для меню
                    .onboard__drop
                        logoDropZone(:isOnboard="true")
                    .onboard__drop
                        bgDropZone(:isOnboard="true")

            .onboard__section(v-if="step == 4" key="onboard_4")
                .onboard__content
                    .onboard__title Создание заведения
                    .onboard__section-text К нему будут привязаны позиции меню, qr-коды и телеграм бот 
                    .onboard__section-text Это обязательный шаг для начала работы
                    .onboard__section-link(@click="addPlace") Новое заведение

            .onboard__section(v-if="step == 5" key="onboard_5")
                .onboard__content
                    .onboard__title Телеграм бот
                    .onboard__section-qr(v-html="qr")   
                    .onboard__section-text Получать уведомления можно в нашем боте
                    .onboard__section-text Для подключения перейдите по ссылке <a href="https://t.me/SafetyMenuBot" target="_blank">t.me/SafetyMenuBot</a> или отсканируйте QR-код выше
                    .onboard__section-text Введите команду <code>/login</code>, далее введите код <code>{{$store.state.auth.user.bot_token}}</code>

            .onboard__section(v-if="step == 6" key="onboard_6")
                .onboard__content
                    .onboard__title QR-коды
                    .onboard__section-text На странице "QR-коды" можно сгенерировать коды для заведений
                    .onboard__section-text Скачайте в формате svg или выберите один из готовых PDF шаблонов 
                    .onboard__section-text Также есть возможность сгенерировать код для быстрого подключения к wi-fi заведения

            .onboard__section(v-if="step == 7" key="onboard_7")
                .onboard__content
                    .onboard__title Быстрые команды
                    .onboard__section-text Посетители смогут отправить уведомление всего в 2 клика
                    .onboard__section-text Активируйте уже созданные или создайте свои
                    OnboardFastAction(v-for="(action, key) in $store.state.auth.user.actions" :key="action._id" :action="action")
                    .onboard__section-link(@click="addFastAction") Создать быстрое действие

            .onboard__section(v-if="step == 8" key="onboard_8")
                .onboard__content
                    .onboard__title Чаевые
                    .onboard__section-text Добавьте данные об официантов для быстрого получения чаевых
                    .onboard__section-text Нужна только ссылка на профиль официанта в сервисе безналичных чаевых
                    .onboard__section-link(@click="createWaiter") Добавить официанта

            .onboard__section(v-if="step == 9" key="onboard_9")
                .onboard__content
                    .onboard__title Почти закончили
                    .onboard__section-text Осталось только распечатать коды и заполнить меню
                    .onboard__section-text При наличии подписки мы поможем с заполнением меню, просто отправьте все данные на почту <a href="mailto:admin@toffee.menu">admin@toffee.menu</a>

        .onboard__bottom(v-if="step == 1").flex-end
            .onboard__bottom-item
                v-btn(plain color="black" @click="closePopup()") Заполню позже
            .onboard__bottom-item
                v-btn(depressed color="primary" @click="checkStep(step + 1)" large) Начнем

        .onboard__bottom(v-if="step > 1 && step < 9").flex-end
            .onboard__bottom-item
                v-btn(depressed color="normal" @click="checkStep(step - 1)" large) Назад
            .onboard__bottom-item
                v-btn(depressed color="primary" @click="checkStep(step + 1)" large) Далее

        .onboard__bottom(v-if="step == 9").flex-end
            .onboard__bottom-item
                v-btn(depressed color="normal" @click="checkStep(step - 1)" large) Назад
            .onboard__bottom-item
                v-btn(depressed color="primary" @click="closePopup()" large) Спасибо!

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
            qr: null,

            isConfirmOpened: false
        }
    },
    async mounted() {
        const qr = await QRCode.toString(`https://t.me/toffeeMenuBot`)
        this.qr = qr

        this.mainSettings.newCompanyName = this.$store.state.auth.user.name
        this.mainSettings.newCompanyDescription = this.$store.state.auth.user.description

    },
    methods: {
        closePopup() {
            this.isConfirmOpened = true
            this.$confirm({
                message: `Завершить заполнение данных о компании?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.state.view.popup.onboardPopup.visible = false
                        this.$store.state.auth.user.isOnboardCompleted = true
                        try {
                            await axios({
                                method: 'post',
                                url: '/api/complete-onboard'
                            })
                        } catch (error) {
                            console.error(error)
                        }
                    }

                    this.isConfirmOpened = false
                }
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
        createWaiter() {
            this.$store.state.view.popup.addWaiterPopup.visible = true
        },
        fetchMainSettings() {
            if (this.mainSettingsForm) {
                this.$store.dispatch('lk/updateUserData', {
                    name: this.mainSettings.newCompanyName,
                    description: this.mainSettings.newCompanyDescription
                })
                this.checkStep(this.step + 1)
                this.$store.state.auth.user.name = this.mainSettings.newCompanyName
                this.$store.state.auth.user.description = this.mainSettings.newCompanyDescription
            }
        }
    }
}
</script>

<style lang="scss">
.onboard {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 21;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    background-color: rgba(0,0,0,0.8);
    &__overlay {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
    &__area {
        position: relative;
        background-color: #fff;
        padding: 70px 20px 100px;
        margin: auto;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        // height: 100vh;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        overflow-y: scroll;
        @media screen and (min-width: 768px) {
            position: relative;
            border-radius: 20px;
            height: auto;
            display: block;
            max-width: 400px;
            padding: 20px;
            overflow: auto;
        }
    }
    &__closer {
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 10px;
    }
    &__title {
        font-size: 36px;
        font-weight: bold;
        line-height: 1.22;
        margin-bottom: 20px;
        color: $color-black;
        @media screen and (min-width: 340px) {
            font-size: 40px;
        }
        @media screen and (min-width: 768px) {
            font-size: 26px;
            padding-right: 25px;
        }
        
        &-main {
            font-size: 36px;
            line-height: 1.15;
            font-weight: bold;
            color: $color-black;
            margin-bottom: 25px;
            @media screen and (min-width: 340px) {
                font-size: 42px;
            }
            @media screen and (min-width: 400px) {
                font-size: 46px;
            }
            span {
                color: $color-blue;
            }
        }
    }
    &__text {
        color: $color-black;
        opacity: 0.9;
        line-height: 1.32;
        max-width: 290px;
        margin-bottom: 15px;
        font-size: 18px;
    }
    &__drop {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    &__content {
        
    }
    &__section {
        &-title {
            color: $color-black;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 18px;
            line-height: 1.25;
            // text-align: center;
        }
        &-text {
            // text-align: center;
            color: $color-black;
            line-height: 1.25;
            max-width: 310px;
            margin-bottom: 15px;
            font-size: 18px;
            a {
                text-decoration: none;
                color: $color-blue;
            }
        }
        &-link {
            // text-align: center;
            margin: 15px 0;
            color: $color-blue;
            cursor: pointer;
            font-size: 18px;
        }
        &-qr {
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
    }
    &__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        padding: 20px 10px;
        z-index: 15;
        box-shadow: 0 0 10px rgba(0,0,0,0.15);
        &.flex-end {
            justify-content: flex-end;
        }
        @media screen and (min-width: 340px) {
            padding: 20px 15px;
        }
        @media screen and (min-width: 768px) {
            box-shadow: none;
            padding: 0;
            position: static;
            justify-content: flex-end;
        }
        &-item {
            margin: 0 0 0 5px;
            @media screen and (min-width: 340px) {
                margin: 0 0 0 10px;
            }
            @media screen and (min-width: 768px) {
                margin: 0 10px;
            }
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