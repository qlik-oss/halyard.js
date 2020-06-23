const enigma = require('enigma.js');
const enigmaConfig = require('./enigma-config.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');

enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const halyard = new Halyard();

const table = new Halyard.Table('https://www.fotbollskanalen.se/allsvenskan/', 'Allsvenskan');

halyard.addTable(table);

enigma.create(enigmaConfig).open().then((qix) => {
  qix.createSessionAppUsingHalyard(halyard).then((result) => {
    result.getAppLayout().then((res) => {
      console.log('Successfull :', res);
      process.exit(0);
    });
  }, (error) => {
    console.log(JSON.stringify(error));
  });
});
