const axios = require('axios').default

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
      console.log(add)

      if (add) {
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

const updateCategories = async (store) => {
  try {
    await axios({
      method: 'post',
      url: '/api/update-categories',
      data: {
        categories: store.rootState.auth.user.categories
      },
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
    console.log(update)
    if (update.data) {
      
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
    updateCategories,
    addNewAction,
    editAction,
    deleteAction,
    updateCats
}
