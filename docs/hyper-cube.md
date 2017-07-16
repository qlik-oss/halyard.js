### `Halyard.HyperCube`

### `new Halyard.HyperCube( hyperCubeLayout[, options] )`
A hyper cube is the representation of a hyper cube layout made up by a table/tables. If the hyper cube layout contains dual fields each dual field will have a map table associated.

```javascript
let hyperCube = new Halyard.HyperCube(qHyperCube, "Car Makers");
```

The first parameter is the hyper cube layout, and the second parameter is the options JSON or the hyper cube name.

#### hyper cube layout
The hyper cube layout needs to have data in qDataPages. Only hyper cubes with qMode equals S for DATA_MODE_STRAIGHT is supported. Example [qHyperCube](../examples/data/hyper-cube.json)


### options
Optional parameter. Can be either the hyper cube name as a String, or the following structure:

| Property | Type   | Description |
|----------|--------|-------------|
| `name` | String | The name of the table |
| `section` | String | The name of the script section |
| `appendToPreviousSection` | Boolean | Append the script to the previous script section |


An example of using options:

```javascript
let hyperCube = new Halyard.HyperCube(qHyperCube, { name: 'Data', section: 'Data (HyperCube)' });
```

### `getItems()`

Returns the items (Halyard.Table) needed to load the hyper cube layout and the options provided.

