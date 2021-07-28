<template lang="pug">
    .pdf-list
        .pdf-list__area
            h1 {{$store.state.view.pdf.data.title}}
            p {{$store.state.view.pdf.data.subtitle}}
            img.pdf-list__qr(:src="$store.state.view.pdf.qr")
</template>

<script>
export default {
    name: 'pdf_1'
}
</script>

<style lang="scss" scoped>
.pdf-list {
    position: relative;
    top: 0;
    left: 0;
    z-index: 100;
    background-image: url('../../static/1111.jpg');
    background-size: cover;
    background-position: center;
    width: 210mm;
    height: 297mm;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px;
    &__area {
        position: relative;
        z-index: 30;
        background-color: #fff;
        border-radius: 14px;
        height: calc(100% - 200px);
        width: 100%;
        padding: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1 {
            text-align: center;
            margin-bottom: 50px;
            white-space: pre-wrap; 
            word-wrap: break-word;
            line-height: 1.3;
            max-height: 200px;
            overflow: hidden;
        }

        p {
            margin-bottom: 50px;
            max-width: 300px;
            margin: 0 auto 50px;
            text-align: center;
            white-space: pre-wrap; 
            word-wrap: break-word;
            line-height: 1.4;
        }
    }
    &__qr {
        svg {
            width: 300px;
            height: 300px;
        }
    }
}

</style>