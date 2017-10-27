/* eslint no-console: "off" */
import * as Utils from './utils';

before(function before() { // eslint-disable-line no-undef, prefer-arrow-callback
  console.log('Setting up http and https servers...\n');
  return Utils.httpServer().catch((err) => { console.log(err); });
});

after(function after() { // eslint-disable-line no-undef, prefer-arrow-callback
  this.timeout(20000);
  console.log('Cleaning up artifacts...');
  return Utils.removeAllTestDoc().catch((err) => { console.log(err); });
});
