const path = require('path')

const express = require('express')

const cookieParser = require('cookie-parser')
const app = require('express')()
const routes = require('./routes')

const cors = require('cors');
app.use(cors({credentials: true, origin: '*'}));

const server = require("http").createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    },
    transport: ['websocket', 'polling']
});

server.listen(8000, () => {
    console.log(`Listening on http://localhost:8000`);
});

const websocketAPI = require('./websocket')
websocketAPI.start(io)

app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, '/static')))

app.use('/', routes)

module.exports = {
  app,
  server,
};
