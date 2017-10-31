const bluebird = require('bluebird');
const WebSocket = require('ws');
const qixSchema = require('enigma.js/schemas/3.2.json');

const config = {
  Promise: bluebird,
  schema: qixSchema,
  session: {
    port: '4848',
    secure: false,
    disableCache: true,
  },
  url: 'ws://localhost:4848/app/engineData',
  createSocket(url) {
    return new WebSocket(url);
  }
};

module.exports = config;
