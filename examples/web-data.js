const path = require('path');

const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');
enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const url = 'https://www.fotbollskanalen.se/allsvenskan/';

const halyard = new Halyard();

const table = new Halyard.Table(url, { name: 'Allsvenskan', headerRowNr: 1, characterSet: 'utf8' });

halyard.addTable(table);

enigma.getService('qix', enigmaConfig).then((qix) => {
  const appName = `Web-Data-${Date.now()}`;

  qix.global.createAppUsingHalyard(appName, halyard).then((result) => {
    console.log(`App created and reloaded - ${appName}.qvf`);
    process.exit(1);
  }, (err) => {
    console.log(err);
  });
});
