const fs = require('fs');
const path = require('path');

const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');

enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/carmakers.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  const halyard = new Halyard();

  const table = new Halyard.Table(JSON.parse(data), 'Car Makers');

  halyard.addTable(table);

  enigma.getService('qix', enigmaConfig).then((qix) => {
    const appName = `Inline-Data-${Date.now()}`;

    qix.global.createAppUsingHalyard(appName, halyard).then((result) => {
      console.log(`App created and reloaded - ${appName}.qvf`);
      process.exit(appName);
    }, (error) => {
      console.log(error);
    });
  });
});
