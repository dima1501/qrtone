var cluster = require('cluster');
var os = require('os');

const fs = require('fs'),
    options = {
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')},
    routes = require('./routes'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    config = require('./config/config')

if (cluster.isMaster) {
  // we create a HTTP server, but we do not use listen
  // that way, we have a socket.io server that doesn't accept connections
  var server = require('https').createServer(options);
  var io = require('socket.io').listen(server);
  var redis = require('socket.io-redis');

  io.adapter(redis({ host: 'localhost', port: 6379 }));

  setInterval(function() {
    // all workers will receive this in Redis, and emit
    io.emit('data', 'payload');
  }, 1000);

  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  }); 
}

if (cluster.isWorker) {
  var express = require('express');
  var app = express();
  app.use(cors({credentials: true, origin: config.ORIGIN}))
  app.use(apiLimiter)
  app.use(express.json({limit: '50mb'}))
  app.use(express.static('public'))
  app.use(cookieParser())
  app.use('/static', express.static(path.join(__dirname, '/static')))
  app.use('/', routes)

  var http = require('https');
  var server = http.createServer(options, app);
  var io = require('socket.io').listen(server);
  var redis = require('socket.io-redis');

  io.adapter(redis({ host: 'localhost', port: 6379 }));
  io.on('connection', function(socket) {
    socket.emit('data', 'connected to worker: ' + cluster.worker.id);
  });

  app.listen(8000);
}