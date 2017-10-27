import * as Utils from './utils';

before(function(){
  console.log('Setting up http and https servers...\n');
  return Utils.httpServer().catch((err) => { console.log(err); });
});

after(function(){
    this.timeout(20000);
    console.log('Cleaning up artifacts...');
    return Utils.removeAllTestDoc().catch((err) => { console.log(err); });
});