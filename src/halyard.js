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
   * @returns {Array}
   */
  getConnections() {
    return this.items.filter(item => item.getConnection).map(item => item.getConnection());
  }

  /**
   * Get the QIX connections definitions that are used in the model
   * @returns {Array.<connections>}
   */
  getQixConnections() {
    return this.getConnections().map(connection => connection.getQixConnectionObject())
      .filter(connection => connection);
  }

  /**
   * Get fields that matches pattern sent in as params
   * @param matcherFn
   * @returns {Array}
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
   * @param {object} defaultSetStatements
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
   * @param item
   * @returns {*}
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
   * @returns {Array.<string>}
   */
  getAllScriptBlocks() {
    return this.items.concat(this.lastItems).filter(item => item.getScript());
  }

  /**
   * Fetches the entire script
   * @returns {string}
   */
  getScript() {
    return this.getAllScriptBlocks().map(item => this.getItemScript(item))
      .join(SCRIPT_BLOCK_SPACING);
  }

  /**
   * Add hyper cube explicit or implicitly
   * @param {hypercube} arg1
   * @param {object} options
   * @returns {hypercube}
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
   * @param {table} arg1
   * @param options
   * @returns {table}
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
   * @param {table|hypercube} newItem
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
   * @param {table|hypercube} newItem
   * @returns {table|hypercube}
   */
  addItem(newItem) {
    this.checkIfItemNameExists(newItem);

    this.items.push(newItem);

    return newItem;
  }

  /**
   * Locate which item that generated a script at the specified character position
   * @param {number} charPosition
   * @returns {table|hypercube}
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
