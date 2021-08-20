<template lang="pug">
    .chay__item
        .chay__item-row
            .chay__item-photo(v-if="waiter.photo" v-bind:style="{ backgroundImage: `url(../../uploads/${waiter.photo})` }")
            .chay__item-content
                .chay__item-name {{ waiter.name }}
                a(target="_blank" :href="waiter.id.includes('http') ? waiter.id : 'https://' + waiter.id").chay__item-id {{ waiter.id }}
                .chay__item-bottom
                    .chay__item-link.red--text(@click="deleteWaiter") Удалить
                    .chay__item-link.blue--text(@click="editWaiterPopup") Изменить
</template>

<script>
const axios = require('axios').default

export default {
    props: {
        waiter: Object
    },
    methods: {
        editWaiterPopup() {
            this.$store.state.view.popup.editWaiterPopup.data = this.waiter
            this.$store.state.view.popup.editWaiterPopup.visible = true
        },
        deleteWaiter() {
            this.$confirm({
                message: `Вы действительно хотите удалить официанта "${this.waiter.name}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: async (confirm) => {
                    if (!!confirm && confirm !== 'false') {
                        try {
                            const del = await axios({
                                method: 'delete',
                                url: `/api/delete-waiter/${this.waiter._id}`
                            })
                            if (this.waiter.photo) this.$store.dispatch("lk/deletePic", this.waiter.photo)
                            if (del.data) {
                                this.$store.state.auth.user.waiters = del.data
                                 this.$notify({ group: 'custom-style', type: 'n-success', title: 'Официант удален' })
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }
            })


        }
    }
}
</script>

<style lang="scss">
.chay {
    &__item {
        margin-bottom: 15px;
        border: 3px solid #F5F7FB;
        box-shadow: 0 0 20px rgb(0 0 0 / 15%);
        border-radius: 16px;
        padding: 10px;
        max-width: 300px;
        &-row {
            display: flex;
            align-items: center;
        }
        &-photo {
            border-radius: 10px;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            width: 70px;
            height: 70px;
            flex-shrink: 0;
            margin-right: 15px;
        }
        &-name {
            font-weight: bold;
            font-size: 17px;
            color: $color-black;
        }
        &-id {
            color: $color-black;
            font-size: 14px;
            opacity: 0.9;
        }
        &-bottom {
            display: flex;
        }
        &-link {
            font-size: 14px;
            color: $color-black;
            margin-right: 15px;
            cursor: pointer;
        }
    }
}
</style>