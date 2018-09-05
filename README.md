![](halyard.png)

[![CircleCI](https://circleci.com/gh/qlik-oss/halyard.js.svg?style=shield)](https://circleci.com/gh/qlik-oss/halyard.js)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=qlik-oss/halyard.js)](https://dependabot.com)
[![Coverage Status](https://img.shields.io/coveralls/qlik-oss/halyard.js/master.svg)](https://coveralls.io/github/qlik-oss/halyard.js)

halyard.js is a JavaScript library that simplifies the Qlik Sense data load experience as it abstracts away the need to write a load script.

The functionality in halyard.js is divided into two parts where the first one is `halyard.js` itself. It generates the load script, as well as the connections needed. The second part is `halyard-enigma-mixin.js` that extends the functionality of [`enigma.js`](https://github.com/qlik-oss/enigma.js) to bring your halyard representation into the QIX engine.

## halyard.js - API Basics

`let halyard = new Halyard();`

### `setDefaultSetStatements(defaultSetStatements[, preservePreviouslyEnteredValues])`

Adds custom set statements to the beginning of the script. Typically used to configure time/data/currency settings.

`defaultSetStatements` is an object where the key becomes the variable name in the set statement, and the value becomes the variable value.

```javascript
halyard.setDefaultSetStatements({DateFormat: 'MM-DD-YYYY'});
// getScript() will return SET DateFormat='MM-DD-YYYY';
```

Any entered default set statement will be replaced by default if this method is called a second time with `defaultSetStatement` containing already defined keys.
If `preservePreviouslyEnteredValues` is set to true, then previously entered set statements will be preserved even if the `setDefaultSetStatements` method is called multiple times.


### `addTable(table)`

Adds a table to the data model representation. More info about [Halyard.Table](docs/table.md).

The `addTable` method accepts an explicit table definition:

```javascript
let table = new Halyard.Table('c:\\data\\file.csv');
halyard.addTable(table);
```


`addTable` returns a Halyard.Table instance

### `addTable(connection[, tableOptions])`

You can also add a table by providing the table definition:

```javascript
halyard.addTable('c:\\data\\file.csv', 'TableName');
```

`addTable` returns a Halyard.Table instance

### `addHyperCube(hyperCube)`

Adds a hyper cube to the data model representation. More info about [Halyard.HyperCube](docs/hyper-cube.md).

The `addHyperCube` method accepts an explicit hyper cube definition:

```javascript
let hyperCube = new Halyard.HyperCube(qHyperCube);
halyard.addHyperCube(hyperCube);
```
Example [qHyperCube](examples/data/hyper-cube.json)

`addHyperCube` returns a Halyard.HyperCube instance

### `addHyperCube(hyperCubeLayout[, hyperCubeOptions])`

You can also add a hyper cube by providing the hyper cube definition:

```javascript
halyard.addHyperCube(qHyperCube, 'HyperCubeName');
```

`addHyperCube` returns a Halyard.HyperCube instance 
An example of a how to use this method [hyper-cube.js in examples](examples/hyper-cube.js)

### `addItem(item)`

Adds any object that responds to `getScript()`. An example of a how to use this method to extend with custom functionality [extending-functionality.js in examples](examples/extending-functionality.js)

### `getScript()`

Retrieves the script representation of the items added to halyard.js. The script returned can be set to QIX Engine using the `setScript(script)` method.

```javascript
halyard.getScript();
```

### `getQixConnections()`

Returns an array of QIX connections that needs to be created before the `doReload()` method is called. To create connections, use the `createConnection(connection)` method.

```javascript
halyard.getQixConnections();
```

### `getItemThatGeneratedScriptAt(charPosition)`

Returns the item that generated the script block at the specified character position from the `getScript()` call. The main usage for this method is to identify what item that causes a reload failure.   

```javascript
const syntaxErrorAtCharacterPosition = 32;

halyard.getItemThatGeneratedScriptAt(syntaxErrorAtCharacterPosition);
```

## halyard-enigma-mixin.js

### `createSessionAppUsingHalyard(halyard)`

Creates a session app according to the specification setup in the `Halyard` instance provided. This method will return the session app.

### `createAppUsingHalyard(appName, halyard)`

Creates an app with the specified `appName` and `Halyard` instance. This method will return the an app object.

### `reloadAppUsingHalyard(existingAppName, halyard[, createIfMissing])`

Updates an existing app named `existingAppName` with new data from the `Halyard` instance. If `createIfMissing` is set to true, an app is created if it does not already exist.

***Note that this method replaces any script that already exist in the app.***

### `setScriptAndReloadWithHalyard(app, halyard, doSaveAfterReload)`

Sets data from the `halyard` instance to the `app` instance. If `doSaveAfterReload` is set to true, the app is saved
after the data has been set. This method will return the app.

## Extending with new functionality

See [extending-functionality.js](examples/extending-functionality.js) in examples for more info about how to extend with new functionality.

## Contributing

Please follow the instructions in [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Examples

More examples can be found in [examples](examples/README.md) or in the [examples/](examples/) folder.
