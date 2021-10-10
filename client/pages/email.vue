<template lang="pug">
    .mail
        .mail__top
            a(href="https://toffee.menu" target="_blank").mail__top-logo TOFFEE.MENU
            a(href="https://toffee.menu/lk/settings" target="_blank").mail__top-btn ВОЙТИ
        .mail__content
            .mail__title Привет, <span>#{name}</span>!
            .mail__text Вы успешно зарегистрировались на <a href="https://toffee.menu" target="_blank">toffee.menu</a>
            .mail__text Бесплатный пробный период составит <span>14 дней</span> и продлится до <span>#{plan}</span>
            .mail__text В этот период вам доступны все возможности сервиса
            a(href="https://toffee.menu/lk/settings").mail__btn Перейти в личный кабинет
        .mail__soc
            a(href="https://t.me/toffee_menu").mail__soc-item
                //- img(src="../assets/icon-telegram.jpg")
            a(href="https://www.instagram.com/toffee.menu").mail__soc-item
                //- img(src="../assets/icon-instagram.jpg")
            a(href="https://vk.com/toffee.menu").mail__soc-item
                //- img(src="../assets/icon-vk.jpg")
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500;900&display=swap');

body {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
}

.mail {
    position: relative;
    padding: 20px;
    background-color: #fff;
    max-width: 580px;
    margin: 0 auto;
}
.mail__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0;
}
.mail__top-logo {
    font-weight: 900;
    font-size: 18px;
    color: #000;
    text-decoration: none;
}
.mail__top-btn {
    color: #667695;
    background-color: #f2f4f9;
    padding: 10px 15px 10px 15px;
    border-width: 8px 24px 8px 24px;
    border-radius: 3px;
    font-size: 18px;
    font-weight: bold;
    border-color: #f2f4f9;
    border-style: solid;
    text-decoration: none;
}
.mail__content {
    position: relative;
    border: solid 12px #dfe4ec;
    padding: 24px 36px 24px 36px;
}
.mail__title {
    color: #364364;
    font: bold 32px/40px 'arial' , 'helvetica neue' , 'helvetica' , 'freesans' , sans-serif;
    font-weight: bold;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #cbd3df;
}

.mail__text {
    color: #6D7175;
    margin-bottom: 15px;
    font-size: 18px;
}

.mail__text a, span {
    color: #307EF2;
    font-display: none;
}
.mail__btn {
    display: block;
    padding: 20px;
    text-transform: uppercase;
    background-color: #00c084;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    border-radius: 3px;
    color: #fff;
}
.mail__soc {
    display: flex;
    padding: 20px 0;
    justify-content: center;
    align-items: center;
}
.mail__soc-item {
    display: block;
    width: 40px;
    height: 40px;
    margin: 0 15px;
}
.mail__soc-item img {
    max-width: 100%;
    height: auto;
}
</style>