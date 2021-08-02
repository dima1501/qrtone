<template lang="pug">
    .pdf-list-3
        img.pdf-list-3__qr(:src="$store.state.view.pdf.qr")
        .pdf-list-3__table
            span
            span(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
            span(v-if="$store.state.view.pdf.data.link && $store.state.view.pdf.link && $store.state.view.popup.styleQRPopup.type !== 'wifi'") {{$store.state.view.pdf.link}}
            span
        .pdf-list-3__title {{$store.state.view.pdf.data.title}}
        //- .pdf-list__area
        //-     h1 {{$store.state.view.pdf.data.title}}
        //-     p {{$store.state.view.pdf.data.subtitle}}
        //-     img.pdf-list__qr(:src="$store.state.view.pdf.qr")
        //-     p.table
        //-         span
        //-         span(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
        //-         span(v-if="$store.state.view.pdf.data.link && $store.state.view.pdf.link && $store.state.view.popup.styleQRPopup.type !== 'wifi'") {{$store.state.view.pdf.link}}
        //-         span
</template>

<script>
export default {
    name: 'pdf_1'
}
</script>

<style lang="scss" scoped>
.pdf-list-3 {
    position: relative;
    top: 0;
    left: 0;
    z-index: 100;
    width: 90mm;
    height: 140mm;
    background-image: url('../../static/bg-texture.jpg');
    background-size: cover;
    background-position: center;
    &__qr {
        width: 230px;
        height: 230px;
        padding: 15px;
        border-radius: 10px;
        background-color: #fff;
        margin: 60px auto 0;
        display: block;
    }
    &__table {
        text-align: center;
        font-size: 10px;
        color: #fff;
        margin-top: 3px;
        span {
            margin: 0 10px;
        }
    }
    &__title {
        font-size: 34px;
        text-transform: uppercase;
        font-weight: lighter;
        white-space: pre-wrap; 
        word-wrap: break-word;
        text-align: center;
        margin-top: 25px;
        line-height: 1.3;
        color: #fff;
    }
}

</style>