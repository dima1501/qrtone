import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  popup: {
    addPlacePopup: {
        visible: false
    },
    editPlacePopup: {
      visible: false
    },
    addMenuItemPopup: {
      visible: false
    },
    editMenuItemPopup: {
      visible: false
    },
    styleQRPopup: {
      visible: false,
      place: null
    },
    tablesPopup: {
      visible: false,
      tables: null,
      place: null
    },
    infoPopup: false
  },
  isOrdersOpened: false,
  isCartOpened: false
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
