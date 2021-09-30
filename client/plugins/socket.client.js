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
  secure: true,
  ca: `-----BEGIN CERTIFICATE-----
  MIIDnzCCAocCFFoZuB79EanqztTgzpQMz4GoF3tvMA0GCSqGSIb3DQEBCwUAMIGL
  MQswCQYDVQQGEwJSVTEMMAoGA1UECAwDU1BiMQ0wCwYDVQQHDARjaXR5MRQwEgYD
  VQQKDAt0b2ZmZWUubWVudTEMMAoGA1UECwwDbG9jMRkwFwYDVQQDDBBEbWl0cml5
  IFZvcm9wYWV2MSAwHgYJKoZIhvcNAQkBFhFhZG1pbkB0b2ZmZWUubWVudTAeFw0y
  MTA5MzAwOTE1MDdaFw00OTAyMTQwOTE1MDdaMIGLMQswCQYDVQQGEwJSVTEMMAoG
  A1UECAwDU1BiMQ0wCwYDVQQHDARjaXR5MRQwEgYDVQQKDAt0b2ZmZWUubWVudTEM
  MAoGA1UECwwDbG9jMRkwFwYDVQQDDBBEbWl0cml5IFZvcm9wYWV2MSAwHgYJKoZI
  hvcNAQkBFhFhZG1pbkB0b2ZmZWUubWVudTCCASIwDQYJKoZIhvcNAQEBBQADggEP
  ADCCAQoCggEBALer/pF5UREx/9OlIcpX74T1Np41hCR105+3nTo9YCdl/NL8IAle
  KHseJlb//yd/w/JH9FU/g3WM0IqAjWrhG98HbiT5cmhPxzwufg/vRDVEIIYMay3x
  OLXsHdGRCnwMBM0BeULu4U9U/PhMmK16CBdRb0jRUTzy1gCwMcdDN+KZ0oFGPK+t
  BOUEQaaBp3nTHJuHoZpZ9Mzt5FmY7aPlpbzfncLUtszDLtW24jO6xRY4mKBSTsMi
  s5Z+KzWlvpLVlQoweSFqaoMsH/03f1zhNVjU8XaEGEGWP1q36nPygHtRNFSCo5zc
  lNXxTlt48TVAk4BvT6kbz+NY8IgamEwrEK0CAwEAATANBgkqhkiG9w0BAQsFAAOC
  AQEAR6wmzihZyv6XDLWWFf2xAfAax/RHSU+P/GG7S6HUXfwYabGv0Ss2yKUstb1J
  HmWGLu7KO7k8IEHtgBVfTUUpq6cDW3QBzB2L2Oq7cErve9YgmzR0UyM8FSdFqL6R
  uQRHNquMSRa+hKPyHzGXPrBAafwY3Sfwc0lr6Q4jz8crHV1d/ttRQ8RAgA3BHtpM
  T38eWzJEI7QqmhYu5MyKZ0TCJg0zzpg8th3g7UAMCxGbLUokTIsSu6sViXfS54ZO
  3uxmNelI7b0frOv1rvn0JOFG6ETjW9LKTOUIeVWNfAkfkMdamAUolJK0A1C5cLyH
  QoUazYBXyEDj4n67OCisWyaXpw==
  -----END CERTIFICATE-----
  `
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
