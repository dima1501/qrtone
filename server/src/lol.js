const cluster = require("cluster");
const https = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

const fs = require('fs'),
      options = {
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')};

const config = require('./config/config');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = https.createServer(options);

  // setup sticky sessions
  setupMaster(httpServer, {
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

  httpServer.listen(8000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const httpServer = https.createServer(options);
  const io = new Server(httpServer, {
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
    /* ... */
    console.log('Socket connected: ' + socket.id)
  });
}