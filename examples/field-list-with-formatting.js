const path = require('path');

const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');
enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

const filePath = path.join(__dirname, './data/temperature.csv');

const halyard = new Halyard();

const table = new Halyard.Table(filePath, { name: 'Temperature Data', fields: [
  { src: 'created_at', name: 'Time', type: "Timestamp", inputFormat: "YYYY-MM-DDThh:mm:ss+zz:xx", displayFormat: "DD-MM-YYYY", calendarTemplate: true },
  { src: 'entry_id', name: 'Id' },
  { src: 'field1', name: 'Humidity' },
  { src: 'field2', name: 'Temperature' },
  { src: 'field3', name: 'Voltage' },
  { expr: '\'Secret string data\'', name: 'Secret' },
  ],
  delimiter: ',',
  headerRowNr: 0
});

halyard.addTable(table);

enigma.getService('qix', enigmaConfig).then((qix) => {
  const appName = `Local-Data-${Date.now()}`;

  qix.global.createAppUsingHalyard(appName, halyard).then((result) => {
    console.log(`App created and reloaded - ${appName}.qvf`);
    process.exit(1);
  }, (err) => {console.log(err);});
});
