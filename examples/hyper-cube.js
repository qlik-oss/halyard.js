/* eslint no-console: ["error", { allow: ["log"] }] */
const fs = require('fs');
const path = require('path');

const enigma = require('enigma.js');
const enigmaConfig = require('./enigma-config.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');

enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/hyper-cube.json');

fs.readFile(filePath, 'utf8', (err, data) => {
  const halyard = new Halyard();
  const qHyperCube = JSON.parse(data);
  const hyperCube = new Halyard.HyperCube(qHyperCube, 'Hyper Cube');

  halyard.addHyperCube(hyperCube);

  enigma.create(enigmaConfig).open().then((qix) => {
    const appName = `Hyper-Cube-${Date.now()}`;

    qix.createAppUsingHalyard(appName, halyard).then(() => {
      console.log(`App created and reloaded - ${appName}.qvf`);
      process.exit(appName);
    }, (error) => {
      console.log(error);
    });
  });
});
