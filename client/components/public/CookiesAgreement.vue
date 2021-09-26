<template lang="pug">
    .cookies(@click="closePopup()")
        .cookies__area(@click.stop)
            .cookies__text Сайт использует файлы cookie
            .cookies__btn
                v-btn(
                    small
                    depressed
                    color="primary"
                    type="submit"
                    @click="closePopup()") Хорошо
                a(target="_blank" :href="localePath('/docs/cookie')") подробнее
</template>

<script>
export default {
    data() {
        return {
            isCookiesAgreed: false
        }
    },
    mounted() {

    },
    methods: {
        closePopup() {
            this.$emit('closePopup')
        }
    }
}
</script>

<style lang="scss">
.cookies {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    background-color: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    &__area {
        padding: 20px;
        background-color: #fff;
        position: relative;
        border-radius: 10px;
    }
    &__closer {
        position: absolute;
    }
    &__btn {
        display: flex;
        align-items: center;
        margin-top: 15px;
        a {
            margin-left: 20px;
            line-height: 1;
        }
    }
}
</style>