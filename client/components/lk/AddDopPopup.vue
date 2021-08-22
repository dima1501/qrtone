<template lang="pug">
    .popup.z-22
        .popup__overlay(@click="closePopup")
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Управление дополнениями
                .cats(:class="{ padding: addDop }")
                    .cats__add
                        transition(name="slide-fade" mode="out-in")
                            .cats__add-link(@click="addDop = true" v-if="!addDop") Новое дополнение
                            v-form(v-if="addDop" @submit.prevent="create" v-model="isFormValid")
                                .cats__add-field
                                    v-text-field(
                                        ref="newDop"
                                        v-model="newDop.name"
                                        type="text"
                                        label="Название"
                                        autofocus
                                        hide-details="auto").mr-5
                                    v-text-field(
                                        ref="newDop"
                                        v-model="newDop.price"
                                        type="number"
                                        label="Цена"
                                        :prefix="$store.state.auth.user.currencySymbol"
                                        hide-details="auto").short
                                .place__tables-actions
                                    v-btn(
                                        depressed
                                        large
                                        @click="addDop = false"
                                    ).e-card__bottom-item.red--text Отмена
                                    v-btn(
                                        depressed
                                        color="primary"
                                        :disabled="!newDop.name"
                                        large
                                        @click="create"
                                        :loading="$store.state.view.loading.createDop"
                                    ).e-card__bottom-item Добавить

                    DopItem(v-for="(dop, i) in $store.state.auth.user.dops" :key="dop._id" :dop="dop")

</template>

<script>
const axios = require("axios")

export default {
    data() {
        return {
            addDop: false,
            isFormValid: true,
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
        async create() {
            if (this.newDop.name) {
                this.$store.state.view.loading.createDop = true
                const create = await axios({
                    method: 'post',
                    url: '/api/create-dop',
                    data: { data: { dop: this.newDop } }
                })
                this.$store.state.view.loading.createDop = false
                if (create.data) {
                    this.$store.state.auth.user.dops.unshift(create.data)
                    this.addDop = false
                    this.newDop.name = ''
                    this.newDop.price = null
                }
            }
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
    &.padding {
        padding-bottom: 84px;
        @media screen and (min-width: 768px) {
            padding-bottom: 0;
        }
    }
    &__add {
        &-field {
            display: flex;
            align-items: center;
            .short {
                width: 90px;
            }
        }
    }
}

// .popup {
//     position: fixed;
//     left: 0;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     padding: 30px;
//     z-index: 20;
//     background-color: rgba(0,0,0,0.6);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     overflow-y: scroll;

//     &__closer {
//         position: absolute;
//         right: 20px;
//         top: 25px;
//         cursor: pointer;

//         .v-icon {
//             color: #000;
//             transition: transform .3s;
//             &:hover {
//                 transform: rotate(140deg);
//             }
//         }
//     }

//     &__container {
//         position: relative;
//         margin-top: auto;
//         margin-bottom: auto;
//         background-color: #fff;
//         border-radius: 20px;
//         padding: 20px;
//         width: 100%;
//         max-width: 400px;
//     }

//     &__title {
//         margin-bottom: 15px;
//     }
// }
</style>
