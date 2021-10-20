import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  randomOrderHash = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
