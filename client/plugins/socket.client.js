import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
// import store from '../store'
import io from 'socket.io-client'

const socketInstance = io(process.env.server, {
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Credentials': '*'
  },
  transport: ['websocket', 'polling'],
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 35,
  secure: true
})

export default ({ store }) => {
  Vue.use(new VueSocketIO({
    debug: false,
    connection: socketInstance,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  }))
}
