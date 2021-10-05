const cluster = require("cluster"),
    https = require("https"),
    numCPUs = require("os").cpus().length,
    RedisStore = require("socket.io/lib/stores/redis"),
    redis = require("socket.io/node_modules/redis"),
    pub = redis.createClient(),
    sub = redis.createClient(),
    client = redis.createClient(),
    options = {
        key: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/toffee.menu/fullchain.pem', 'utf8')};

if (cluster.isMaster) {
    let i = 0
    while(i < numCPUs) {
        cluster.fork()
        i++
    }
    cluster.on("fork", (worker) => console.log('forked worker ' + worker.process.pid))
    cluster.on("listening", (worker) => console.log("worker " + worker.process.pid + " is now connected to " + address.address + ":" + address.port ))
    cluster.on("exit", (worker) => console.log("worker " + worker.process.pid + " died"))
} else {
    let app = require("express")()
    app.use(cors({credentials: true, origin: config.ORIGIN}))
    app.use(apiLimiter)
    app.use(express.json({limit: '50mb'}))
    app.use(express.static('public'))
    app.use(cookieParser())
    app.use('/static', express.static(path.join(__dirname, '/static')))
    app.use('/', routes)

    let server = https.createServer(options, app)
    let io = require("socket.io").listen(server)

    io.set("store", new RedisStore({
        redisPub: pub,
        redisSub: sub,
        redisClient: client
    }))

    server.listen(8000)

    const websocketAPI = require('./websocket')
    websocketAPI.start(io)
}