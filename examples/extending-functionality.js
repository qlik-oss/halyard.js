const enigmaConfig = require('./enigma-config.js');
const enigma = require('enigma.js');

const enigmaMixin = require('../dist/halyard-enigma-mixin.js');
enigmaConfig.mixins = enigmaMixin;

const Halyard = require('../dist/halyard.js');

function CustomFunctionality() {}

CustomFunctionality.prototype.getScript = function () {
  return `// Add some custom qlik script
    
CustomTable:
LOAD *
INLINE
"ID, VALUE
1, first
2, second";

INNER JOIN (CustomTable)
LOAD * 
INLINE 
"ID, DATA
1, 10
2, 20";`;
};

const halyard = new Halyard();

const item = new CustomFunctionality();

halyard.addItem(item);

enigma.getService('qix', enigmaConfig).then((qix) => {
  const appName = `Extending-Functionality-${Date.now()}`;

  qix.global.createAppUsingHalyard(appName, halyard).then((result) => {
    console.log(`App created and reloaded - ${appName}.qvf`);
    process.exit(1);
  });
});
