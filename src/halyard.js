import Table from './table';
import HyperCube from './hyper-cube';
import Connections from './connections';
import SetStatement from './set-statement';

import * as Utils from './utils/utils';
import getDerivedFieldDefinition from './calendar-derived-fields';

const SCRIPT_BLOCK_SPACING = '\n\n';

class Halyard {
  /**
   * Representation of tables or hypercubes to load
   * @class
   * @public
   * @constructor
   */
  constructor() {
    this.defaultSetStatements = {};
    this.items = [];
    this.addItem(new SetStatement(this.defaultSetStatements));
    this.lastItems = [getDerivedFieldDefinition(x => this.getFields(x))];
  }

  /**
   * Get connections object that are used in the model
   * @public
   * @returns {Connection[]}
   */
  getConnections() {
    return this.items.filter(item => item.getConnection).map(item => item.getConnection());
  }

  /**
   * Get the QIX connections definitions that are used in the model
   * @public
   * @returns {{qName: (string), qConnectionString: (string), qType: (string)}
   */
  getQixConnections() {
    return this.getConnections().map(connection => connection.getQixConnectionObject())
      .filter(connection => connection);
  }

  /**
   * Field matching callback to identify if a field matches another
   * @callback fieldMatchingCallback
   * @param {Field} field
   * @param {boolean}
   */

  /**
   * Get fields that matches pattern sent in as params
   * @public
   * @param {fieldMatchingCallback} matcherFn
   * @returns {Field[]}
   */
  getFields(matcherFn) {
    matcherFn = matcherFn || (() => true);

    const fields = [];

    this.items.forEach((item) => {
      if (item.getFields && item.getFields()) {
        fields.push(...item.getFields().filter(matcherFn));
      }
    });

    return fields;
  }

  /**
   * Configure the default set statements like time, date, currency formats
   * @public
   * @param {SetStatement} defaultSetStatements
   * @param {boolean} preservePreviouslyEnteredValues
   */
  setDefaultSetStatements(defaultSetStatements, preservePreviouslyEnteredValues) {
    const that = this;

    Object.keys(defaultSetStatements).forEach((key) => {
      if (!(preservePreviouslyEnteredValues && that.defaultSetStatements[key])) {
        that.defaultSetStatements[key] = defaultSetStatements[key];
      }
    });
  }

  /**
   * Get the script for a item (table, preceeding load)
   * @public
   * @param {(Table|HyperCube)} item
   * @returns {string}
   */
  getItemScript(item) {
    let itemScript = item.getScript();

    if (item.getName && item.getName()) {
      if (item.section) {
        itemScript = `///$tab ${Utils.escapeText(item.section)}\n"${Utils.escapeText(item.getName())}":\n${itemScript}`;
      } else {
        itemScript = `"${Utils.escapeText(item.getName())}":\n${itemScript}`;
      }
    }

    return itemScript;
  }

  /**
   * Fetch all script blocks
   * @public
   * @returns {string[]}
   */
  getAllScriptBlocks() {
    return this.items.concat(this.lastItems).filter(item => item.getScript());
  }

  /**
   * Fetches the entire script
   * @public
   * @returns {string}
   */
  getScript() {
    return this.getAllScriptBlocks().map(item => this.getItemScript(item))
      .join(SCRIPT_BLOCK_SPACING);
  }

  /**
   * Add hyper cube explicit or implicitly
   * @public
   * @param {Hypercube} arg1 - Hypercube
   * @param {object} options - Hypercube options
   * @param {string} options.name - Name
   * @param {string} options.section - Section to add hypercube data to
   * @returns {Hypercube} Hypercube
   */
  addHyperCube(arg1, options) {
    let newHyperCube;

    if (arg1 instanceof HyperCube) {
      newHyperCube = arg1;
    } else {
      newHyperCube = new HyperCube(arg1, options);
    }

    for (let i = 0; i < newHyperCube.items.length; i += 1) {
      this.checkIfItemNameExists(newHyperCube.items[i]);
    }

    for (let i = 0; i < newHyperCube.items.length; i += 1) {
      this.addItem(newHyperCube.items[i]);
    }

    return newHyperCube;
  }

  /**
   * Support to add table explicit or implicitly
   * @public
   * @param {Table} arg1 - Table
   * @param {object} options
   * @param {string} options.name - Table name
   * @param {Field[]} options.fields - Array of field objects
   * @param {string} options.prefix - Add prefix before the table
   * @param {string} options.section - Section to add table to
   * @returns {object} Table
   */
  addTable(arg1, options) {
    let newTable;

    if (arg1 instanceof Table) {
      newTable = arg1;
    } else {
      newTable = new Table(arg1, options);
    }

    return this.addItem(newTable);
  }

  /**
   * Verify that item doesn't exist in model
   * @public
   * @param {(Table|Hypercube)} newItem - Table or Hypercube
   */
  checkIfItemNameExists(newItem) {
    if (newItem.getName && newItem.getName()) {
      if (this.items.filter(item => item.getName() === newItem.getName()).length > 0) {
        throw new Error('Cannot add another table with the same name.');
      }
    }
  }

  /**
   * Add new item to the model
   * @public
   * @param {(Table|Hypercube)} newItem - Table or Hypercube
   * @returns {(Table|Hypercube)} - Table or Hypercube
   */
  addItem(newItem) {
    this.checkIfItemNameExists(newItem);

    this.items.push(newItem);

    return newItem;
  }

  /**
   * Locate which item that generated a script at the specified character position
   * @public
   * @param {number} charPosition
   * @returns {(Table|Hypercube)} - Table or Hypercube
   */
  getItemThatGeneratedScriptAt(charPosition) {
    const allScriptBlocks = this.getAllScriptBlocks();
    let scriptBlockStartPosition = 0;

    for (let i = 0; i < allScriptBlocks.length; i += 1) {
      const itemScript = this.getItemScript(allScriptBlocks[i]);
      const scriptBlockEndPosition = scriptBlockStartPosition
          + (`${itemScript}${SCRIPT_BLOCK_SPACING}`).length;

      if (scriptBlockStartPosition <= charPosition && charPosition <= scriptBlockEndPosition) {
        return allScriptBlocks[i];
      }

      scriptBlockStartPosition = scriptBlockEndPosition;
    }

    return undefined;
  }
}

Halyard.Table = Table;

Halyard.HyperCube = HyperCube;

Halyard.Connections = Connections;

export default Halyard;

if (typeof module !== 'undefined') {
  module.exports = Halyard;
}
