const cluster = require("cluster");
const http = require("https");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

const cors = require('cors'),
  rateLimit = require("express-rate-limit"),
  routes = require('./routes'),
  apiLimiter = rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 500}),
  config = require('./config/config'),
  express = require('express'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  fs = require('fs')

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')
}

let server = null,
    app = null;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  server = http.createServer(options);

  // setup sticky sessions
  setupMaster(server, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
  cluster.setupMaster({
    serialization: "advanced",
  });
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  server.listen(8000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  app = require('express')()

  app.use(cors({credentials: true, origin: config.ORIGIN}))
  app.use(apiLimiter)
  app.use(express.json({limit: '50mb'}))
  app.use(express.static('public'))
  app.use(cookieParser())
  app.use('/static', express.static(path.join(__dirname, '/static')))
  app.use('/', routes)

  server = http.createServer(options, app);
  const io = new Server(server, {
    cors: {
        origin: config.ORIGIN,
        credentials: true
    },
    transport: ['websocket']
  });

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  io.on("connection", (socket) => {
    console.log('socket connected ' + socket.id)
    /* ... */
  });
}

module.exports = {
  app,
  server,
}