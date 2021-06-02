<template lang="pug">
    .pdf-list_2
        .pdf-list_2__qr(v-html="$store.state.view.pdf.qr")
        .pdf-list_2__text {{$store.state.view.pdf.data.subtitle}}
            
</template>

<script>
export default {
    name: 'pdf_2'
}
</script>

<style lang="scss">
.pdf-list_2 {
    position: relative;
    top: 0;
    left: 0;
    width: 70mm;
    height: 93mm;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    &__text {
        display: flex;
        align-items: center;
        margin-top: -4px;
        line-height: 1.3;
        height: 79px;
        padding: 0 10px 10px;
        text-align: center;
        font-size: 20px;
        max-width: 100%;
        overflow: hidden;
    }
    &__qr {
        width: 100%;
        svg {
            width: 100%;
            display: block; 
        }
    }
}
</style>