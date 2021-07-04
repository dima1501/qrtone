<template lang="pug">
    .popup
        .popup__container
            .popup__closer(@click="closePopup")
                v-icon(dark) mdi-close
            .popup__content
                h2.popup__title QR-коды столиков
                p Выбранное заведение {{ $store.state.view.popup.tablesPopup.place.name }}
                p Введите номер столика либо диапазон через тире (например 1-12)
                input(type="text" placeholder="1, 1-12" v-model="tables")
                v-btn(
                    color="primary"
                    text
                    :disabled="!tables"
                    @click="openStyleQRPopup()"
                ) Управление столиками            
</template>

<script>
export default {
    data() {
        return {
            tables: null
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.tablesPopup.visible = false
        },
        openStyleQRPopup() {
            this.$store.state.view.popup.styleQRPopup.visible = true
            this.$store.state.view.popup.tablesPopup.visible = false

            this.$store.state.view.popup.tablesPopup.tables = this.tables
            this.$store.state.view.popup.styleQRPopup.place = this.$store.state.view.popup.tablesPopup.place
        }
    }
}
</script>


<style lang="scss">
.popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding: 30px;
    z-index: 20;
    background-color: rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;

    &__closer {
        position: absolute;
        right: 20px;
        top: 25px;
        cursor: pointer;

        .v-icon {
            color: #000;
            transition: transform .3s;
            &:hover {
                transform: rotate(140deg);
            }
        }
    }

    &__container {
        position: relative;
        margin-top: auto;
        margin-bottom: auto;
        background-color: #fff;
        border-radius: 20px;
        padding: 20px;
        width: 100%;
        max-width: 400px;
    }

    &__title {
        margin-bottom: 8px;
        line-height: 1.3;
        span {
            font-size: 16px;
            white-space: nowrap;
        }
    }
}
</style>
