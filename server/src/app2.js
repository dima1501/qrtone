const path = require('path'),
      config = require('./config/config'),
      express = require('express'),
      cookieParser = require('cookie-parser'),
      app = require('express')(),
      routes = require('./routes'),
      cors = require('cors'),
      server = require("http").createServer(app),
      cluster = require('cluster'),
      net = require('net'),
      sio_redis = require('socket.io-redis'),
      farmhash = require('farmhash'),
      helmet = require('helmet'),
      rateLimit = require("express-rate-limit");

app.use(cors({credentials: true, origin: '*'}))

const port = 8000,
      num_processes = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('isMaster')
	const workers = [];

	const spawn = function(i) {
		workers[i] = cluster.fork();

		workers[i].on('exit', function(code, signal) {
			console.log('respawning worker', i);
			spawn(i);
		});
    };

	for (let i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = function(ip, len) {
		return farmhash.fingerprint32(ip) % len;
	};

	const server = net.createServer({ pauseOnConnect: true }, function(connection) {
		var worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	});
    server.listen(port, () => {
        console.log(`  Listening on ${config.ORIGIN}:${port}`);
    })
} else {
    console.log('worker')
	const app = new express();

    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 500
    });
    app.use(apiLimiter)
    app.use(express.json({limit: '50mb'}))
    app.use(express.static('public'))
    app.use(cookieParser())
    app.use('/static', express.static(path.join(__dirname, '/static')))
    app.use(helmet())

    app.use('/', routes)

	const server = app.listen(0, 'localhost')
    const io = require("socket.io")(server, {
        cors: {
            origin: config.ORIGIN,
            credentials: true
        },
        transport: ['websocket']
    })

    const websocketAPI = require('./websocket')
    websocketAPI.start(io)

	io.adapter(sio_redis({ host: 'localhost', port: 6379 }));

	process.on('message', function(message, connection) {
        console.log(message !== 'sticky-session:connection')
		if (message !== 'sticky-session:connection') {
			return;
		}
		server.emit('connection', connection);

		connection.resume();
	});
}



module.exports = {
  app,
  server,
}