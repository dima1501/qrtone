const path = require('path'),
      config = require('./config/config'),
      express = require('express'),
      cookieParser = require('cookie-parser'),
      app = require('express')(),
      routes = require('./routes'),
      cors = require('cors'),
      fs = require('fs'),
      options = {
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')
      },
      server = {}, 
      cluster = require('cluster'),
      tls = require('tls'),
      sio_redis = require('socket.io-redis'),
      farmhash = require('farmhash'),
      helmet = require('helmet'),
      rateLimit = require("express-rate-limit");

app.use(cors({credentials: true, origin: '*'}))

const port = 8000,
      num_processes = require('os').cpus().length;

if (cluster.isMaster) {
	const workers = [];

	const spawn = function(i) {
		workers[i] = cluster.fork();

		workers[i].on('exit', function(code, signal) {
			spawn(i);
		});
    };

	for (let i = 0; i < num_processes; i++) {
		spawn(i);
	}

	const worker_index = function(ip, len) {
		return farmhash.fingerprint32(ip) % len;
	};

	server = tls.createServer({ 
        pauseOnConnect: true,
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')
    }, function(connection) {
        console.log(connection.remoteAddress)
		var worker = workers[worker_index(connection.remoteAddress, num_processes)];
		worker.send('sticky-session:connection', connection);
	});
    
    server.listen(port, () => {
        console.log(`  Listening on ${config.ORIGIN}:${port}`);
    })
    
} else {
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