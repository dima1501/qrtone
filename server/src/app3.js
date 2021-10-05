const path = require('path')
const config = require('./config/config')
const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const cors = require('cors');
const rateLimit = require("express-rate-limit")

const { createServer } = require("https");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");

const sio_redis = require('socket.io-redis')


// const server = require("https").createServer(options, app)

// const io = require("socket.io")(server, {
//     cors: {
//         origin: config.ORIGIN,
//         credentials: true
//     },
//     transports: ['websocket']
// })

// io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

// const websocketAPI = require('./websocket')
// websocketAPI.start(io)



// const apiLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 500
// });
// app.use(apiLimiter)

// app.use(express.json({limit: '50mb'}))
// app.use(express.static('public'))
// app.use(cookieParser())
// app.use('/static', express.static(path.join(__dirname, '/static')))

// 

// module.exports = {
//   app,
//   server,
// };
const fs = require('fs')

const app = require('express')()

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 500
})

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')
}

app.use(cors({credentials: true, origin: config.ORIGIN}))
app.use(apiLimiter)
app.use(express.json({limit: '50mb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, '/static')))
app.use('/', routes)

const httpServer = createServer(options, app);

const io = new Server(httpServer, {
    cors: {
        origin: config.ORIGIN,
        credentials: true
    },
    transport: ['websocket']
});

io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

httpServer.listen(8000, () => {
    console.log('server listen 8000')
});

const websocketAPI = require('./websocket')
websocketAPI.start(io)