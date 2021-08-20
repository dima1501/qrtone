const axios = require('axios').default
import Vue from 'vue'

const updateUserData = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-user-name',
      data: { data }
    })
    if (update) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Описание компании успешно обновлено' })
      return true
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteCompanyLogo = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-company-logo',
      data: {
        url: ''
      },
    })

    if (update.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Логотип компании удален' })
      store.rootState.auth.user.photo = null
      store.rootState.auth.user.photo = ''
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteCompanyBg = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-company-background',
      data: {
        url: ''
      },
    })

    if (update.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Фоновое изображение удалено' })
      store.rootState.auth.user.background = null
      store.rootState.auth.user.background = ''
    }
  } catch (error) {
    console.error(error)
  }
}

const updateCompanyLogo = async (store, data) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("image", data.file);
  
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
          $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Логотип компании успешно обновлен' })
          store.rootState.auth.user.photo = null
          store.rootState.auth.user.photo = uploadPhoto.data.path
          store.rootState.view.loading.uploadLogo = false
        }
      }
    } catch (error) {
      console.error(error)
    }
}

const updateCompanyBackground = async (store, data) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("image", data.file);
  
      const uploadPhoto = await axios({
        method: "post",
        url: "/api/upload-company-background",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (uploadPhoto.data) {
        const update = await axios({
          method: 'post',
          url: '/api/update-company-background',
          data: {
            url: uploadPhoto.data.path,
            webp: uploadPhoto.data.webp
          },
        })
  
        if (update.data) {
          $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Фоновое изображение успешно обновлено' })
          store.rootState.auth.user.background = null
          store.rootState.auth.user.background = uploadPhoto.data.path
          store.rootState.auth.user.bgWebp = uploadPhoto.data.webp
          store.rootState.view.loading.uploadBg = false
        }
      }
    } catch (error) {
      console.error(error)
    }
}

const addNewPlace = async (store, data) => {
    try {
      store.rootState.view.loading.addNewPlace = true
      const addNewPlace = await axios({
        method: 'post',
        url: '/api/add-new-place',
        data: data.place
      })
      store.rootState.view.loading.addNewPlace = false
      if (addNewPlace) {
        store.rootState.view.popup.addPlacePopup.visible = false
        store.rootState.auth.user.places.push(addNewPlace.data)
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Новое заведение успешно создано' })
      }
    } catch (error) {
      console.error(error)
    }
}

const removePlace = async (store, data) => {
  try {
      const remove = await axios({
        method: 'post',
        url: '/api/remove-place',
        data: data.place
      })
      if (remove) {
        store.dispatch('updatePlaces')
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Заведение удалено' })
      }
  } catch (error) {
    console.error(error)
  }
}

const editPlace = async (store, data) => {
  try {
      store.rootState.view.loading.editPlace = true
      const editPlace = await axios({
          method: 'post',
          url: '/api/edit-place',
          data: data.place
      })
      store.rootState.view.loading.editPlace = false
      if (editPlace) {
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Информация о заведении успешно обновлена' })
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
        data: { data: data.item, _id: data._id }
      })

      if (add.data) {
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Позиция "${data.item.name}" добавлена в меню` })
        store.rootState.view.popup.addMenuItemPopup.visible = false

        // Боже
        // Тут просто проверка, если админ загружает
        if (store.rootState.auth.user) {
          store.rootState.auth.user.goods.push(add.data)
          if (store.rootState.auth.parsedMenu[add.data.category]) {
            store.rootState.auth.parsedMenu[add.data.category].push(add.data)
          } else {
            store.rootState.auth.parsedMenu[add.data.category] = [add.data]
          }
        } else {
          store.rootState.admin.user.goods.push(add.data)
          if (store.rootState.admin.parsedMenu[add.data.category]) {
            store.rootState.admin.parsedMenu[add.data.category].push(add.data)
          } else {
            store.rootState.admin.parsedMenu[add.data.category] = [add.data]
          }
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
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Изменения позиции меню "${data.item.name}" сохранены` })
        let parsedItem = store.rootState.auth.user.goods.find(e => e._id == add.data._id)
        const parsedIndex = store.rootState.auth.user.goods.indexOf(parsedItem)
        let category = store.rootState.auth.parsedMenu[add.data.category]
        let item

        if (category) {
          item = category.find(e => e._id == add.data._id)
        }

        if (!item) {
          Vue.set(store.rootState.auth.user.goods, parsedIndex, add.data)
          store.rootState.auth.parsedMenu = {}
          for (let item of store.rootState.auth.user.goods) {
            if (store.rootState.auth.parsedMenu[item.category]) {
              store.rootState.auth.parsedMenu[item.category].push(item)
            } else {
              store.rootState.auth.parsedMenu[item.category] = [item]
            }
          }
          store.rootState.auth.parsedMenu[add.data.category] = store.rootState.auth.parsedMenu[add.data.category].sort(function(a, b) { return a.order - b.order })
        } else {
          let indexCat = category.indexOf(item)
          Vue.set(category, indexCat, add.data)
          Vue.set(store.rootState.auth.user.goods, parsedIndex, add.data)
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
    store.rootState.view.loading.createAction = true
    const add = await axios({
      method: 'post',
      url: '/api/add-action',
      data: data.action
    })
    store.rootState.view.loading.createAction = false
    if (add.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Быстрое действие успешно создано' })
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
      data: data.action
    })
    if (update.data) {
      let action = store.rootState.auth.user.actions.find(e => e._id == update.data._id)

      action = update.data

      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Изменения сохранены' })

      // Object.assign(action, update.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteAction = async (store, data) => {
  try {
    const remove = await axios({
      method: 'delete',
      url: `/api/delete-action/${data.id}`
    })
    if (remove.data) {
      const action = store.rootState.auth.user.actions.find(e => e._id == data.id)
      const index = store.rootState.auth.user.actions.indexOf(action)
      if (index > -1) {
        store.rootState.auth.user.actions.splice(index, 1)
        $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Быстрое действие удалено' })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteMenuItem = async (store, item) => {
  try {
    const remove = await axios({
      method: 'delete',
      url: `/api/delete-menu-item/${item._id}`
    })
    if (remove.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Позиция "${item.name}" удалена` })
      let parsedItem = store.rootState.auth.user.goods.find(e => e._id == item._id)
      let parsedIndex = store.rootState.auth.user.goods.indexOf(parsedItem)

      let catItem = store.rootState.auth.parsedMenu[item.category].find(e => e._id == item._id)
      let catIndex = store.rootState.auth.parsedMenu[item.category].indexOf(catItem)

      store.rootState.auth.user.goods.splice(parsedIndex, 1)
      store.rootState.auth.parsedMenu[item.category].splice(catIndex, 1)
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteMenuItemAdmin = async (store, data) => {
  try {
    const remove = await axios({
      method: 'delete',
      url: `/api/delete-menu-item-admin/${data.item._id}/${data.user}`
    })
    if (remove.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Позиция "${data.item.name}" удалена` })
      let parsedItem = store.rootState.admin.user.goods.find(e => e._id == data.item._id)
      let parsedIndex = store.rootState.admin.user.goods.indexOf(parsedItem)

      let catItem = store.rootState.admin.parsedMenu[data.item.category].find(e => e._id == data.item._id)
      let catIndex = store.rootState.admin.parsedMenu[data.item.category].indexOf(catItem)

      store.rootState.admin.user.goods.splice(parsedIndex, 1)
      store.rootState.admin.parsedMenu[data.item.category].splice(catIndex, 1)
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
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Изменения сохранены` })
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
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Категория "${cat.name}" удалена` })
      const index = store.rootState.auth.user.categories.indexOf(cat)
      store.rootState.auth.user.categories.splice(index, 1);
    }
  } catch (error) {
    console.error(error)
  }
}

const removeDop = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/remove-dop',
      data: { data }
    })
    if (update.data) {
      const index = store.rootState.auth.user.dops.indexOf(data.dop)
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
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Изменения сохранены` })
    }
  } catch (error) {
    console.error(error)
  }
}

const editDop = async (store, data) => {
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

const createCat = async (store, cat) => {
  try {
    const create = await axios({
      method: 'post',
      url: '/api/create-category',
      data: { cat }
    })
    if (create.data) {
      store.rootState.auth.user.categories.unshift(create.data)
      store.rootState.auth.parsedMenu[create.data._id] = []
    }
  } catch (error) {
    console.error(error)
  }
}

const createDop = async (store, data) => {
  try {
    const create = await axios({
      method: 'post',
      url: '/api/create-dop',
      data: { data }
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
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Изменения сохранены` })
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
    store.rootState.view.loading.orders = true
    const load = await axios({
      method: 'get',
      url: `/api/load-orders-place/${data.place}/${data.items}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.orders = load.data[0].list
    } else {
      store.rootState.auth.user.orders = []
    }
    store.rootState.view.loading.orders = false
  } catch (error) {
    console.error(error)
  }
}

const loadMoreOrders = async (store, data) => {
  try {
    store.rootState.view.loading.moreOrders = true
    const load = await axios({
      method: 'get',
      url: `/api/load-orders-place/${data.place}/${data.items}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.orders = store.rootState.auth.user.orders.concat(load.data[0].list)
    }
    store.rootState.view.loading.moreOrders = false
  } catch (error) {
    console.error(error)
  }
}

const loadActions = async (store, data) => {
  try {
    store.rootState.view.loading.notifications = true
    const load = await axios({
      method: 'get',
      url: `/api/load-actions-place/${data.place}/${data.items}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.notifications = load.data[0].list
    } else {
      store.rootState.auth.user.notifications = []
    }
    store.rootState.view.loading.notifications = false
  } catch (error) {
    console.error(error)
  }
}

const loadMoreActions = async (store, data) => {
  try {
    store.rootState.view.loading.moreNotifications = true
    const load = await axios({
      method: 'get',
      url: `/api/load-actions-place/${data.place}/${data.items}`
    })
    if (load.data[0]) {
      store.rootState.auth.user.notifications = store.rootState.auth.user.notifications.concat(load.data[0].list)
    }
    store.rootState.view.loading.moreNotifications = false
  } catch (error) {
    console.error(error)
  }
}

const updateTables = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: `/api/update-tables/`,
      data: data.place
    })
    if (update.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `${data.isRemove ? 'Столик удален' : 'Столик успешно создан'}` })
    }
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
    if (update.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `Изменения сохранены` })
    }
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
      store.rootState.view.places.edit = false
      store.rootState.auth.user.places.find(e => e._id == data.place._id).link = data.link
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: 'Ссылка на меню заведения успешно изменена' })
    } else if (add.data.exists) {
      alert("Такая ссылка занята, введите уникальное значение")
    }
  } catch (error) {
    console.error(error)
  }
}

const subscribe = async (store, data) => {
  try {
    const subscribe = await axios({
      method: 'post',
      url: `/api/subscribe/`,
      data: { data }
    })
    if (subscribe) {
      store.rootState.auth.user.subscription = subscribe.data
    }
  } catch (error) {
    console.error(error)
  }
}

const improve = async (store, data) => {
  try {
    const improve = await axios({
      method: 'post',
      url: `/api/improve/`
    })
    if (improve) {
      store.rootState.auth.user.subscription = improve.data
    }
  } catch (error) {
    console.error(error)
  }
}

const simplify = async (store, data) => {
  try {
    const simplify = await axios({
      method: 'post',
      url: `/api/simplify/`
    })
    if (simplify) {
      store.rootState.auth.user.subscription = simplify.data
    }
  } catch (error) {
    console.error(error)
  }
}

const setCurrency = async (store, data) => {
  try {
    const set = await axios({
      method: 'post',
      url: `/api/set-currency/`,
      data: { data }
    })
    if (set) {
      store.rootState.auth.user.currencySymbol = data
    }
  } catch (error) {
    console.error(error)
  }
}

const deletePic = async (store, data) => {
  try {
    const remove = await axios({
      method: 'post',
      url: '/api/delete-pic',
      data: { data }
    })
    if (remove.data) {
      
    }
    
  } catch (error) {
    console.error(error)
  }
}

const updateTGUsers = async (store, data) => {
  try {
    const fetch = await axios({
      method: 'post',
      url: '/api/load-tg-users',
      data: { data }
    })
    if (fetch.data) {
      store.rootState.auth.user.telegram = fetch.data
    }
  } catch (error) {
    console.error(error)
  }
}

const toggleFastActions = async (store, data) => {
  try {
    const fetch = await axios({
      method: 'post',
      url: '/api/toggle-fast-actions',
      data: { data }
    })
    if (fetch.data) {
      $nuxt.$notify({ group: 'custom-style', type: 'n-success', title: `${data ? 'Быстрые действия включены' : 'Быстрые действия отключены'}` })
      store.rootState.auth.user.fastActionsEnabled = data
    }
  } catch (error) {
    console.error(error)
  }
}


export default {
  updateUserData,
  deleteCompanyLogo,
  updateCompanyLogo,
  updateCompanyBackground,
  deleteCompanyBg,
  addNewPlace,
  editPlace,
  updatePlaces,
  removePlace,
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
  updateLink,
  subscribe,
  improve,
  simplify,
  setCurrency,
  deletePic,
  updateTGUsers,
  toggleFastActions,
  deleteMenuItem,
  deleteMenuItemAdmin,
  loadMoreOrders,
  loadMoreActions
}
