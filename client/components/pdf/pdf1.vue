<template lang="pug">
    //- .pdf-list
    //-     .pdf-list__area
    //-         h1 {{$store.state.view.pdf.data.title}}
    //-         p {{$store.state.view.pdf.data.subtitle}}
    //-         img.pdf-list__qr(:src="$store.state.view.pdf.qr")
    //-         p.table
    //-             span
    //-             span(v-if="$store.state.view.popup.tablesPopup.tables.length && $store.state.view.pdf.data.table") Столик {{!$store.state.view.pdf.table ? $store.state.view.popup.tablesPopup.tables[0] : $store.state.view.pdf.table}}
    //-             span(v-if="$store.state.view.pdf.data.link && $store.state.view.pdf.link && $store.state.view.popup.styleQRPopup.type !== 'wifi'") {{$store.state.view.pdf.link}}
    //-             span
    <svg width="595" height="842" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1">
            <title>Layer 1</title>
            <rect id="svg_1" height="867" width="713" y="-15" x="-65.5" stroke="#b5b517" fill="#440244"/>
            <rect rx="23" id="svg_2" height="550" width="422" y="147" x="88.5" stroke="#b5b517" fill="#ffffff"/>
            <text transform="matrix(1 0 0 1 0 0)" style="cursor: move;" font-weight="bold" xml:space="preserve" text-anchor="start" font-family="sans-serif" font-size="29" id="svg_7" y="253.00019" x="197.47656" stroke-width="0" stroke="#b5b517" fill="#000000" width="200px">
                <tspan>{{$store.state.view.pdf.data.title}}</tspan>
            </text>
            <rect id="svg_8" height="188.00006" width="208.00006" y="344.99998" x="193.49997" stroke="#b5b517" fill="#440244"/>
            <text transform="matrix(1 0 0 1 0 0)" font-weight="normal" xml:space="preserve" text-anchor="start" font-family="sans-serif" font-size="12" id="svg_11" y="293.0002" x="258.11721" stroke-width="0" stroke="#b5b517" fill="#000000">Строка текста</text>
        </g>
    </svg>
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
            max-height: 167px;
            overflow: hidden;
            max-width: 300px;
        }

        p {
            margin-bottom: 50px;
            max-width: 300px;
            overflow: hidden;
            max-height: 89.6px;
            margin: 0 auto 50px;
            text-align: center;
            white-space: pre-wrap; 
            word-wrap: break-word;
            line-height: 1.4;
            &.table {
                margin-top: 10px;
                margin-bottom: -14px;
                span {
                    display: block;
                }
            }
        }
    }
    &__qr {
        width: 270px;
        height: 270px;
    }
}

</style>