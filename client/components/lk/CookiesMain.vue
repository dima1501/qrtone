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