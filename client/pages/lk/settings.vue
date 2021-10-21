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
                    h3 Общее
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
                    placeLk(v-for="(place, key) in $store.state.auth.user.places" :key="place._id" :place="place" v-on:openEditPlacePopup="openEditPlacePopup" v-on:editTables="editTables")

                h4(v-if="!$store.state.auth.user.places.length") Для начала работы добавьте заведение
                
            .settings__section
                .settings__section-top
                    v-switch(
                        v-if="isAvailable"
                        inset
                        @change="fastActionsToggler($event)"
                        v-model="$store.state.auth.user.fastActionsEnabled"
                        :loading="$store.state.view.loading.toggleFastActions")

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

                p(v-if="!isAvailable").red--text Доступно с подпиской <b>Premium</b>
                //- p Добавьте данные об официантах, зарегистрированных<br> на <a target="_blank" href="https://10q.ru/1075852">chachachay.me</a> для быстрого получения чаевых
                p Добавьте данные об официантах, зарегистрированных<br> в системах для получения чаевых, например в <a target="_blank" href="https://10q.ru/1075852">chachachay.me</a>

                .chay
                    Waiter(v-for="waiter in $store.state.auth.user.waiters" :waiter="waiter" :key="waiter._id")

            .settings__section#subs
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
                                        .subs__list-item-text Стилизация QR-кода под ваш стиль и настраиваемые шаблоны для печати
                                    .subs__list-item 
                                        .subs__list-item-icon
                                            v-icon(light) mdi-checkbox-marked-circle 
                                        .subs__list-item-text Быстрый запуск без ожидания менеджера

                            .subs__plan.-transp(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'premium' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)" @click="simplify()")
                                .subs__plan-period Перейти на Standart <span>Произойдет перерасчет оставшегося времени согласно действующим тарифам</span>

                            div(v-else)
                                .subs__plan.-blue
                                    .subs__plan-period 1 месяц
                                    .subs__plan-price
                                        .subs__plan-price-value 750{{$store.state.auth.user.currencySymbol}}

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="standart_1">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="750" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Стандартная подписка на 1 месяц" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 750 + '_' + 'standart' + '_' + '1' + '_' + this.$store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('standart_1', 'Стандартная подписка на 1 месяц', 750)")
                                        </form>

                                .subs__plan.-orange
                                    .subs__plan-period 6 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 4200{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 700{{$store.state.auth.user.currencySymbol}}/мес

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="standart_2">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="4200" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Стандартная подписка на 6 месяцев" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 4200 + '_' + 'standart' + '_' + '6' + '_' + this.$store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('standart_2', 'Стандартная подписка на 6 месяцев', 4200)")
                                        </form>

                                .subs__plan.-voilet
                                    .subs__plan-period 12 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 7800{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 650{{$store.state.auth.user.currencySymbol}}/мес

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="standart_3">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="7800" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Стандартная подписка на 12 месяцев" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 7800 + '_' + 'standart' + '_' + '12' + '_' + this.$store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('standart_3', 'Стандартная подписка на 12 месяцев', 7800)")
                                        </form>

                                    
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
                                        .subs__list-item-text Зарегистрируйте официантов для быстрого получения чаевых через любой сервис

                            .subs__plan.-transp(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'standart' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)" @click="improve()")
                                .subs__plan-period Улучшить до Premium <span>Произойдет перерасчет оставшегося времени согласно действующим тарифам</span>

                            div(v-else)
                                .subs__plan.-blue
                                    .subs__plan-period 1 месяц
                                    .subs__plan-price
                                        .subs__plan-price-value 1500{{$store.state.auth.user.currencySymbol}}

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="premium_1">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="1500" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Премиум подписка на 1 месяц" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 1500 + '_' + 'premium' + '_' + '1' + '_' + $store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('premium_1', 'Подписка premium, 1 месяц', 1500)")
                                        </form>

                                .subs__plan.-orange
                                    .subs__plan-period 6 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 8400{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 1400{{$store.state.auth.user.currencySymbol}}/мес

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="premium_2">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="8400" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Премиум подписка на 6 месяцев" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 8400 + '_' + 'premium' + '_' + '6' + '_' + $store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('premium_2', 'Премиум подписка на 6 месяцев', 8400)")
                                        </form>

                                .subs__plan.-voilet
                                    .subs__plan-period 12 месяцев
                                    .subs__plan-price
                                        .subs__plan-price-value 15600{{$store.state.auth.user.currencySymbol}}
                                        .subs__plan-price-sale 1300{{$store.state.auth.user.currencySymbol}}/мес

                                        <form name="TinkoffPayForm" onsubmit="pay(this); return false;" ref="premium_3">
                                            input(type="hidden" name="receipt" value="")
                                            input(type="hidden" name="terminalkey" value="1634222512502")
                                            input(type="hidden" name="frame" value="true")
                                            input(type="hidden" name="language" value="ru")
                                            input(type="hidden" placeholder="Сумма заказа" name="amount" value="15600" required)
                                            input(type="hidden" placeholder="Описание" name="description" value="Премиум подписка на 12 месяцев" required)
                                            input(type="hidden" placeholder="Номер заказа" name="order" :value="$store.state.auth.user._id + '_' + 15600 + '_' + 'premium' + '_' + '12' + '_' + $store.state.lk.randomOrderHash" required)
                                            input(type="hidden" name="customerKey" :value="$store.state.auth.user._id")
                                            input(class="tinkoffPayRow subs__plan-btn" type="submit" value="" @click="tinkoffPayFunction('premium_3', 'Премиум подписка на 12 месяцев', 15600)")
                                        </form>

                    .subs__note Полный возврат средств в первые 7 дней после покупки.<br> По всем вопросам пишите на <a href="mailto:admin@toffee.menu">admin@toffee.menu</a>

            .settings__section
                .settings__section-top
                    .settings__section-link.-red(@click="logOut()") Выйти из аккаунта


            footer.footer
                .m-container
                    .footer__inner.-row
                        .footer__item
                            a(href="https://t.me/toffee_menu")
                                img(src="/icon-telegram.svg")
                        .footer__item
                            a(href="https://www.instagram.com/toffee.menu")
                                img(src="/icon-instagram.svg")
                    .footer__inner
                        .footer__item
                            a(href="mailto:admin@toffee.menu").footer__item-text admin@toffee.menu
                        .footer__item
                            a(href="tel:+7(995)626-84-72").footer__item-text +7(995)626-84-72
                    .footer__inner
                        .footer__item
                            nuxt-link(:to="localePath('/docs/user_agreement')" target="_blank").footer__item-text Пользовательское соглашение
                        .footer__item
                            nuxt-link(:to="localePath('/docs/privacy_policy')" target="_blank").footer__item-text Политика обработки персональных данных
                        //- .footer__inner
                        //-   .footer__item
                        //-     nuxt-link(:to="localePath('/docs/privacy_policy')").footer__item-text Использование файлов cookie
                    .footer__inner
                        .footer__item
                            .footer__item-text ИП Воропаев Дмитрий Владимирович
                    .footer__inner
                        .footer__item
                            .footer__item-text ИНН: 780103380065
                        .footer__item
                            .footer__item-text ОГРН: 321784700303897
                
            transition(name="fade")
                EditPlacePopup(v-if="$store.state.view.popup.editPlacePopup.visible" :editablePlace="editablePlace")
            transition(name="fade")
                EditTablesPopup(v-if="$store.state.view.popup.editTablesPopup.visible" :place="editableTablesPlace")
            //- EditTablesPopup(v-if="$store.state.view.popup.editTablesPopup.visible" :place="editableTablesPlace")
            transition(name="fade")
                CreateWaiterPopup(v-if="$store.state.view.popup.addWaiterPopup.visible")
            transition(name="fade")
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
        
        this.$store.state.lk.randomOrderHash = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
    },
    head: {
        script: [
            { 
                src: "https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js",
                body: true, 
            }
        ]
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
        tinkoffPayFunction(ref, name, amount) {
            let form = this.$refs[ref];

            if (ref && name && amount) {
                form.receipt.value = JSON.stringify({
                    "Email": this.$store.state.auth.user.email,
                    "Phone": '8(995)626-84-72',
                    "EmailCompany": "admin@toffee.menu",
                    "Taxation": "patent",
                    "Items": [
                        {
                            "Name": name,
                            "Price": amount + '00',
                            "Quantity": 1.00,
                            "Amount": amount + '00',
                            "PaymentMethod": "full_prepayment",
                            "PaymentObject": "service",
                            "Tax": "none"
                        }
                    ]
                });
                pay(form);
            } else alert("Не все обязательные поля заполнены")
            return false;
        },
        addWaiter() {
            this.$store.state.view.popup.addWaiterPopup.visible = true
        },
        fastActionsToggler(e) {
            this.$store.state.view.loading.toggleFastActions = true
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

@import '../../assets/subs.scss';

.theme--light.v-label--is-disabled,
.theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
    color: rgba(0, 0, 0, 0.6);
}

.settings {
    &__title {
        margin-bottom: 20px;
        font-size: 28px;
        .v-icon {
            color: $color-blue;
            margin-left: 15px;
            cursor: pointer;
        }
    }
    &__section {
        padding: 10px 0px;
        @media screen and (min-width: 768px) {
            padding: 20px 15px;
        }
        &.-short {
            max-width: 420px;
        }
        
        &-row {
            display: flex;
            flex-wrap: wrap;
            &-item {
                margin-bottom: 25px;
                &:last-child {
                    margin-bottom: 0;
                }
                @media screen and (min-width: 768px) {
                    margin-bottom: 0;
                    margin-right: 15px;
                        &:last-child {
                        margin-right: 0;
                    }
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
            margin-right: 10px;
            font-size: 20px;
            @media screen and (min-width: 768px) {
                font-size: 24px;
                margin-right: 20px;
            }
        }
        &-link {
            text-decoration: none;
            color: $color-blue;
            cursor: pointer;
            margin-right: 10px;
            @media screen and (min-width: 768px) {
                margin-right: 15px;
            }
            &:last-child {
                margin-right: 0;
            }
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
            display: none;
            @media screen and (min-width: 370px) {
                display: inline-block;
                font-size: 14px;
                color: $color-black;
                opacity: 0.9;
            }
        }
    }
    &__info {
        &-period {
            font-weight: bold;
            font-size: 16px;
            color: $color-black;
            @media screen and (min-width: 370px) {
               font-size: 18px; 
            }
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

