import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import lk from './modules/lk'
import view from './modules/view'
import guest from './modules/guest'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    modules: {
      auth,
      lk,
      view,
      guest
    }
  })

export default store
