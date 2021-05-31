<template lang="pug">
    .pdf-list
        .pdf-list__qr(v-html="$store.state.view.pdf.qr")
        .pdf-list__text {{$store.state.view.pdf.data.subtitle}}
            
</template>

<script>
export default {
    name: 'pdf_2'
}
</script>

<style lang="scss" scoped>
.pdf-list {
    position: relative;
    top: 0;
    left: 0;
    width: 70mm;
    height: 87mm;
    background-color: #fff;
    display: flex;
    align-items: center;
    flex-direction: column;
    &__text {
        line-height: 1.3;
        padding: 0 10px 20px 10px;
        text-align: center;
        font-size: 20px;
        margin-top: -7px;
        max-width: 100%;
    }
}
</style>