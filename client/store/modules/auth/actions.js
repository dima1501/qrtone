const axios = require('axios').default

const checkAuth = async (store, data) => {
  try {
    const user = await axios({
      method: 'post',
      url: '/api/checkauth',
      data
    })
    if (user.data) {
      store.state.user = user.data
      // todo 7 строчек ниже - хлам
      for (let item of store.state.user.goods) {
        if (store.state.parsedMenu[item.category]) {
          store.state.parsedMenu[item.category].push(item)
        } else {
          store.state.parsedMenu[item.category] = [item]
        }
        store.state.parsedMenu[item.category] = store.state.parsedMenu[item.category].sort(function(a, b) { return a.order - b.order })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

const registrationAction = async (store, data) => {
  try {
    const registration = await axios({
      method: 'post',
      url: '/api/registration',
      data
    })

    if (registration.data) {
      store.dispatch("auth/regEmail")
      store.state.user = registration.data
      // eslint-disable-next-line no-undef
      $nuxt.$router.push($nuxt.localePath({ path: '/lk/settings' }))
      store.dispatch("auth/setSocketId", {
        socketId: $nuxt.$socket.id,
        place: localStorage.getItem('place')
      }, { root: true });

      for (let item of store.state.user.goods) {
        if (store.state.parsedMenu[item.category]) {
          store.state.parsedMenu[item.category].push(item)
        } else {
          store.state.parsedMenu[item.category] = [item]
        }
        store.state.parsedMenu[item.category] = store.state.parsedMenu[item.category].sort(function(a, b) { return a.order - b.order })
      }
      
    } else {
      console.log('Ошибка')
    }
  } catch (error) {
    console.error(error)
  }
}

const loginAction = async (store, data) => {
  try {
    const login = await axios({
      method: 'post',
      url: '/api/login',
      data
    })

    if (login.data) {
      store.state.user = login.data
      // eslint-disable-next-line no-undef
      $nuxt.$router.push($nuxt.localePath({ path: '/lk/settings' }))
      // eslint-disable-next-line no-undef

      store.dispatch("auth/setSocketId", {
        socketId: $nuxt.$socket.id,
        place: localStorage.getItem('place')
      }, { root: true });

      for (let item of store.state.user.goods) {
        if (store.state.parsedMenu[item.category]) {
          store.state.parsedMenu[item.category].push(item)
        } else {
          store.state.parsedMenu[item.category] = [item]
        }
        store.state.parsedMenu[item.category] = store.state.parsedMenu[item.category].sort(function(a, b) { return a.order - b.order })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const setSocketId = async (store, data) => {
  try {
    if (data.place) {
      await axios({
        method: 'post',
        url: '/api/set-place-socket-id',
        data: { data }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

const uploadNewLogo = async (store, data) => {
  try {
    const bodyFormData = new FormData()
    bodyFormData.append('image', data)

    const uploadPhoto = await axios({
      method: 'post',
      url: '/upload-logo',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (uploadPhoto.data) {
      const update = await axios({
        method: 'post',
        url: '/update-logo',
        data: {
          url: uploadPhoto.data.path
        }
      })

      if (update.data) {
        store.state.user.photo = null
        store.state.user.photo = uploadPhoto.data.path
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const logout = async (store, data) => {
  try {
    const logout = await axios({
      method: 'post',
      url: '/api/logout'
    })
    if (logout) {
      $nuxt.$router.push($nuxt.localePath({ path: '/' }))
      store.state.user = null
      store.state.parsedMenu = {},
      store.state.parsedOrders = []
    }
  } catch (error) {
    console.error(error)
  }
}

const regEmail = async (store, data) => {
  try {
    const sentMail = await axios({
      method: 'post',
      url: '/api/send-reg-email'
    })
    if (sentMail.data) {
      console.log('sent')
    } else {
      console.log('error')
    }
  } catch (error) {
    console.error(error)
  }
}

const sendRestoreEmail = async (store, data) => {
  try {
    const sentMail = await axios({
      method: 'post',
      url: '/api/send-restore-email',
      data: { data }
    })
    if (sentMail.data) {
      console.log('sent')
    } else {
      console.log('error')
    }
  } catch (error) {
    console.error(error)
  }
}

const checkKey = async (store, data) => {
  try {
    const check = await axios({
      method: 'post',
      url: '/api/check-key',
      data: { data }
    })
    if (check.data) {
      store.state.restore.isKeyValid = true
      console.log('good')
    } else {
      console.log('not good')
    }
  } catch (error) {
    console.error(error)
  }
}

const updatePassword = async (store, data) => {
  try {
    const update = await axios({
      method: 'post',
      url: '/api/update-password',
      data: { data }
    })
    if (update.data) {
      $nuxt.$router.push($nuxt.localePath({ path: '/auth/login' }))
      store.state.restore = {
        isKeyValid: false,
        isEmailSent: false,
        email: '',
        token: '',
        newPassword: '',
        newPasswordRepeat: ''
      }
    } else {
      console.log('not')
    }
  } catch (error) {
    console.error(error)
  }
}

export default {
  registrationAction,
  checkAuth,
  loginAction,
  setSocketId,
  uploadNewLogo,
  logout,
  regEmail,
  sendRestoreEmail,
  checkKey,
  updatePassword
}
