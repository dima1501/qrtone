import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
    apiKey: '55293edc-f6c8-402e-b061-049856f9a0dd',
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1'
}

Vue.use(YmapPlugin, settings);