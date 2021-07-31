import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  user: null,
  companyData: null,
  parsedMenu: {}
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
