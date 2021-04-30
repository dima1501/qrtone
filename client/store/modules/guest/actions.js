const axios = require('axios').default

const checkAuth = async (store, data) => {
    try {
      const user = await axios({
        method: 'post',
        url: '/api/checkauth-guest'
      })
      if (user.data) {
        store.state.user = user.data
        store.dispatch('loadOrders', data)
      } else {
        store.dispatch('login')
      }
    } catch (err) {
      console.error(error)
    }
}

const loadOrders = async (store, data) => {
    try {
        const orders = await axios({
            method: 'post',
            url: '/api/load-orders',
            data: { data }
        })

        if (orders.data) {
            store.state.user.orders = orders.data
        }
    } catch (error) {
        console.error(error)
    }
}

const setSocketId = async (store, socketId) => {
    try {
      await axios({
        method: 'post',
        url: '/api/set-socket-id-guest',
        data: { socketId }
      })
    } catch (error) {
      console.error(error)
    }
  }

const login = async (store, data) => {
    try {
      const login = await axios({
        method: 'post',
        url: '/api/registration-guest',
        data
      })
  
      if (login.data) {
        store.state.user = login.data
        // eslint-disable-next-line no-undef
        // $nuxt.$router.push($nuxt.localePath({ path: '/lk/settings' }))
        // $nuxt.$router.push('/lk/settings')
        // eslint-disable-next-line no-undef
        store.dispatch('setSocketId', $nuxt.$socket.id)
      }
    } catch (error) {
      console.error(error)
    }
}

const loadData = async (store, data) => {
    try {
        const user = await axios({
            method: 'get',
            url: '/api/get-user-data/' + data
        })
        if (user) {
            store.state.companyData = user.data
            for (let item of store.state.companyData.goods) {
                if (store.state.parsedMenu[item.category]) {
                  store.state.parsedMenu[item.category].push(item)
                } else {
                  store.state.parsedMenu[item.category] = [item]
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const addToCart = async (store, item) => {
    try {
        if (store.state.user.cart.indexOf(item) > -1) {
            item.count += 1
        } else {
            item.count = 1
            store.state.user.cart.push(item)
        }
        store.dispatch('updateCart', store.state.user.cart)
    } catch (error) {
        console.error(error)
    }
}

const minusCartItem = async (store, item) => {
    try {
        if (item.count == 1) {
            const index = store.state.user.cart.indexOf(item)
            store.state.user.cart.splice(index, 1);
        }
        item.count--
        store.dispatch('updateCart', store.state.user.cart)
    } catch (error) {
        console.error(error)
    }
}

const plusCartItem = async (store, item) => {
    try {
        item.count++
        store.dispatch('updateCart', store.state.user.cart)
    } catch (error) {
        console.error(error)
    }
}

const updateCart = async (store, data) => {
    try {
        await axios({
            method: 'post',
            url: '/api/update-cart',
            data: { data }
        })
    } catch (error) {
        console.error(error)
    }
}

const makeOrder = async (store, data) => {
    try {
        const order = await axios({
            method: 'post',
            url: '/api/make-order',
            data: { data }
        })
        if (order) {
            store.state.user.orders.push(order.data)
            store.state.user.cart = []

            store.rootState.view.isCartOpened = false
            store.rootState.view.isOrdersOpened = true
        }
    } catch (error) {
        console.error(error)
    }
}

// это можно в лк перенести
const acceptOrder = async (store, order) => {
    try {
        const accept = await axios({
            method: 'post',
            url: '/api/accept-order',
            data: { order }
        })
        if (accept) {
            order.status = 'accepted'
        }
    } catch (error) {
        console.error(error)
    }
}

export default {
    checkAuth,
    login,
    setSocketId,
    loadData,
    addToCart,
    minusCartItem,
    plusCartItem,
    updateCart,
    makeOrder,
    loadOrders,
    acceptOrder
  }
  