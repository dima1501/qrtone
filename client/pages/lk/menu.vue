<template lang="pug">
    .menu(v-if="$store.state.auth.user")
        .menu__top
            h1.menu__top-title Меню
            .menu__top-add(@click="openAddPopup") Добавить товар
        .menu__content
            .menu__empty(v-if="!$store.state.auth.user.goods.length") В меню пока что нет товаров

            div(v-for="(item, key) in $store.state.auth.user.categories" v-if="$store.state.auth.user.goods && $store.state.auth.parsedMenu[item]").menu__section
                .menu__title
                    h1.menu__title-text {{ item }}
                    .menu__title-buttons
                        v-icon(light @click="upCategory(item, key)").menu__title-buttons-item.up mdi-arrow-up-circle-outline
                        v-icon(light @click="downCategory(item, key)").menu__title-buttons-item.down mdi-arrow-down-circle-outline

                .menu__list
                    .m-item(v-for="(good, key) in $store.state.auth.parsedMenu[item]" v-bind:key="key")
                        .m-item__edit(@click="openEditPopup")
                            v-icon(dark) mdi-pencil-outline
                        .m-item__img
                        .m-item__name {{ good.name }}
                        .m-item__price Цена: {{ good.price }}
                        .m-item__weight Вес: {{ good.weight }}
                        .m-item__category Категория: {{ good.category }}
                        .m-item__available
                            .m-item__available-title Доступно в:
                            div(v-for="(place, key) in $store.state.auth.user.places" :key="key")
                                label {{ place.name }}
                                input(type='checkbox' :id="place.id" @change="toggleActivePlace(good, place)" :checked="good.places.find(p => p.id === place.id)")
        
        EditMenuItemPopup(v-if='$store.state.view.popup.editMenuItemPopup.visible')
        AddMenuItemPopup(v-if='$store.state.view.popup.addMenuItemPopup.visible')
</template>

<script>
export default {
    layout: 'lk',
    data() {
        return {
            
        }
    },
    mounted() {
        
    },
    methods: {
        openEditPopup() {
            this.$store.state.view.popup.editMenuItemPopup.visible = true
        },
        openAddPopup() {
            this.$store.state.view.popup.addMenuItemPopup.visible = true
        },
        toggleActivePlace(good, place) {
            const find = good.places.find(p => p._id === place._id)
            if (find) {
                good.places.splice(good.places.indexOf(find), 1)
                this.$store.dispatch("lk/updateGood", good)
            } else {
                good.places.push(place)
                this.$store.dispatch("lk/updateGood", good)
            }
        },
        downCategory(input, index) {
            let nextCat = 0
            for (let i = this.$store.state.auth.user.categories.length - 1; i > index; i--) {
                if (this.$store.state.auth.parsedMenu[this.$store.state.auth.user.categories[i]]) {
                    nextCat = i
                }
            }

            let numberOfDeletedElm = 1;
            const elm = this.$store.state.auth.user.categories.splice(index, numberOfDeletedElm)[0];
            numberOfDeletedElm = 0;
            this.$store.state.auth.user.categories.splice(nextCat, numberOfDeletedElm, elm);

            this.$store.dispatch('lk/updateCategories')
        },
        upCategory(input, index) {
            let nextCat = 0
            for (let i = 0; i < index; i++) {
                if (this.$store.state.auth.parsedMenu[this.$store.state.auth.user.categories[i]]) {
                    nextCat = i
                }
            }

            let numberOfDeletedElm = 1;
            const elm = this.$store.state.auth.user.categories.splice(index, numberOfDeletedElm)[0];
            numberOfDeletedElm = 0;
            this.$store.state.auth.user.categories.splice(nextCat, numberOfDeletedElm, elm);

            this.$store.dispatch('lk/updateCategories')
        }
    }
}   
</script>

<style lang="scss" scoped>
.menu {

    &__empty {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        height: 300px;
    }

    &__top {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        &-title {
            margin-right: 30px;
        }

        &-add {
            color: rgb(15, 36, 230);
            cursor: pointer;
            text-decoration: underline;
            position: relative;
            top: 5px;
        }
    }

    &__list {
        display: flex;
        flex-wrap: wrap;
    }

    &__title {
        position: relative;
        &-buttons {
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: absolute;
            left: -30px;
            top: 0;
            &-item {
                display: block;
                cursor: pointer;
                margin-bottom: 10px;
                height: 24px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    &__section {
        &:nth-child(1) {
            .menu__title-buttons-item.up {
                display: none;
                margin: 0;
            }
        }

        &:last-child {
            .menu__title-buttons-item.up {
                margin: 0;
            }
            .menu__title-buttons-item.down {
                display: none;
            }
        }
    }
}

.m-item {
    position: relative;
    padding: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #F5F7FB;
    border-radius: 16px;
    width: calc(25% - 20px);
    display: flex;
    align-items: center;
    flex-direction: column;
    &__img {
        width: 100px;
        height: 100px;
    }
    &__edit {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        &::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 5px;
            right: 5px;
            bottom: 5px;
            cursor: pointer;
        }
        .v-icon {
            color: #000;
        }
    }
}
</style>

