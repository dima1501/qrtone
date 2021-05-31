<template lang="pug">
    .popup.-wide
        .popup__container
            .popup__closer
                v-icon(dark @click="closePopup") mdi-close
            .popup__content
                h2.popup__title Выберите шаблон
                p Текст можно изменить
                .pdf
                    // Превьюшки
                    .pdf__list
                        .pdf__list-preview(
                            v-for="(preview, key) in currencies"
                            :key="key"
                            @click="setTemplate(preview)"
                            :class="{ 'active': $store.state.view.pdf.ref == preview.ref, '-empty': !preview.ref }")
                            img(:src="preview.pic")
                            div {{preview.name}}
                    
</template>

<script>
import currencies from 'assets/pdf/pdf.js'

export default {
    data() {
        return {
            currencies: null
        }
    },
    mounted() {
        this.currencies = currencies
    },
    methods: {
        setTemplate(template) {
            this.$store.state.view.pdf.ref = template.ref
            this.$store.state.view.pdf.data = template
        },
        closePopup() {
            this.$store.state.view.popup.PDFPopup.visible = false
        }
    }
}
</script>

<style lang="scss">
.popup {
    &.-wide {
        .popup__container {
            max-width: 1000px;
        }
    }
}
.pdf {
    position: relative;
    overflow: hidden;
    &__list {
        display: flex;
        flex-wrap: wrap;
        &-preview {
            width: 30%;
            margin-right: 3%;
            margin-bottom: 20px;
            &.active {
                border: 3px solid #000;
            }
            img {
                max-width: 100%;
            }
        }
    }
}

</style>