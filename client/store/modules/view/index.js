import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  popup: {
    onboardPopup: {
      visible: false
    },
    reservePopup: {
      visible: false
    },
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
    addCategoryPopup: {
      visible: false
    },
    addDopPopup: {
      visible: false
    },
    editTablesPopup: {
      visible: false
    },
    wifiPopup: {
      visible: false,
      string: null
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
    ref: null,
    data: {}
  },
  loading: {
    sendOrder: false,
    uploadLogo: false,
    uploadBg: false,
    orders: false,
    moreOrders: false,
    notifications: false,
    moreNotifications: false
  },
  places: {
    isLinkExists: false,
    edit: false,
    newLink: ''
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
