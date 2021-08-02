<template lang="pug">

.settings(v-if="$store.state.auth.user" )
    transition(name="slide-fade" mode="out-in")
        div(v-if="1" key="settings")
            h1.settings__title 
                span Настройки
                v-icon(light @click="openOnboardPopup()") mdi-information-outline 

            .settings__section.-short
                mainSettings(:name="$store.state.auth.user.name" :description="$store.state.auth.user.description")

            .settings__section
                .settings__section-row
                    .settings__section-row-item
                        logoDropZone
                    .settings__section-row-item
                        bgDropZone

            .settings__section
                .settings__section-block
                    h3 Уведомления
                    .ntfcs
                        .ntfcs__item(v-if="notificationsEnabled == 'denied'")
                            p Уведомления отключены в браузере, <a href="https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop" target="_blank">как включить</a>
                        .ntfcs__item(v-else)
                            v-switch(
                                inset
                                @change="notificationToggler($event)"
                                :label="`${notificationsEnabledLocal ? 'Уведомления в браузере включены' : 'Уведомления в браузере отключены'}`"
                                v-model="notificationsEnabledLocal"
                                hide-details="auto")

                // Это когда до международной версии дойду todo
                //- .settings__section-block
                //-     v-select(v-if="currency.length" :items="currency" @input="setCurrency" label="Валюта" :item-text="curSelectText" item-value="symbol_native" :value="currency.find(e => e.symbol_native == $store.state.auth.user.currencySymbol).symbol_native")

            .settings__section
                .settings__section-top
                    h2.settings__section-title Заведения
                    .settings__section-link(@click="openAddPlacePopup")
                        v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                                v-icon(v-bind="attrs" v-on="on") mdi-plus-circle-outline 
                            <span>Новое зведение</span>
                .places(v-if="$store.state.auth.user.places.length")
                    placeLk(v-for="(place, key) in $store.state.auth.user.places" :key="key" :place="place" v-on:openEditPlacePopup="openEditPlacePopup" v-on:editTables="editTables")

                h4(v-if="!$store.state.auth.user.places.length") Для начала работы добавьте заведение
                
            .settings__section
                .settings__section-top
                    v-switch(
                        v-if="isAvailable"
                        inset
                        @change="fastActionsToggler($event)"
                        v-model="$store.state.auth.user.fastActionsEnabled")

                    h2.settings__section-title Быстрые действия
                    .settings__section-link(@click="addFastAction" v-if="isAvailable")
                        v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                                v-icon(v-bind="attrs" v-on="on") mdi-plus-circle-outline 
                            <span>Добавить быстрое действие</span>

                p.red--text(v-if="!isAvailable") Доступно с подпиской <b>Premium</b>
                div
                    p <code>@table</code> отображает номер столика, с которого поступил запрос
                    .options
                        fastAction(v-for="(action, key) in $store.state.auth.user.actions" :key="key" :action="action")

            .settings__section
                .settings__section-top
                    h2.settings__section-title Чаевые
                    .settings__section-link(@click="addWaiter")
                        v-tooltip(top)
                            template(v-slot:activator="{ on, attrs }")
                                v-icon(v-bind="attrs" v-on="on") mdi-plus-circle-outline 
                            <span>Добавить официанта</span>

                p(v-if="!isAvailable").red--text Активно с подпиской <b>Premium</b>
                p Добавьте данные об официантах, зарегистрированных<br> на <a target="_blank" href="https://10q.ru/1075852">chachachay.me</a> для быстрого получения чаевых

                .chay
                    Waiter(v-for="waiter in $store.state.auth.user.waiters" :waiter="waiter" :key="waiter._id")

            .settings__section
                div(v-if="!isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)")
                    .settings__section-top
                        h2.settings__section-title Подписка

                    .subscription(v-for="(subs, key) in $store.state.auth.user.subscription" :key="key" v-if="!isDateBefore(subs.expires)")
                        .subscription__content
                            .subscription__top
                                .subscription__status
                                    span.main {{ subs.type }}
                                    span.note Подписка
                                .subscription__info(v-if="!isDateBefore(subs.expires)")
                                    .subscription__info-period.small с {{formatDate(subs.started)}}
                                    .subscription__info-period до {{formatDate(subs.expires)}}
                            .subscription__bottom(v-if="isDateBefore(subs.started)")
                                .subscription__progress(v-if="!isDateBefore(subs.expires)")
                                    .subscription__progress-value Осталось дней: {{ calcDays(subs.started, subs.expires) }}
                                    .subscription__progress-line
                                        .subscription__progress-line-bg(v-bind:style="{ width: calcPercents(subs.started, subs.expires) }")
                                .subscription__ended(v-else) Истекла {{formatDate(subs.expires)}}

                        .subscription__bubbles
                            .subscription__bubbles-item._1
                            .subscription__bubbles-item._2
                            .subscription__bubbles-item._3
                            .subscription__bubbles-item._4

                .subs
                    h2.subs__title Выберите подписку
                    .subs__subtitle Подходящую под ваши требования
                    .subs__inner
                        .subs__item
                            h3.subs__item-title Standart
                            .subs__item-content
                                .subs__list
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Цифровое меню с неограниченным количеством блюд и категорий
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Меню доступно по QR-коду и ссылке
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Адаптивный интерфейс для работы с любых устройств
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Информация о компании индексируется в поисковых системах
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Неограниченное количество заведений
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Раздельный стоп-лист для каждого заведения
                                    //- .subs__list-item 
                                    //-     .subs__list-item-icon
                                    //-         v-icon(light) mdi-checkbox-marked-circle 
                                    //-     .subs__list-item-text Интерфейс на Русском и Английском языках
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Стилизация QR-кода под ваш стиль
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Готовые PDF шаблоны для печати
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Быстрый запуск без ожидания менеджера

                            .subs__plan.-transp(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'premium' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)" @click="simplify()")
                                .subs__plan-period Перейти на Standart <span>Произойдет перерасчет оставшегося времени согласно действующим тарифам</span>

                            div(v-else)
                                .subs__plan.-blue(@click="subscribe('standart', 1, 750)")
                                    .subs__plan-period 1 месяц
                                    .subs__plan-price
                                        .subs__plan-price-value 750{{$store.state.auth.user.currencySymbol}}

                                .subs__plan.-orange(@click="subscribe('standart', 6, 4200)")
                                    .subs__plan-period 6 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 4200{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 700{{$store.state.auth.user.currencySymbol}}/мес

                                .subs__plan.-voilet(@click="subscribe('standart', 12, 7800)")
                                    .subs__plan-period 12 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 7800{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 650{{$store.state.auth.user.currencySymbol}}/мес

                                    
                        .subs__item
                            h3.subs__item-title Premium
                            .subs__item-content
                                .subs__list
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Все пункты подписки Standart
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Telegram бот для получения уведомлений от посетителей
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Заказ к столику
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Настраиваемые быстрые команды (Позвать официанта / Попросить счет и тд)
                                    .subs__list-item 
                                            .subs__list-item-icon
                                                v-icon(light) mdi-checkbox-marked-circle 
                                            .subs__list-item-text Удобная форма бронирования на сайте
                                    .subs__list-item
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Заполним ваше меню, просто отправьте нам все необходимые данные
                                    .subs__list-item
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Зарегистрируйте официантов для быстрого получения чаевых через сервис chachachay.me

                            .subs__plan.-transp(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'standart' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)" @click="improve()")
                                .subs__plan-period Улучшить до Premium <span>Произойдет перерасчет оставшегося времени согласно действующим тарифам</span>

                            div(v-else)
                                .subs__plan.-blue(@click="subscribe('premium', 1, 1500)")
                                    .subs__plan-period 1 месяц
                                    .subs__plan-price
                                        .subs__plan-price-value 1500{{$store.state.auth.user.currencySymbol}}

                                .subs__plan.-orange(@click="subscribe('premium', 6, 8400)")
                                    .subs__plan-period 6 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 8400{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 1400{{$store.state.auth.user.currencySymbol}}/мес

                                .subs__plan.-voilet(@click="subscribe('premium', 12, 15600)")
                                    .subs__plan-period 12 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 15600{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 1300{{$store.state.auth.user.currencySymbol}}/мес

                    .subs__note Полный возврат средств в первые 7 дней после покупки.<br> По всем вопросам пишите на <a href="mailto:info@qrtone.com">info@qrtone.com</a>

            .settings__section
                .settings__section-top
                    .settings__section-link.-red(@click="logOut()") Выйти из аккаунта
            
            EditPlacePopup(v-if="$store.state.view.popup.editPlacePopup.visible" :editablePlace="editablePlace")
            EditTablesPopup(v-if="$store.state.view.popup.editTablesPopup.visible" :place="editableTablesPlace")
            //- EditTablesPopup(v-if="$store.state.view.popup.editTablesPopup.visible" :place="editableTablesPlace")

            CreateWaiterPopup(v-if="$store.state.view.popup.addWaiterPopup.visible")
            EditWaiterPopup(v-if="$store.state.view.popup.editWaiterPopup.visible")

</template>

<script>
import moment from 'moment';

import currencies from 'assets/json/currency.json'

export default {
    layout: 'lk',
    data() {
        return {
            isCompanyDataValid: true,
            editPlacePopup: false,
            editCompany: false,
            newCompanyName: '',
            newCompanyDescription: '',
            newCompanyLogoSrc: null,
            newCompanyLogoFile: null,
            newCompanyBackgroundSrc: null,
            newCompanyBackgroundFile: null,
            editablePlace: null,
            editableAction: null,
            editableTablesPlace: null,
            updatedLinks: [],
            notificationsEnabled: false,
            notificationsEnabledLocal: false,
            currency: [],
            checkedCurrency: null,
            navigator: null,
            nameRules: [
                (v) => !!v || 'Введите название компании',
            ]
        }
    },
    async mounted() {
        this.notificationsEnabled = Notification.permission
        this.notificationsEnabledLocal = localStorage.getItem('notifications') == 'true'
        const cur = this.currency
        Object.keys(currencies).forEach(function(key) {
            cur.push(currencies[key])
        })
        this.navigator = navigator
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
        addWaiter() {
            this.$store.state.view.popup.addWaiterPopup.visible = true
        },
        fastActionsToggler(e) {
            this.$store.dispatch("lk/toggleFastActions", e)               
        },
        setCurrency(value) {
            this.$store.dispatch('lk/setCurrency', value)
        },
        curSelectText: item => `${item.name_plural} ${item.symbol_native}`,
        logOut() {
            this.$confirm({
                message: `Вы действительно хотите выйти из аккаунта?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        localStorage.removeItem('place') 
                        this.$store.dispatch("auth/logout")
                    }
                }
            })
        },
        simplify() {
            this.$confirm({
                message: `Вы действительно хотите изменить подписку на Standart? Перерасчет будет произведен автоматически`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch("lk/simplify")
                    }
                }
            })
        },
        improve() {
            this.$confirm({
                message: `Вы действительно хотите улучшить текущий план до Premium? Перерасчет будет произведен автоматически`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch("lk/improve")
                    }
                }
            })
        },
        subscribe(type, month, price) {
            this.$confirm({
                message: `Вы действительно хотите оформить подписку ${type} на ${month} ${month == 1 ? "месяц" : "месяцев"}`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        this.$store.dispatch("lk/subscribe", {type, month, price})
                    }
                }
            })
        },
        formatDate(date) {
            return moment(date).local().locale('ru').format("L")
        },
        calcDays(started, expires) {
            return moment(expires).set({hour:0,minute:0,second:0,millisecond:0}).diff(moment().set({hour:0,minute:0,second:0,millisecond:0}), 'days')
        },
        calcPercents(started, expires) {
            const totalDiff = moment(expires).set({hour:0,minute:0,second:0,millisecond:0}).diff(moment(started).set({hour:0,minute:0,second:0,millisecond:0}), 'days')
            const startDiff = moment().set({hour:0,minute:0,second:0,millisecond:0}).diff(moment(started).set({hour:0,minute:0,second:0,millisecond:0}), 'days')
            return (startDiff / totalDiff) * 100 + '%'
        },
        isDateBefore(date) {
            return moment(date).isBefore()
        },
        async notificationToggler(e) {
            if (e) {
                const result = await Notification.requestPermission()
                this.notificationsEnabled = result
                if (this.notificationsEnabled == 'granted') {
                    localStorage.setItem('notifications', true)
                    this.$notify({ group: 'custom-style', type: 'n-success', title: 'Уведомления в браузере включены' })
                } else {
                    localStorage.setItem('notifications', false)
                    this.notificationsEnabledLocal = false
                    this.$notify({ group: 'custom-style', type: 'n-alarm', title: 'Уведомления запрещены настройками браузера' })
                }
            } else {
                localStorage.setItem('notifications', false)
                this.$notify({ group: 'custom-style', type: 'n-success', title: 'Уведомления в браузере отключены' })
            }
        },
        openAddPlacePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = true
        },
        openEditPlacePopup(place) {
            this.editablePlace = Object.assign({}, place)
            this.$store.state.view.popup.editPlacePopup.visible = true
        },
        editTables(place) {
            this.editableTablesPlace = Object.assign({}, place)
            this.$store.state.view.popup.editTablesPopup.visible = true
        },
        addFastAction() {
            this.$store.state.view.popup.addActionPopup = true
        },
        openOnboardPopup() {
            this.$store.state.view.popup.onboardPopup.visible = true
        }
    }
}
</script>

<style lang="scss">


.theme--light.v-label--is-disabled,
.theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
    color: rgba(0, 0, 0, 0.6);
}

.settings {
    &__title {
        margin-bottom: 20px;
        .v-icon {
            color: $color-blue;
            margin-left: 15px;
            cursor: pointer;
        }
    }
    &__section {
        padding: 20px 15px;
        &.-short {
            max-width: 420px;
        }
        
        &-row {
            display: flex;
            flex-wrap: wrap;
            &-item {
                margin-right: 15px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        &-top {
            display: flex;
            align-items: center;
        }
        &-bottom {
            display: flex;
            align-items: center;
        }
        &-title {
            margin-right: 20px;
        }
        &-link {
            text-decoration: none;
            color: $color-blue;
            cursor: pointer;
            margin-right: 15px;
            &.-red {
                color: $color-red;
            }
            .v-icon {
                color: $color-blue;
            }
        }
        &-unavailable {
            color: $color-red;
            font-size: 14px;
        }
    }
    &__logo {
        padding: 20px 0;
        display: flex;
        align-items: center;
        &-pic {
            border-radius: 10px;
            width: 90px;
            height: 90px;
            margin-right: 20px;
            flex-shrink: 0;
            background-position: center;
            background-size: cover;
        }
    }
    &__line {
        display: flex;
        align-items: center;
        &-label {
            margin-right: 20px;
        }
        &-input {
            padding: 5px 10px;
            background: #F5F7FB;
            border-radius: 10px;
        }
    }
}

.subs {
    margin: 30px 0;
    &__title {
        text-align: center;
        font-size: 28px;
        color: $color-black;
    }
    &__subtitle {
        text-align: center;
        margin-bottom: 30px;
        color: $color-black;
    }
    &__inner {
        display: flex;
        justify-content: center;
        // align-items: center;
        align-items: flex-start;
    }
    &__item {
        border: 3px solid #F5F7FB;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        border-radius: 16px;
        max-width: 350px;
        margin: 0 20px;
        padding: 20px;
        &-title {
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: bold;
            color: $color-black;
        }
        &-content {
            margin-bottom: auto;
        }
    }
    &__list {
        margin-bottom: 20px;
        &-item {
            margin-bottom: 12px;
            display: flex;
            &:last-child {
                margin-bottom: 0;
            }
            
            &-icon {
                margin-right: 10px;
                margin-top: -2px;
                .v-icon {
                    color: #61a7fd;
                }
            }
            &-text {
                line-height: 1.3;
            }
        }
    }
    &__note {
        margin: 20px 0;
        text-align: center;
        font-size: 14px;
        a {
            text-decoration: none;
            color: $color-blue;
        }
    }
    &__plan {
        margin-bottom: 15px;
        border-radius: 10px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.12);
        min-height: 70px;
        cursor: pointer;
        &.-blue {
            background-color: #61a7fd;
        }
        &.-orange {
            background-color: #fda076;
        }
        &.-voilet {
            background-color: #7476da;
        }
        &.-transp {
            color: $color-black;
            border: 2px solid rgb(236, 236, 236);
        }
        &:last-child {
            margin-bottom: 0;
        }
        &-period {
            font-size: 18px;
            font-weight: bold;
            span {
                display: block;
                font-size: 14px;
                line-height: 1.3;
                font-weight: normal;
            }
        }
        &-price {
            text-align: right;
            &-value {
                font-size: 24px;
                font-weight: bold;
            }
            &-sale {
                font-size: 14px;
                opacity: 0.9;
                margin-top: -7px;
            }
        }
    }
}

.subscription {
    position: relative;
    overflow: hidden;
    margin: 15px 0;
    padding: 15px;
    border-radius: 14px;
    width: 100%;
    max-width: 400px;
    // border: 2px solid rgb(228, 228, 228);
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    &__content {
        position: relative;
        z-index: 2;
    }
    &__top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    &__status {
        .main {
            background-color: $color-black;
            margin-right: 5px;
            padding: 3px 5px;
            color: #fff;
            text-transform: uppercase;
            font-size: 14px;
            font-weight: bold;
            line-height: 0.001em;
            border-radius: 4px;
        }
        .note {
            font-size: 14px;
            color: $color-black;
            opacity: 0.9;
        }
    }
    &__info {
        &-period {
            font-weight: bold;
            font-size: 18px;
            color: $color-black;
            &.small {
                font-size: 14px;
                opacity: 0.9;
                text-align: right;
            }
        }
    }
    &__progress {
        &-value {
            font-weight: bold;
            font-size: 18px;
            color: $color-black;
        }
        &-line {
            margin-top: 5px;
            position: relative;
            background-color: lighten($color-blue, 45%);
            height: 15px;
            border-radius: 4px;
            overflow: hidden;
            &-bg {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                transition: width .3s;
                border-radius: 4px;
                background-color: lighten($color-blue, 5%);
            }
        }
    }
    &__ended {
        font-size: 18px;
        font-weight: bold;
    }
    &__bubbles {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        filter: blur(25px);
        opacity: 0.8;
        // background: conic-gradient(#61a7fd 30%, #fda076 0 70%, lighten($color-red, 25%) 10%);
        // background: conic-gradient(red 16.6%, orange 0 33.2%, yellow 0 49.8%, green 0 66.4%, blue 0 83%, rgb(204, 67, 204) 0 );
        // background: conic-gradient(red 16.6%, orange 16.6%, yellow 16.6%, green, #00BFFF, blue, violet);
        // background: conic-gradient(red 16%, orange 16%, yellow 16%, green 16%, blue 16%, violet 16%);

        &-item {
            position: absolute;
            width: 50%;
            height: 50%;
            border-radius: 50%;
            background-color: $color-blue;
            &._1 {
                left: -50%;
                top: -80%;
                width: 200%;
                height: 300%;
                background-color: #61a7fd;
            }
            &._2 {
                right: 0;
                top: -20px;
                width: 70%;
                right: -10%;
                height: 100%;
                background-color: #fda076;
            }
            &._3 {
                left: -20%;
                bottom: -20%;
                width: 90%;
                height: 70%;
                background-color: #7476da;
            }
            &._4 {
                right: -20%;
                bottom: -20%;  
                width: 70%;
                height: 70%;
                background-color: $color-red;
                opacity: 0.9;
            }
        }
    }
}

</style>

