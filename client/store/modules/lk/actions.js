const axios = require('axios').default
import Vue from 'vue'

const updateUserName = async (store, data) => {
  try {
    const update = await axios({
        method: 'post',
        url: '/api/update-user-name',
        data: { name: data }
    })
    if (update) {
        store.rootState.auth.user.name = data
        return true
    }
  } catch (error) {
    console.error(error)
  }
}

const updateCompanyLogo = async (store, data) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("image", data);
  
      const uploadPhoto = await axios({
        method: "post",
        url: "/api/upload-company-logo",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (uploadPhoto.data) {
        const update = await axios({
          method: 'post',
          url: '/api/update-company-logo',
          data: {
            url: uploadPhoto.data.path
          },
        })
  
        if (update.data) {
          store.rootState.auth.user.photo = null
          store.rootState.auth.user.photo = uploadPhoto.data.path
        }
      }
    } catch (error) {
      console.error(error)
    }
}

const updateCompanyBackground = async (store, data) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("image", data);
  
      const uploadPhoto = await axios({
        method: "post",
        url: "/api/upload-company-logo",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (uploadPhoto.data) {
        const update = await axios({
          method: 'post',
          url: '/api/update-company-background',
          data: {
            url: uploadPhoto.data.path
          },
        })
  
        if (update.data) {
          store.rootState.auth.user.background = null
          store.rootState.auth.user.background = uploadPhoto.data.path
        }
      }
    } catch (error) {
      console.error(error)
    }
}

const addNewPlace = async (store, data) => {
    try {
        const addNewPlace = await axios({
            method: 'post',
            url: '/api/add-new-place',
            data: { data }
        })
        if (addNewPlace) {
            store.rootState.view.popup.addPlacePopup.visible = false
            store.rootState.auth.user.places.push(addNewPlace.data)
        }
    } catch (error) {
      console.error(error)
    }
}

const editPlace = async (store, data) => {
  try {
      const editPlace = await axios({
          method: 'post',
          url: '/api/edit-place',
          data: { data }
      })
      if (editPlace) {
        store.rootState.view.popup.editPlacePopup.visible = false
        store.dispatch('updatePlaces')
      }
  } catch (error) {
    console.error(error)
  }
}

const updatePlaces = async (store, data) => {
  try {
      const update = await axios({
          method: 'get',
          url: '/api/load-places',
          data: { data }
      })

      if (update.data) {
        store.rootState.auth.user.places.length = 0
        store.rootState.auth.user.places = update.data
      }
  } catch (error) {
    console.error(error)
  }
}

const addNewMenuItem = async (store, data) => {
  try {
    const uploadItem = async (data) => {
      const add = await axios({
        method: 'post',
        url: '/api/add-menu-item',
        data: { data: data.item }
      })

      if (add.data) {
        store.rootState.auth.user.goods.push(add.data)
        if (store.rootState.auth.parsedMenu[add.data.category]) {
          store.rootState.auth.parsedMenu[add.data.category].push(add.data)
        } else {
          store.rootState.auth.parsedMenu[add.data.category] = [add.data]
        }
      }
    }
    if (data.images.length) {
      for (let i in data.images) {
        const bodyFormData = new FormData();
        bodyFormData.append("image", data.images[i].file);

        const uploadPhoto = await axios({
          method: "post",
          url: "/api/upload-menu-item-image",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (uploadPhoto.data) {
          data.item.images.push(uploadPhoto.data.path)
        }
      }
      uploadItem(data)
    } else {
      uploadItem(data)
    }
  } catch (error) {
    console.error(error)
  }
}

const editMenuItem = async (store, data) => {
  try {
    const upload = async (data) => {
      const add = await axios({
        method: 'post',
        url: '/api/update-menu-item',
        data: { data: data.item }
      })

      if (add.data) {
        let category = store.rootState.auth.parsedMenu[add.data.category]
        let item

        if (category) {
          item = category.find(e => e._id == add.data._id)
        }

        if (!item) {
          const parsedItem = store.rootState.auth.user.goods.find(e => e._id == add.data._id)
          const index = store.rootState.auth.user.goods.indexOf(parsedItem)
          Vue.set(store.rootState.auth.user.goods, index, add.data)
          store.rootState.auth.parsedMenu = {}

          for (let item of store.rootState.auth.user.goods) {
            if (store.rootState.auth.parsedMenu[item.category]) {
              store.rootState.auth.parsedMenu[item.category].push(item)
            } else {
              store.rootState.auth.parsedMenu[item.category] = [item]
            }
          }
        } else {
          let index = category.indexOf(item)
          Vue.set(category, index, add.data)
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

const updateGood = async (store, data) => {
  try {
    await axios({
      method: 'post',
      url: '/api/update-good',
      data,
    })
  } catch (error) {
    console.error(error)
  }
}

const addNewAction = async (store, data) => {
  try {
    const add = await axios({
      method: 'post',
      url: '/api/add-action',
      data
    })
    if (add.data) {
      store.rootState.auth.user.actions.push(add.data)
      store.rootState.view.popup.addActionPopup = false
    }
  } catch (error) {
    console.error(error)
  }
}

const editAction = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-action',
      data
    })
    if (update.data) {
      const action = store.rootState.auth.user.actions.find(e => e._id == update.data._id)
      store.rootState.view.popup.editActionPopup.visible = false

      Object.assign(action, update.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteAction = async (store, id) => {
  try {
    const remove = await axios({
      method: 'delete',
      url: `/api/delete-action/${id}`
    })
    if (remove.data) {
      const action = store.rootState.auth.user.actions.find(e => e._id == id)
      const index = store.rootState.auth.user.actions.indexOf(action);
      if (index > -1) {
        store.rootState.auth.user.actions.splice(index, 1);
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const updateCats = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-categories-drag',
      data: {
        categories: store.rootState.auth.user.categories
      }
    })
    if (update.data) {
      
    }
  } catch (error) {
    console.error(error)
  }
}

const removeCat = async (store, cat) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/remove-category',
      data: { cat }
    })
    if (update.data) {
      const index = store.rootState.auth.user.categories.indexOf(cat)
      store.rootState.auth.user.categories.splice(index, 1);
    }
  } catch (error) {
    console.error(error)
  }
}

const removeDop = async (store, dop) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/remove-dop',
      data: { dop }
    })
    if (update.data) {
      const index = store.rootState.auth.user.dops.indexOf(dop)
      store.rootState.auth.user.dops.splice(index, 1);
    }
  } catch (error) {
    console.error(error)
  }
}

const editCat = async (store, cat) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/edit-category',
      data: { cat }
    })
    if (update.data) {
      
    }
  } catch (error) {
    console.error(error)
  }
}

const editDop = async (store, dop) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/edit-dop',
      data: { dop }
    })
    if (update.data) {
      
    }
  } catch (error) {
    console.error(error)
  }
}

const createCat = async (store, cat) => {
  try {
    const create = await axios({
      method: 'post',
      url: '/api/create-category',
      data: { cat }
    })
    if (create.data) {
      console.log(store.rootState.auth.parsedMenu)
      store.rootState.auth.user.categories.unshift(create.data)
      store.rootState.auth.parsedMenu[create.data._id] = []
    }
  } catch (error) {
    console.error(error)
  }
}

const createDop = async (store, dop) => {
  try {
    const create = await axios({
      method: 'post',
      url: '/api/create-dop',
      data: { dop }
    })
    if (create.data) {
      store.rootState.auth.user.dops.unshift(create.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const updateOrder = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-order',
      data: { data }
    })
    if (update.data) {
      
    }
  } catch (error) {
    console.error(error)
  }
}

const acceptFastAction = async (store, data) => {
  try {
    const accept = await axios({
      method: 'post',
      url: '/api/accept-fast-action',
      data: { data }
    })
    if (accept.data) {
      store.rootState.auth.user.notifications.find(e => e._id == data._id).status = 'accepted'
    }

  } catch (error) {
    console.error(error)
  }
}

const setPlaceSocketId = async (store, data) => {
  try {
    if (data.place) {
      const set = await axios({
        method: 'post',
        url: '/api/set-place-socket-id',
        data: { data }
      })
      if (set.data) {
      
      }
    }
    
  } catch (error) {
    console.error(error)
  }
}

const loadOrders = async (store, data) => {
  try {
    const load = await axios({
      method: 'get',
      url: `/api/load-orders-place/${data}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.orders = load.data[0].list
    } else {
      store.rootState.auth.user.orders = []
    }
  } catch (error) {
    console.error(error)
  }
}

const loadActions = async (store, data) => {
  try {
    const load = await axios({
      method: 'get',
      url: `/api/load-actions-place/${data}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.notifications = load.data[0].list
    } else {
      store.rootState.auth.user.notifications = []
    }
  } catch (error) {
    console.error(error)
  }
}

const updateTables = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: `/api/update-tables/`,
      data: { data }
    })
  } catch (error) {
    console.error(error)
  }
}

const updateTGTables = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: `/api/update-tg-tables/`,
      data: { data }
    })
  } catch (error) {
    console.error(error)
  }
}

const updateLink = async (store, data) => {
  try {
    const add = await axios({
      method: 'post',
      url: `/api/update-menu-link/`,
      data: { data }
    })
    if (add.data.success) {
      console.log('success')
    } else {
      console.log('not')
    }
  } catch (error) {
    console.error(error)
  }
}

export default {
    updateUserName,
    updateCompanyLogo,
    updateCompanyBackground,
    addNewPlace,
    editPlace,
    updatePlaces,
    addNewMenuItem,
    updateGood,
    addNewAction,
    editAction,
    deleteAction,
    updateCats,
    removeCat,
    editCat,
    createCat,
    createDop,
    editDop,
    removeDop,
    editMenuItem,
    updateOrder,
    acceptFastAction,
    setPlaceSocketId,
    loadOrders,
    loadActions,
    updateTables,
    updateTGTables,
    updateLink
}
