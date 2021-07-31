const axios = require('axios').default
import Vue from 'vue'

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
      console.error(err)
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

const addDopToCart = async (store, data) => {
    try {
        const menuItem = store.state.user.cart[data.place] && store.state.user.cart[data.place].dops ? store.state.user.cart[data.place].dops.find(e => e._id == data.item._id) : false
        if (menuItem) {
            menuItem.count += 1
            menuItem.cartPrices.push(data.price)
        } else {
            data.item.count = 1
            data.item.cartPrices = [data.price]

            if (store.state.user.cart[data.place]) {
                store.state.user.cart[data.place].dops.push(data.item)
            } else {
                Vue.set(store.state.user.cart, data.place, { dops: [data.item], goods: [] })
            }
        }
        store.dispatch('updateCart', store.state.user.cart)
    } catch (error) {
        console.error(error)
    }
}


const addToCart = async (store, data) => {
    try {
        // const place = store.state.companyData.places.find(e => e.link == data.place)
        const menuItem = store.state.user.cart[store.state.companyData.place._id] && store.state.user.cart[store.state.companyData.place._id].goods ? store.state.user.cart[store.state.companyData.place._id].goods.find(e => e._id == data.item._id) : false
        if (menuItem) {
            menuItem.count += 1
            menuItem.cartPrices.push(data.price)
        } else {
            data.item.count = 1
            data.item.cartPrices = [data.price]

            if (store.state.user.cart[store.state.companyData.place._id]) {
                store.state.user.cart[store.state.companyData.place._id].goods.push(data.item)
            } else {
                Vue.set(store.state.user.cart, store.state.companyData.place._id, { goods: [data.item], dops: [] })
            }
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

const minusCartItemMulti = async (store, data) => {
    try {
        const menuItem = store.state.user.cart[store.state.companyData.place._id].goods.find(e => e._id == data.item._id)

        if (menuItem.count == 1) {
            $nuxt.$confirm({
                message: `Убрать из заказа "${data.item.name}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        const priceIndex = menuItem.cartPrices.indexOf(data.price)
                        const index = store.state.user.cart[store.state.companyData.place._id].goods.indexOf(menuItem)
                        store.state.user.cart[store.state.companyData.place._id].goods.splice(index, 1)
                        menuItem.cartPrices.splice(priceIndex, 1)
                        menuItem.count--
                        store.dispatch('updateCart', store.state.user.cart)
                    }
                }
            })
        } else {
            const priceIndex = menuItem.cartPrices.indexOf(data.price)
            menuItem.cartPrices.splice(priceIndex, 1)
            menuItem.count--
            store.dispatch('updateCart', store.state.user.cart)
        }
        
    } catch (error) {
        console.error(error)
    }
}

const minusDopMulti = async (store, data) => {
    try {
        const menuItem = store.state.user.cart[store.state.companyData.place._id].dops.find(e => e._id == data.item._id)

        if (menuItem.count == 1) {
            $nuxt.$confirm({
                message: `Убрать из заказа "${data.item.name}"?`,
                button: {
                    no: 'Нет',
                    yes: 'Да'
                },
                callback: confirm => {
                    if (!!confirm && confirm !== 'false') {
                        const index = store.state.user.cart[store.state.companyData.place._id].dops.indexOf(menuItem)
                        store.state.user.cart[store.state.companyData.place._id].dops.splice(index, 1)
                        const priceIndex = menuItem.cartPrices.indexOf(data.price)
                        menuItem.cartPrices.splice(priceIndex, 1)
                        menuItem.count--
                        store.dispatch('updateCart', store.state.user.cart)
                    }
                }
            })
        } else {
            const priceIndex = menuItem.cartPrices.indexOf(data.price)
            menuItem.cartPrices.splice(priceIndex, 1)
            menuItem.count--
            store.dispatch('updateCart', store.state.user.cart)
        }
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
            store.state.user.orders.unshift(order.data)
            store.state.user.cart[store.state.companyData.place._id] = {
                goods: [],
                dops: []
            }
            store.rootState.view.loading.sendOrder = false
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

const fastAction = async (store, data) => {
    try {
        const action = await axios({
            method: 'post',
            url: '/api/fast-action',
            data: { data }
        })
        if (action) {
            // console.log('completed')
            // order.status = 'accepted'
        }
    } catch (error) {
        console.error(error)
    }
}

const redirect = async (store, data) => {
    try {
        const place = await axios({
            method: 'get',
            url: `/api/get-place-id/${data.placeId}`
        })
        if (place.data) {
            $nuxt.$router.replace($nuxt.localePath({ path: `/m/${place.data}${data.table ? '?t=' + data.table : '' }` }))
        }
    } catch (error) {
        console.error(error)
    }
}

const openDetail = async (store, data) => {
    store.rootState.view.detail.visible = true
    store.rootState.view.detail.item = data.item
    store.rootState.view.detail.checkedPrice = data.checkedPrice
}

const closeDetail = async (store, data) => {
    store.rootState.view.detail.visible = false
    store.rootState.view.detail.item = null
    store.rootState.view.detail.checkedPrice = null
}

const loadData = async (store, data) => {
    // try {
    //     const user = await axios({
    //         method: 'get',
    //         url: `/api/get-user-data/${data.id}/${data.place}`
    //     })
    //     if (user) {
    //         store.state.companyData = user.data
    //         for (let item of store.state.companyData.goods) {
    //             if (store.state.parsedMenu[item.category]) {
    //               store.state.parsedMenu[item.category].push(item)
    //             } else {
    //               store.state.parsedMenu[item.category] = [item]
    //             }
    //             store.state.parsedMenu[item.category] = store.state.parsedMenu[item.category].sort(function(a, b) { return a.order - b.order })
    //         }
    //     }
    // } catch (error) {
    //     console.error(error)
    // }
}

export default {
    checkAuth,
    login,
    setSocketId,
    addToCart,
    minusCartItem,
    plusCartItem,
    updateCart,
    makeOrder,
    loadOrders,
    acceptOrder,
    fastAction,
    minusCartItemMulti,
    redirect,
    openDetail,
    closeDetail,
    addDopToCart,
    minusDopMulti,
    loadData
  }
  