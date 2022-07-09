const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const config = {
  DB_NAME: process.env.DB_NAME,
  DB_URI: process.env.DB_URI,
  PORT: process.env.PORT || 3000,
  ORIGIN: process.env.ORIGIN || 'http://89.108.98.207:3000',
  SERVER: process.env.SERVER || 'http://89.108.98.207:8000',
  API_SERVER: process.env.API_SERVER || 'http://89.108.98.207:8000',
};

module.exports = config;
