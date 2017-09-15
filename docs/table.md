### `Halyard.Table`

### `new Halyard.Table( connection[, options] )`
A table is the representation of a table/flatfil from a data source.

```javascript
let table = new Halyard.Table(JSON.parse(data), "Car Makers");
```

The first parameter is the data source, and the second parameter is the options JSON or the table name.

#### connection
The connection parameter can be implicitly created by providing the data/path/url to the source that should be loaded.

- file path => `Halyard.Connections.File(path)`
- url path => `Halyard.Connections.Web(url[, fileExtension])`
- csv data => `Halyard.Connections.InlineData(data)`
- json data => `Halyard.Connections.InlineData(data)` (converted to csv)

Raw CSV-data that is passed to the table becomes inlined in the script.

```javascript
let data = 'a,b,c\n1,2,3\n4,5,6';
let table = new Halyard.Table(data);

console.log(table.getScript());

// Load
// *
// INLINE "
// a,b,c
// 1,2,3
// 4,5,6
// "
// (txt);
```

JSON-formatted data is also supported and the following generates the same output as above:

```javascript
let data = [{a: 1, b: 2, c:3}, {a: 4, b: 5, c:6}];
```

File paths are supported and they create a `Halyard.Connections.File`.

```javascript
let filePath = 'c:\data\file.csv';
let table = new Halyard.Table(filePath);

console.log(table.getScript());

// Load
// *
// FROM [lib://connection-name/file.csv]
// "
// (txt);
```

URL paths are supported and they create a `Halyard.Connections.Web`.

```javascript
let webFileConnection = new WebFileConnection('https://www.allsvenskan.se/tabell/');
let table = new Halyard.Table(webFileConnection);

console.log(table.getScript());

// Load
// *
// FROM [lib://connection-name]
// "
// (html);
```

If a table requires a connection, the connector should be created through the QIX API before the script is reloaded.

### options
Optional parameter. Can be either the table name as a String, or the following structure:

| Property | Type   | Description |
|----------|--------|-------------|
| `name` | String | The name of the table |
| `prefix` | String | The script prefix function to be used before the load statement |
| `fields` | Array of Fields | See Field definition below. If no fields are specified then all will be loaded from the source's first table or if specified from srcTable. |
| `delimiter` | String | The character that delimits a CSV file |
| `headerRowNr` | Number | The location of the header row |
| `srcTable` | String | The name of the table in the source file. IE: this could be the sheet name in XLSX. |
| `section` | String | The name of the script section. If left empty the script is appended to the previous script section |
| `characterSet` | String | The character set of the source table. Supported: 'utf8', 'unicode', 'ansi', 'oem', 'mac' or a numeric code page. |


#### Field definition

| Property | Type | Description |
|----------|------|-------------|
| `src` | String | The name of the original source field |
| `name` | String | The new name of the field |
| `type` | String | The format of the field (one of the following: date, time, timestamp). |
| `inputFormat` | String | The input format of the data |
| `displayFormat` | String | The format used to display this field |
| `calendarTemplate` | Boolean | Apply a calendar derived field template to a date/timestamp field |
| `expr` | String | Specifies a custom expression. If `expr` is used then it `src`, `type`, `inputFormat` and `displayFormat` won't be applied.

An example of using options:

```javascript
let filePath = 'c:\data\file.csv';
let table = new Halyard.Table(filePath, { name: 'Data', fields: [{src: 'dataId', name: 'id'}, {src: 'dataValue', name: 'value'}]});

console.log(table.getScript());

// Load
// "dataId" AS "id",
// "dataValue" AS "value"
// FROM [lib://connection-name/file.csv]
// "
// (txt);
```

### `getScript()`

Returns the script needed to load the table based on the connection and the options provided.

### `getConnection()`

Returns the connection used in the table.
