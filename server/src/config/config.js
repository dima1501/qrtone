const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  DB_NAME: process.env.DB_NAME,
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 3000,
  ORIGIN: process.env.ORIGIN || 'toffee.menu',
  SERVER: process.env.SERVER || 'toffee.menu:8000',
  API_SERVER: process.env.API_SERVER || 'toffee.menu:8000',
};

module.exports = config;
