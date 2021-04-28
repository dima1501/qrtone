const { MongoClient } = require('mongodb')
const config = require('../config/config')

const clientPromise = new MongoClient.connect(config.DB_URI, {
  useUnifiedTopology: true,
  maxPoolSize: 10,
})

module.exports = clientPromise
