import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import lk from './modules/lk'
import view from './modules/view'
import guest from './modules/guest'
import admin from './modules/admin'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    modules: {
      auth,
      lk,
      view,
      guest,
      admin
    }
  })

export default store
