import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  user: null,
  peer: null,
  peerId: null,
  parsedMenu: {},
  parsedOrders: [],
  restore: {
    isKeyValid: false,
    isEmailSent: false,
    email: '',
    token: '',
    newPassword: '',
    newPasswordRepeat: ''
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
