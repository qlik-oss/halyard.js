const path = require('path');

const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');
enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/airports.csv');

const halyard = new Halyard();

const table = new Halyard.Table(filePath, { name: 'Airports', fields: [{ src: 'rowID', name: 'Id' }, { src: 'Country', name: 'Country' }], delimiter: ',' });

halyard.addTable(table);

enigma.getService('qix', enigmaConfig).then((qix) => {
  const appName = `Local-Data-${Date.now()}`;

  qix.global.createAppUsingHalyard(appName, halyard).then((result) => {
    console.log(`App created and reloaded - ${appName}.qvf`);
    process.exit(1);
  });
});





