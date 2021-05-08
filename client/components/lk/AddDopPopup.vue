<template lang="pug">
    .popup
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление дополнениями
                .cats
                    .cats__add
                        .cats__add-field
                            v-text-field(
                                ref="newDop"
                                v-model="newDop.name"
                                type="text"
                                label="Новое дополнение")
                            v-text-field(
                                ref="newDop"
                                v-model="newDop.price"
                                type="number"
                                label="Стоимость"
                                prefix="₽")
                            transition(name="slide-fade" mode="out-in")
                                .cats__item-controls-btn(@click="create" v-if="newDop.name.length")
                                    v-icon(light) mdi-checkbox-marked-circle-outline

                    DopItem(v-for="(dop, i) in $store.state.auth.user.dops" :key="dop._id" :dop="dop")

</template>

<script>

export default {
    data() {
        return {
            drag: false,
            newDop: {
                name: '',
                price: null
            }
        }
    },
    methods: {
        closePopup() {
            this.$store.state.view.popup.addDopPopup.visible = false
        },
        create() {
            this.$store.dispatch('lk/createDop', this.newDop)
            this.newDop.name = ''
            this.newDop.price = null
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description2",
                disabled: false,
                ghostClass: "ghost"
            };
        },
    },
}
</script>


<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}

.cats {
    &__add {
        &-field {
            display: flex;
            align-items: center;
        }
    }
}

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
        margin-bottom: 15px;
    }
}
</style>
