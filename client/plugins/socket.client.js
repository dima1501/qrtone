import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
// import store from '../store'
import io from 'socket.io-client'
const cert = './cert.pem'

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
  reconnectionAttempts: 15,
  secure: true,
  ca: cert
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
