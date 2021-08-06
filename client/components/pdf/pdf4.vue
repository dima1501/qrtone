<template lang="pug">
    .pdf-list-4
        img.pdf-list-4__qr(:src="$store.state.view.pdf.qr")
        .pdf-list-4__table
            span
            span(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
            span(v-if="$store.state.view.pdf.data.link && $store.state.view.pdf.link && $store.state.view.popup.styleQRPopup.type !== 'wifi'") {{$store.state.view.pdf.link}}
            span
        .pdf-list-4__title {{$store.state.view.pdf.data.title}}
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
    name: 'pdf_4'
}
</script>

<style lang="scss" scoped>
.pdf-list-4 {
    position: relative;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100mm;
    height: 115mm;
    background-image: url('../../static/papyrus-dark.png');
    background-size: cover;
    background-position: center;
    background-size: cover;
    background-position: center;
    padding: 25px;
    &__qr {
        width: 100%;
        display: block;
        margin-bottom: 7px;
        padding: 15px;
        border-radius: 10px;
        background-color: #fff;
    }
    &__table {
        text-align: center;
        font-size: 10px;
        color: #fff;
        span {
            margin: 0 5px;
        }
    }
    &__title {
        font-weight: lighter;
        white-space: pre-wrap; 
        word-wrap: break-word;
        text-align: center;
        margin-top: 15px;
        line-height: 1.3;
        color: #fff;
        font-size: 16px;
        letter-spacing: 0.01em;
    }
}

</style>