const path = require('path')

const config = require('./config/config')

const express = require('express')

const cookieParser = require('cookie-parser')

const app = require('express')()
const routes = require('./routes')

const cors = require('cors');
app.use(cors({credentials: true, origin: '*'}))

const rateLimit = require("express-rate-limit")

const server = require("http").createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: config.ORIGIN,
        credentials: true
    },
    transport: ['websocket', 'polling']
})

const websocketAPI = require('./websocket')
websocketAPI.start(io)

server.listen(8000, () => {
    console.log(`:8000`)
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500
});
app.use(apiLimiter)

app.use(express.json({limit: '50mb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, '/static')))

app.use('/', routes)

module.exports = {
  app,
  server,
};
