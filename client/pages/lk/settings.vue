<template lang="pug">
    .settings(v-if="$store.state.auth.user")
        h1.settings__title Настройки
        .settings__section
            h2.settings__section-title Общие
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
                h2.settings__section-title Быстрые действия
                .settings__section-link(@click="addFastAction") Добавить действие
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
            h4(v-if="!$store.state.auth.user.places.length") Для начала работы добавьте заведение

        .settings__section
            .settings__section-top
                h2.settings__section-title Подписка
            .subs
                .subs__item
                    h3.subs__item-title ???руб/месяц
                    .subs__item-content
                        .subs__list
                            .subs__list-item Цифровое меню с неограниченным количеством блюд и категорий
                            .subs__list-item Активация/отключение позиций меню
                            .subs__list-item Поддержка 12-ти языков
                            .subs__list-item Несколько заведений
                            .subs__list-item Стилизация QR-кода под ваш стиль
                            .subs__list-item Быстрый запуск без ожидания менеджеров
                            
                .subs__item
                    h3.subs__item-title ???руб/месяц
                    .subs__item-content
                        .subs__list-item Все пункты версии за ???p
                        .subs__list-item Telegram бот для получения уведомлений от посетителей
                        .subs__list-item Бронирование столика
                        .subs__list-item Заказ к столику
                        .subs__list-item Настраиваемые быстрые команды (Позвать официанта / Попросить счет и тд)
                        .subs__list-item Заполним ваше меню, нужно только фото или документ

        AddPlacePopup(v-if="$store.state.view.popup.addPlacePopup.visible")

        AddActionPopup(v-if="$store.state.view.popup.addActionPopup")

        EditPlacePopup(v-if="$store.state.view.popup.editPlacePopup.visible" :editablePlace="editablePlace")

        EditActionPopup(v-if="$store.state.view.popup.editActionPopup.visible" :editableAction="editableAction")

</template>

<script>
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
            editableAction: null
        }
    },
    methods: {
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

    &__edit {
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        .v-icon {
            color: #000;
        }
    }
}

.subs {
    display: flex;
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
}
</style>

