import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  popup: {
    PDFPopup: {
      visible: false,
      data: null
    },
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
    infoPopup: false,
    addActionPopup: false,
    editActionPopup: {
      visible: false
    },
    addCategoryPopup: {
      visible: false
    },
    addDopPopup: {
      visible: false
    },
    editTablesPopup: {
      visible: false
    }
  },
  isOrdersOpened: false,
  isCartOpened: false,
  detail: {
    visible: false,
    item: null,
    checkedPrice: null
  },
  pdf: {
    qr: null,
    title: '',
    text: '',
    ref: null
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
