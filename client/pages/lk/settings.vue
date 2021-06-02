<template lang="pug">
    .settings(v-if="$store.state.auth.user")
        h1.settings__title Настройки
        .settings__section
            h2.settings__section-title Отображение
            .settings__line
                .settings__line-label Название компании
                h3.settings__line-title(v-if="!editCompanyName") {{ $store.state.auth.user.name }}
                    v-icon(light @click="editCompanyName = !editCompanyName") mdi-pencil-outline
                div(v-if="editCompanyName")
                    input(type="text" :placeholder="$store.state.auth.user.name" v-model="newCompanyName").settings__line-input
                    v-icon(light v-if="newCompanyName" @click="updateUserName") mdi-checkbox-marked-circle
                    v-icon(light @click="editCompanyName = !editCompanyName") mdi-close-circle

            .settings__logo
                .settings__logo-pic(v-if="newCompanyLogoSrc || $store.state.auth.user.photo" v-bind:style="{ backgroundImage: 'url(' + (newCompanyLogoSrc ? newCompanyLogoSrc : $store.state.auth.user.photo ? '../../uploads/' + $store.state.auth.user.photo : '' ) + ')' }")
                v-file-input(
                    accept="image/*"
                    placeholder=""
                    prepend-icon="mdi-camera"
                    label="Загрузить логотип"
                    @change="loadLogo")
                v-btn(depressed color="blue" v-if="newCompanyLogoSrc" @click="uploadCompanyLogo") Подтвердить

            .settings__line
                .settings__logo-pic(v-if="newCompanyBackgroundSrc || $store.state.auth.user.background" v-bind:style="{ backgroundImage: 'url(' + (newCompanyBackgroundSrc ? newCompanyBackgroundSrc : $store.state.auth.user.background ? '../../uploads/' + $store.state.auth.user.background : '' ) + ')' }")
                v-file-input(
                    accept="image/*"
                    placeholder=""
                    prepend-icon="mdi-camera"
                    label="Загрузить фоновое изображение"
                    @change="loadBackground")
                v-btn(depressed color="blue" v-if="newCompanyBackgroundSrc" @click="uploadCompanyBackground") Подтвердить

        .settings__section
            .settings__section-top
                h2 Общие настройки

            .settings__section-block
                h3 Уведомления
                .ntfcs
                    .ntfcs__item(v-if="notificationsEnabled == 'denied'")
                        h4 Уведомления отключены в браузере <a href="https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop" target="_blank">как включить</a>
                    .ntfcs__item(v-else)
                        input(type="checkbox" @input="notificationToggler($event)" id="ordersNotifications" :checked="notificationsEnabledLocal == 'true'")
                        label(for="ordersNotifications") Уведомления в браузере

            .settings__section-block
                h3 Символ валюты
                v-select(v-if="currency.length" :items="currency" @input="setCurrency" label="Выберите символ" :item-text="curSelectText" item-value="symbol_native" :value="currency.find(e => e.symbol_native == $store.state.auth.user.currencySymbol).symbol_native")

        .settings__section
            .settings__section-top
                input(type="checkbox" id="fastActionsToggler" v-if="isAvailable" @input="fastActionsToggler($event)" :checked="$store.state.auth.user.fastActionsEnabled")
                h2.settings__section-title Быстрые действия
                .settings__section-link(@click="addFastAction" v-if="isAvailable") Добавить действие
                h3(v-if="!isAvailable") Доступно с подпиской Premium
            div(v-if="isAvailable")
                p <code>@table</code> отображает номер столика, с которого поступил запрос
                .options
                    .option(v-for="(action, key) in $store.state.auth.user.actions" v-bind:key="key")
                        .option__title Текст кнопки на сайте - {{ action.callText }}
                        .option__text Текст уведомления - {{ action.notifyText }}
                        .option__text Текст кнопки подтверждения - {{ action.buttonText }}
                        .option__actions
                            .options__action-item(@click="editAction(action)") Изменить
                            .options__action-item(@click="deleteAction(action)") Удалить
    
        .settings__section
            .settings__section-top
                h2.settings__section-title Заведения
                .settings__section-link(@click="openAddPlacePopup") Добавить заведение
            
            .places(v-if="$store.state.auth.user.places.length")
                .place(v-for="(place, key) in $store.state.auth.user.places" v-bind:key="key")
                    .place__edit(@click="openEditPlacePopup(place)")
                        v-icon(dark) mdi-pencil-outline
                    .place__title {{ place.name }}
                    .place__phone {{ place.phone }}
                    .place__inst {{ place.inst }}

                    .place__tables
                        .place__tables-inner(v-if="place.tables && place.tables.length")
                            .place__tables-item(v-for="(table, key) in place.tables" :key="key")
                                .place__tables-item-name {{ formatTable(table) }}
                        .place__tables-control(@click="editTables(place)") Управление столиками

                    .place__link
                        h4.place__link-title Ссылка на меню заведения

                        .place__link-text https://qrtone.com/m/{{ place.link }}
                            v-icon(light @click="copyLink(place.link)") mdi-content-copy
                            v-icon(light v-if="navigator && navigator.share" @click="shareLink(place.link)") mdi-share-variant

                        .place__link-input
                            .place__link-input-placeholder https://qrtone.com/m/
                            input(type="text" :value="place.link" @input="functionToChangeValue($event, key)")
                        .button.-black(@click="updateLink(key, place._id)") Сохранить

            h4(v-if="!$store.state.auth.user.places.length") Для начала работы добавьте заведение

        .settings__section
            .settings__section-top
                h2.settings__section-title Подписка

                div(v-for="(subs, key) in $store.state.auth.user.subscription" :key="key" v-if="!isDateBefore(subs.expires)")
                    div ||  {{ subs.type }} c  {{ formatDate(subs.started) }} до {{ formatDate(subs.expires) }} {{ !isDateBefore(subs.expires) ? 'Действующая' : 'Истекла' }} ||

                //- div(v-if="$store.state.auth.user.subscription.type == 'free'")
                //-     p(v-if="!isDateBefore($store.state.auth.user.subscription.expires)") Бесплатная подписка до {{ formatDate($store.state.auth.user.subscription.expires) }}
                //-     p(v-else) Бесплатная подписка истекла {{ formatDate($store.state.auth.user.subscription.expires) }}

            .subs
                .subs__inner
                    .subs__item
                        h3.subs__item-title Standart
                        .subs__item-content
                            .subs__list
                                .subs__list-item Цифровое меню с неограниченным количеством блюд и категорий
                                .subs__list-item Активация/отключение позиций меню
                                .subs__list-item Поддержка 12-ти языков
                                .subs__list-item Несколько заведений
                                .subs__list-item Стилизация QR-кода под ваш стиль
                                .subs__list-item Быстрый запуск без ожидания менеджеров

                        //- div(v-if="!$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'standart' || $store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'free'")
                        
                        div(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'premium' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)")
                            .button.-black(@click="simplify()") Изменить на Standart
                        div(v-else)
                            .button.-black(@click="subscribe('standart', 1)") 1 месяц - 1000₽
                            .button.-black(@click="subscribe('standart', 6)") Пол года - 5000₽
                            .button.-black(@click="subscribe('standart', 12)") Год - 10000₽
                                
                    .subs__item
                        h3.subs__item-title Premium
                        .subs__item-content
                            .subs__list-item Все пункты подписки Standart
                            .subs__list-item Telegram бот для получения уведомлений от посетителей
                            .subs__list-item Бронирование столика
                            .subs__list-item Заказ к столику
                            .subs__list-item Настраиваемые быстрые команды (Позвать официанта / Попросить счет и тд)
                            .subs__list-item Заполним ваше меню, нужно только фото или документ

                        div(v-if="$store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].type == 'standart' && !isDateBefore($store.state.auth.user.subscription[$store.state.auth.user.subscription.length - 1].expires)")
                            .button.-black(@click="improve()") Улучшить до Premium
                        div(v-else)
                            .button.-black(@click="subscribe('premium', 1)") 1 месяц - 2000₽
                            .button.-black(@click="subscribe('premium', 6)") Пол года - 10000₽
                            .button.-black(@click="subscribe('premium', 12)") Год - 20000₽

                .subs__note По вопросам изменения подписки пишите на <a href="mailto:info@qrtone.com">info@qrtone.com</a>

        .settings__section
            .settings__section-top
                .settings__section-link.-red(@click="logOut()") Выйти из аккаунта
        
        EditPlacePopup(v-if="$store.state.view.popup.editPlacePopup.visible" :editablePlace="editablePlace")
        EditActionPopup(v-if="$store.state.view.popup.editActionPopup.visible" :editableAction="editableAction")
        EditTablesPopup(v-if="$store.state.view.popup.editTablesPopup.visible" :place="editableTablesPlace")
</template>

<script>
import { transliterate as tr } from 'transliteration';
import moment from 'moment';

import currencies from 'assets/json/currency.json'

export default {
    layout: 'lk',
    data() {
        return {
            editPlacePopup: false,
            editCompanyName: false,
            newCompanyName: '',
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
            navigator: null
        }
    },
    async mounted() {
        this.notificationsEnabled = Notification.permission
        this.notificationsEnabledLocal = localStorage.getItem('notifications')
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
        fastActionsToggler(e) {
            this.$store.dispatch("lk/toggleFastActions", e.target.checked)               
        },
        copyLink(text) {
            const link = `https://qrtone.com/m/${text}`
            navigator.clipboard.writeText(link)
        },
        shareLink(text) {
            const link = `https://qrtone.com/m/${text}`
            navigator.share({
                title: 'QRTone.com',
                url: link
            })
        },
        setCurrency(value) {
            this.$store.dispatch('lk/setCurrency', value)
        },
        curSelectText: item => `${item.name_plural} ${item.symbol_native}`,
        logOut() {
            this.$store.dispatch("auth/logout")
        },
        simplify() {
            var confirmation = confirm(`Вы действительно хотите изменить подписку на Standart? Перерасчет будет произведен автоматически`);
            if (confirmation) this.$store.dispatch("lk/simplify")
        },
        improve() {
            var confirmation = confirm(`Вы действительно хотите улучшить текущий план до Premium? Перерасчет будет произведен автоматически`);
            if (confirmation) this.$store.dispatch("lk/improve")
        },
        subscribe(type, month) {
            var confirmation = confirm(`Вы действительно хотите оформить подписку ${type} на ${month} ${month == 1 ? "месяц" : "месяцев"}`);
            if (confirmation) this.$store.dispatch("lk/subscribe", {type, month})
        },
        formatDate(date) {
            return moment(date).local().locale('ru').calendar()
        },
        isDateBefore(date) {
            return moment(date).isBefore()
        },
        async notificationToggler(e) {
            if (e.target.checked) {
                const result = await Notification.requestPermission()
                this.notificationsEnabled = result
                if (this.notificationsEnabled == 'granted') {
                    localStorage.setItem('notifications', true)
                } else {
                    localStorage.setItem('notifications', false)
                }
            } else {
                localStorage.setItem('notifications', false)
            }
        },
        functionToChangeValue(e, key) {
            this.updatedLinks[key] = e.target.value
        },
        updateLink(key, place) {
            if (this.updatedLinks[key]) {
                this.$store.dispatch('lk/updateLink', {
                    key,
                    link: tr(this.updatedLinks[key].split(' ').join('_')),
                    place
                })
            }
        },
        openAddPlacePopup() {
            this.$store.state.view.popup.addPlacePopup.visible = true
        },
        openEditPlacePopup(place) {
            this.editablePlace = Object.assign({}, place)
            this.$store.state.view.popup.editPlacePopup.visible = true
        },
        editAction(action) {
            this.editableAction = Object.assign({}, action)
            this.$store.state.view.popup.editActionPopup.visible = true
        },
        editTables(place) {
            this.editableTablesPlace = Object.assign({}, place)
            this.$store.state.view.popup.editTablesPopup.visible = true
        },
        updateUserName() {
            this.$store.dispatch('lk/updateUserName', this.newCompanyName)
        },
        loadLogo(e) {
            if (e) {
                this.newCompanyLogoSrc = URL.createObjectURL(e)
                this.newCompanyLogoFile = e
            } else {
                this.newCompanyLogoSrc = null
                this.newCompanyLogoFile = null
            }
        },
        uploadCompanyLogo() {
            this.$store.dispatch('lk/updateCompanyLogo', this.newCompanyLogoFile)
        },
        loadBackground(e) {
            if (e) {
                this.newCompanyBackgroundSrc = URL.createObjectURL(e)
                this.newCompanyBackgroundFile = e
            } else {
                this.newCompanyBackgroundSrc = null
                this.newCompanyBackgroundFile = null
            }
        },
        uploadCompanyBackground() {
            this.$store.dispatch('lk/updateCompanyBackground', this.newCompanyBackgroundFile)
        },
        addFastAction() {
            this.$store.state.view.popup.addActionPopup = true
        },
        deleteAction(action) {
            var ask = confirm(`Вы действительно хотите удалить действие "${action.callText}"?`);
            if (ask) {
                this.$store.dispatch('lk/deleteAction', action._id)
            }
        },
        formatTable(table) {
            if (typeof table == 'number') {
                return table
            } else {
                return table.replace('%20', ' ')
            }
        }
    }
}
</script>

<style lang="scss">

.option {
    margin-bottom: 15px;
    padding: 10px;
    background: #F5F7FB;
    border-radius: 16px;
    padding: 20px;
}

.settings {
    &__title {
        margin-bottom: 20px;
    }
    &__section {
        margin-bottom: 20px;
        &-top {
            display: flex;
            align-items: center;
        }
        &-title {
            margin-bottom: 10px;
        }
        &-link {
            text-decoration: underline;
            color: rgb(13, 33, 218);
            margin-left: 20px;
            cursor: pointer;
            &.-red {
                color: $color-red;
            }
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

.place {
    background: #F5F7FB;
    border-radius: 16px;
    padding: 20px;
    max-width: 400px;
    position: relative;
    margin-bottom: 20px;

    &__edit {
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        .v-icon {
            color: #000;
        }
    }

    &__tables {
        &-inner {
            display: flex;
            flex-wrap: wrap;
        }
        &-item {
            padding: 10px;
            background: #fff;
            border-radius: 10px;
            margin-right: 10px;
        }
    }

    &__link {
        margin-top: 20px;
        &-input {
            position: relative;
            &-placeholder {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
            }
            input {
                padding-left: 180px;
            }
        }
    }
}

.subs {
    &__inner {
        display: flex;
    }
    &__item {
        background: #F5F7FB;
        border-radius: 16px;
        width: calc(50% - 10px);
        margin-right: 20px;
        padding: 20px;
        &:last-child {
            margin-right: 0;
        }
    }
    &__list {
        margin-bottom: 20px;
    }
    &__note {
        margin: 20px 0;
        text-align: center;
    }
}
</style>

