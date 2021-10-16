// const cluster = require("cluster");
// const https = require("http");
// const { Server } = require("socket.io");
// const numCPUs = require("os").cpus().length;
// const { setupMaster, setupWorker } = require("@socket.io/sticky");
// const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

const fs = require('fs'),
      options = {
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')};

// const config = require('./config/config');

// if (cluster.isMaster) {

//   const httpServer = https.createServer(options);

//   setupMaster(httpServer, {
//     loadBalancingMethod: "least-connection",
//   });

//   setupPrimary();

//   cluster.setupMaster({
//     serialization: "advanced",
//   });

//   httpServer.listen(8000);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     cluster.fork();
//   });
// } else {
//   const httpServer = https.createServer(options);
//   const io = new Server(httpServer, {
//     cors: {
//         origin: config.ORIGIN,
//         credentials: true
//     },
//     transport: ['websocket']
//   });

//   io.adapter(createAdapter());

//   setupWorker(io);

//   io.on("connection", (socket) => {
//     console.log('Socket connected: ' + socket.id)
//   });
// }





const { createServer } = require("https");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");

const httpServer = createServer(options);
const io = new Server(httpServer);

io.adapter(createAdapter());

setupWorker(io);

io.on("connection", (socket) => {
  console.log(`connect ${socket.id}`);
});