const path = require('path')

const config = require('./config/config')

const express = require('express')

const cookieParser = require('cookie-parser')

const app = require('express')()
const routes = require('./routes')

const cors = require('cors');
app.use(cors({credentials: true, origin: '*'}));

const rateLimit = require("express-rate-limit");

const fs = require('fs')
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./certificate.crt'),
    secure: true,
    reconnect: true,
    rejectUnauthorized : false
}

require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

const server = require("https").createServer(options, app)

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
    console.log(`:8000`);
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
