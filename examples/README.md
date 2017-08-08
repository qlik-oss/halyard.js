# Prerequisites

Needs a QIX Engine installed. The configurations in this example is for a Qlik Sense Desktop installation but can be changed in the [enigma-config.js](enigma-config.js) file to work with other setups.
Requires NodeJS to be installed.

# Installation

In the root folder, type the following:

- npm install
- npm run build

Go into the examples folder and type the following in the console:

- npm install

# Run

Make sure that a QIX engine is started (the examples are pre-configured for a Qlik Sense Desktop to be started)

- node inline-data.js

| Example |    |
| ------- | ---|
| [inline-data.js](inline-data.js) | Loads a local JSON file into QIX engine in a new doc using inline table |
| [local-data.js](local-data.js) | Load a local CSV file into QIX engine in a new doc using folder connection |
| [web-data.js](web-data.js) | Load a table from a web site into QIX engine in a new doc using a webfile connection |
| [hyper-cube.js](hyper-cube.js) | Load a hyper cube layout from a json file into QIX engine in a new doc |
| [session-app.js](session-app.js) | Load a table from a web site into QIX engine in a new doc using a webfile connection |
| [field-list-with-formatting.js](field-list-with-formatting.js) | Load a local CSV file with a defined field list using `type`, `inputFormat`, `displayFormat` and `expr` into QIX engine in a new doc using a folder connection |
| [extending-functionality.js](extending-functionality.js) | How to extend the functionality using a custom item that generates script into QIX engine |
