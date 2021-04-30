const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') })

const config = {
  DB_NAME: process.env.DB_NAME,
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 3000,
}

module.exports = config
