import bluebird from 'bluebird';
import WebSocket from 'ws';
import qixSchema from 'enigma.js/schemas/qix/3.0/schema.json';

const config = {
  Promise: bluebird,
  schema: qixSchema,
  session: {
    port: '4848',
    unsecure: true,
    disableCache: true,
  },
  createSocket(url) {
    return new WebSocket(url);
  },
};

module.exports = config;
