'use strict';

var config;

try {
  config = require('./local.env.js');
}
catch (e) {
  config = {
    BING_API_KEY: process.env.BING_API_KEY
  }
}

module.exports = config;
