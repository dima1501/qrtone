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
  reconnectionAttempts: 15,
  secure: true,
  ca: `-----BEGIN CERTIFICATE-----
  MIIDwTCCAqkCFGQMWjF/s5bBX4Zzo1LV/yV2npcCMA0GCSqGSIb3DQEBCwUAMIGc
  MQswCQYDVQQGEwJSVTEZMBcGA1UECAwQU2FpbnQtUGV0ZXJzYnVyZzENMAsGA1UE
  BwwEY2l0eTEUMBIGA1UECgwLdG9mZmVlLm1lbnUxEDAOBgNVBAsMB3NlcnZpY2Ux
  GTAXBgNVBAMMEERtaXRyaXkgVm9yb3BhZXYxIDAeBgkqhkiG9w0BCQEWEWFkbWlu
  QHRvZmZlZS5tZW51MB4XDTIxMDkyOTEwNTAzNVoXDTQ5MDIxMzEwNTAzNVowgZwx
  CzAJBgNVBAYTAlJVMRkwFwYDVQQIDBBTYWludC1QZXRlcnNidXJnMQ0wCwYDVQQH
  DARjaXR5MRQwEgYDVQQKDAt0b2ZmZWUubWVudTEQMA4GA1UECwwHc2VydmljZTEZ
  MBcGA1UEAwwQRG1pdHJpeSBWb3JvcGFldjEgMB4GCSqGSIb3DQEJARYRYWRtaW5A
  dG9mZmVlLm1lbnUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCyyCwa
  +OdZ2LBMaE6FAFvwy2Mg+Spcd/LI/cYz1ZcdY1ON96nVqlhKFNTd0fN3w5K8UETI
  6AxZZrMeK6AOHP9xowZOlyixB52lLdtnZoL+/VE9DRRn+J47VBkvwWgwyAMPJyV7
  XBFVyFqgbRZb4mc4IUQ4nXIQh/SlB4LaQk05ixO4XcFCI49tqItAekDOnjk3O4ds
  R0S0BH/imdKgMYYJhlmyocC4Y9bevZErX0cZfqYTN2pp1FoCBmCeFc0p1hbaK/P8
  CCJorFIBT5QdubRJynordIWe+vQ5t9t8wBi5u3U5VyR926VExsfZjCAK6dvnrk0h
  0Qzdk61/N5ivbtunAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAIhdDIwI2Q0iYfZY
  6rEYlQyMINZzzaXDbxUr/hzbiC43IA/FTfSyiJ9UT7LrQ7iZ+MYnyCPnIANDK/KK
  H0Sn/yTBA4sxM9TkPXzhcFK4PJtLjjVUG+KouZ03T5a35EmJAQiqNJOj+JMm/9zT
  KWrK+7DCcz9jQnJj7nX6t7FnptUiE4MxlzPaErhZq0Z0mdN3kFuXWB85bV0lj5F0
  VnC9K2DKtWVTuhG2lAWaJ4tMDRNo15qu6AUs7+Umc6L9k2HpwgVYYob5RhfsE6uQ
  IPJns791iPIqr10BgvLJNw9j9a8Y2cbkHgT77H15l3wsGKwIvj4f7UpStvySupUH
  CQcNTwU=
  -----END CERTIFICATE-----`
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
