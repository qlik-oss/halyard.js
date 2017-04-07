const bluebird = require('bluebird');
const WebSocket = require('ws');
const qixSchema = require('./node_modules/enigma.js/schemas/qix/3.0/schema.json');

const config = {
  Promise: bluebird,
  schema: qixSchema,
  session: {
    port: '9076',
    unsecure: true,
  },
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
