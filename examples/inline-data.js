const fs = require('fs');
const path = require('path');

const enigma = require('enigma.js');
const enigmaConfig = require('./enigma-config.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');

enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/carmakers.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  const halyard = new Halyard();

  const table = new Halyard.Table(JSON.parse(data), 'Car Makers');

  halyard.addTable(table);

  enigma.create(enigmaConfig).open().then((qix) => {
    const appName = `Inline-Data-${Date.now()}`;

    qix.createAppUsingHalyard(appName, halyard).then((result) => {
      console.log(`App created and reloaded - ${appName}.qvf`);
      process.exit(appName);
    }, (error) => {
      console.log(error);
    });
  });
});
