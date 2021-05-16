<template lang="pug">
    .menu(v-if="$store.state.auth.user")
        .menu__top
            h1.menu__top-title Меню
            .menu__top-add(@click="openAddPopup") Добавить товар
            .menu__top-add(@click="openCatPopup") Управление категориями
        .menu__content
            .menu__empty(v-if="!$store.state.auth.user.goods.length") В меню пока что нет товаров

            div(v-for="(item, key) in $store.state.auth.user.categories" v-bind:key="key" v-if="$store.state.auth.user.goods && $store.state.auth.parsedMenu[item._id] && $store.state.auth.parsedMenu[item._id].length").menu__section
                .menu__title
                    h1.menu__title-text {{ item.name }}

                .menu__list
                    draggable(
                        class="drag"
                        v-model="$store.state.auth.parsedMenu[item._id]"
                        v-bind="dragOptions(item._id)"
                        @start="drag = true"
                        @end="drag = false"
                        handle=".handles"
                        @change="change")
                        transition-group(type="transition" :name="!drag ? null : null")
                            .m-item(v-for="(good, key) in $store.state.auth.parsedMenu[item._id]" :key="good._id")
                                .m-item__controls
                                    .m-item__controls-item(@click="openEditPopup(good)")
                                        v-icon(dark) mdi-pencil-outline
                                    .m-item__controls-item.handles
                                        v-icon(dark) mdi-drag

                                .m-item__img(v-if="good.images.length")
                                    img(v-for="(image, key) in good.images" :key="key" :src="`../uploads/${image}`" v-if="good.images.length == 1").m-item__img-pic
                                    VueSlickCarousel(:arrows="false" :dots="true" v-if="good.images.length > 1")
                                        img(v-for="(image, key) in good.images" :key="key" :src="`../uploads/${image}`")

                                .m-item__name {{ good.name }}
                                .m-item__name {{ good.translation }}
                                .m-item__name {{ good.description }}

                                .m-item__line(v-for="(item, key) in good.prices" :key="key")
                                    .m-item__price Цена: {{ good.prices[key] }}
                                    .m-item__weight Вес: {{ good.weights[key] }}

                                .m-item__category Категория: {{ $store.state.auth.user.categories.find(e => e._id == good.category).name }}
                                .m-item__dops
                                    .m-item__dops-item(v-for="(dop, idx) in good.dops" :key="idx" v-if="$store.state.auth.user.dops.find(e => e._id === dop)") {{ $store.state.auth.user.dops.find(e => e._id === dop).name }} {{ $store.state.auth.user.dops.find(e => e._id === dop).price }}

                                .m-item__available
                                    .m-item__available-title Доступно в:
                                    div(v-for="(place, key) in $store.state.auth.user.places" :key="key")
                                        label(:for="`${good._id}${place._id}`") {{ place.name }}
                                        input(type='checkbox' :id="`${good._id}${place._id}`" @change="toggleActivePlace(good, place)" :checked="good.places.find(p => p._id === place._id)")
        
        EditMenuItemPopup(v-if='$store.state.view.popup.editMenuItemPopup.visible' v-bind:editableMenuItem="editableMenuItem")
        AddMenuItemPopup(v-if='$store.state.view.popup.addMenuItemPopup.visible')
        AddCategoryPopup(v-if='$store.state.view.popup.addCategoryPopup.visible')
        AddDopPopup(v-if='$store.state.view.popup.addDopPopup.visible')

</template>

<script>
import draggable from 'vuedraggable'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
    layout: 'lk',
    components: {
        VueSlickCarousel,
        draggable
    },
    data() {
        return {
            drag: false,
            editableMenuItem: null
        }
    },
    methods: {
        dragOptions(id) {
            return {
                animation: 200,
                group: `draggable_${id}`,
                disabled: false,
                ghostClass: "ghost"
            };
        },
        change(e) {
            const cat = this.$store.state.auth.parsedMenu[e.moved.element.category]
            const arr = []

            for (let i in cat) {
                cat[i].order = i
                arr.push(cat[i]._id)
            } 

            this.$store.dispatch("lk/updateOrder", arr)
        },
        openEditPopup(item) {
            this.editableMenuItem = item
            this.$store.state.view.popup.editMenuItemPopup.visible = true
        },
        openAddPopup() {
            this.$store.state.view.popup.addMenuItemPopup.visible = true
        },
        openCatPopup() {
            this.$store.state.view.popup.addCategoryPopup.visible = true
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
        }
    }
}   
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.drag {
    width: 100%;

    & > span {
        display: flex;
        flex-wrap: wrap;
    }
}

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
            margin-right: 30px;
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
        margin-bottom: 30px;
        // height: 100px;
        &-pic {
            width: 100%;
        }
    }
    &__controls {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        z-index: 2;
        &-item {
            position: relative;
            margin-left: 10px;
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
    &__line {
        display: flex;
        align-items: center;
        padding: 5px 0;
        margin: 5px 0;
        border-top: 1px solid rgb(230, 230, 230);
        border-bottom: 1px solid rgb(230, 230, 230);
    }

    &__dops {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>

