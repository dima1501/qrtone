const axios = require('axios').default
import Vue from 'vue'

const updateOrderAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/update-order-admin',
        data: { data }
      })
      if (update.data) {
        
      }
    } catch (error) {
      console.error(error)
    }
}

const updateGoodAdmin = async (store, data) => {
    try {
      await axios({
        method: 'post',
        url: '/api/update-good-admin',
        data,
      })
    } catch (error) {
      console.error(error)
    }
}

const updateCatsAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/update-categories-drag-admin',
        data: {
          _id:  data.user._id,
          categories: data.user.categories
        }
      })
      if (update.data) {
        
      }
    } catch (error) {
      console.error(error)
    }
}

const createCatAdmin = async (store, data) => {
    try {
      const create = await axios({
        method: 'post',
        url: '/api/create-category-admin',
        data: { data }
      })
      if (create.data) {
        store.rootState.admin.user.categories.unshift(create.data)
        store.rootState.admin.parsedMenu[create.data._id] = []
      }
    } catch (error) {
      console.error(error)
    }
}

const removeCatAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/remove-category-admin',
        data: { data }
      })
      if (update.data) {
        const index = store.state.user.categories.indexOf(data.cat)
        store.state.user.categories.splice(index, 1);
      }
    } catch (error) {
      console.error(error)
    }
}

const editCatAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/edit-category-admin',
        data: { data }
      })
      if (update.data) {
        
      }
    } catch (error) {
      console.error(error)
    }
}

const editMenuItemAdmin = async (store, data) => {
    try {
      const upload = async (data) => {
        const add = await axios({
          method: 'post',
          url: '/api/update-menu-item-admin',
          data: { data: data.item, _id: data._id }
        })
  
        if (add.data) {
          let parsedItem = store.rootState.auth.user.goods.find(e => e._id == add.data._id)
          const parsedIndex = store.rootState.auth.user.goods.indexOf(parsedItem)
          let category = store.rootState.admin.parsedMenu[add.data.category]
          let item
  
          if (category) {
            item = category.find(e => e._id == add.data._id)
          }
  
          if (!item) {
            Vue.set(store.rootState.admin.user.goods, parsedIndex, add.data)
            store.rootState.admin.parsedMenu = {}
            for (let item of store.rootState.admin.user.goods) {
              if (store.rootState.admin.parsedMenu[item.category]) {
                store.rootState.admin.parsedMenu[item.category].push(item)
              } else {
                store.rootState.admin.parsedMenu[item.category] = [item]
              }
            }
          } else {
            let indexCat = category.indexOf(item)
            Vue.set(category, indexCat, add.data)
            Vue.set(store.rootState.admin.user.goods, parsedIndex, add.data)
          }
          store.rootState.view.popup.editMenuItemPopup.visible = false
        }
      }
  
      if (data.item.images.length) {
        for (let i in data.item.images) {
          if (data.item.images[i].file) {
            const bodyFormData = new FormData();
            bodyFormData.append("image", data.item.images[i].file);
  
            const uploadPhoto = await axios({
              method: "post",
              url: "/api/upload-menu-item-image",
              data: bodyFormData,
              headers: { "Content-Type": "multipart/form-data" },
            });
            if (uploadPhoto.data) {
              data.item.images[i] = uploadPhoto.data.path
            }
          }
        }
        upload(data)
      } else {
      upload(data)
      }
  
    } catch (error) {
      console.error(error)
    }
}

const createDopAdmin = async (store, data) => {
    try {
      const create = await axios({
        method: 'post',
        url: '/api/create-dop',
        data: { data }
      })
      if (create.data) {
        store.rootState.admin.user.dops.unshift(create.data)
      }
    } catch (error) {
      console.error(error)
    }
}

const removeDopAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/remove-dop',
        data: { data }
      })
      if (update.data) {
        const index = store.rootState.admin.user.dops.indexOf(data.dop)
        store.rootState.admin.user.dops.splice(index, 1);
      }
    } catch (error) {
      console.error(error)
    }
}

const editDopAdmin = async (store, data) => {
    try {
      const update = await axios({
        method: 'post',
        url: '/api/edit-dop',
        data: { data }
      })
      if (update.data) {
        
      }
    } catch (error) {
      console.error(error)
    }
}

export default {
    updateOrderAdmin,
    updateGoodAdmin,
    updateCatsAdmin,
    createCatAdmin,
    removeCatAdmin,
    editCatAdmin,
    editMenuItemAdmin,
    createDopAdmin,
    removeDopAdmin,
    editDopAdmin
}