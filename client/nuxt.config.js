import colors from 'vuetify/es5/util/colors'
const axios = require("axios")

const config = {
  port: process.env.NODE_ENV !== 'production' ? '3000' : '80',
  test: process.env.NODE_ENV !== 'production' ? 'localhost' : 'lalka-palka.xyz',
  apiserver: process.env.NODE_ENV !== 'production' ? 'http://localhost:8000' :'http://lalka-palka.xyz:8000',
}

export default {
  env: {
    dev: config.test,
    server: config.apiserver
  },
  server: {
    // https: {
    //   key: fs.readFileSync('./server.key', 'utf8'),
    //   cert: fs.readFileSync('./certificate.crt', 'utf8')
    // },
    port: config.port,
    host: config.test
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: 'My amazing Nuxt application | %s',
    title: 'QRTONE',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: 'Сервис электронного меню для ресторанов и кафе. С доступом по QR коду и уведомлениями в telegram' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: './plugins/socket.client.js' },
    { src: './plugins/vue2-dropzone.client.js' },
    { src: './plugins/dragdrop.client.js' },
    { src: './plugins/ymap.client.js' },
    { src: './plugins/notify.client.js' },
    { src: './plugins/confirm.client.js' },
    { src: './plugins/parallax.client.js' },
    { src: './plugins/typer.client.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: ['~/components/lk/', '~/components/auth/', '~/components/pdf/', '~/components/public/'],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa', 
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'ru',
            file: 'ru-RU.js'
          },
        ],
        detectBrowserLanguage: true,
        detectBrowserLanguage: {
          useCookie: true,
          cookieDomain: null,
          cookieKey: 'lang',
          alwaysRedirect: true,
        },
        lazy: true,
        langDir: 'lang/',
      }
    ],
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    hostname: 'https://qrtone.com/m/',
    gzip: true,
    path: '/sitemap.xml',
    routes: async () => {
      let arr = await axios({
        method: 'get',
        url: `${config.apiserver}/api/get-sitemap-routes/`
      })

      return arr.data
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },

  proxy: {
    '/api/': config.apiserver
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    
  }
}
