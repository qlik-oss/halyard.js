/* eslint no-console: ["error", { allow: ["log"] }] */
const fs = require('fs');
const path = require('path');

const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');

enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/hypercube.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  const halyard = new Halyard();

  const hyperCube = new Halyard.HyperCube(JSON.parse(data), 'Hyper Cube');

  halyard.addHyperCube(hyperCube);

  enigma.getService('qix', enigmaConfig).then((qix) => {
    const appName = `Hyper-Cube-${Date.now()}`;

    qix.global.createAppUsingHalyard(appName, halyard).then(() => {
      console.log(`App created and reloaded - ${appName}.qvf`);
      process.exit(appName);
    }, (error) => {
      console.log(error);
    });
  });
});
