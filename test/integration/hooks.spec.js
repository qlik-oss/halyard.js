/* eslint no-console: "off" */
import * as Utils from './utils';

const createServer = require('after-work.js/src/server');
let server;

before(async () => {
  server = await createServer({
    root: ['./test/fixtures/'],
  });
  console.log(`HTTP server started on http://localhost:9000/`);
});

after(async () => { // eslint-disable-line no-undef, prefer-arrow-callback
  await server.close();
  console.log('Cleaning up artifacts...');
  await Utils.removeAllTestDoc().catch((err) => { console.log(err); });
});
