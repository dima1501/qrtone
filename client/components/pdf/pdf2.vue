<template lang="pug">
    .pdf-list-2
        .pdf-list-2__title {{$store.state.view.pdf.data.title}}
        .pdf-list-2__qr
            img.pdf-list-2__qr-pic(:src="$store.state.view.pdf.qr")

        .pdf-list-2__table(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
        .pdf-list-2__content
            .pdf-list-2__content-title {{$store.state.view.pdf.data.subtitle}}
            .pdf-list-2__content-line {{$store.state.view.pdf.data.feature_text}}
        .pdf-list-2__pic
            img(crossorigin="anonymous" src="../../static/qr-scan.png")


        //- img.pdf-list_2__qr(:src="$store.state.view.pdf.qr")
        //- .pdf-list_2__text {{$store.state.view.pdf.data.subtitle}}
        //- .pdf-list_2__table(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
            
</template>

<script>
export default {
    name: 'pdf_2'
}
</script>

<style lang="scss">
.pdf-list-2 {
    position: relative;
    top: 0;
    left: 0;
    width: 148mm;
    height: 210mm;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: $color-black;
    padding: 20px 30px;
    &__title {
        text-align: center;
        text-transform: uppercase;
        font-weight: lighter;
        font-size: 38px;
        color: white;
        margin-bottom: 20px;
        line-height: 1;
        max-height: 38px;
        overflow: hidden;
    }
    &__table {
        color: #fff;
        text-align: center;
        margin-top: 5px;
        margin-bottom: -29px;
    }
    &__content {
        color: white;
        width: 100%;
        margin-top: 45px;
        max-width: 360px;
        margin-right: auto;
        white-space: pre-wrap; 
        word-wrap: break-word;
        max-height: 150px;
        overflow: hidden;
        &-title {
            font-size: 28px;
            font-weight: bold;
            max-height: 40px;
            overflow: hidden;
            margin-bottom: 5px;
        }
        &-line {
            font-size: 18px;
        }
    }
    &__pic {
        position: absolute;
        right: 15px;
        bottom: 25px;
        z-index: 12;
        width: 160px;
        height: 160px;
        img {
            width: 100%;
        }
    }
    &__text {
        display: flex;
        align-items: center;
        line-height: 1.3;
        height: 90px;
        overflow: hidden;
        padding: 0 10px 10px;
        text-align: center;
        font-size: 20px;
        max-width: 100%;
        overflow: hidden;
        white-space: pre-wrap; 
        word-wrap: break-word;
    }
    &__qr {
        background-color: #fff;
        padding: 15px;
        border-radius: 10px;
        width: 100%;
        &-pic {
            width: 100%;
            display: block; 
        }
    }
}
</style>