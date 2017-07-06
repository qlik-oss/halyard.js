import Table from './table';
import Connections from './connections';
import SetStatement from './set-statement';

import * as Utils from './utils/utils';
import getDerivedFieldDefinition from './calendar-derived-fields';

const SCRIPT_BLOCK_SPACING = '\n\n';

class Halyard {
  constructor() {
    this.defaultSetStatements = {};
    this.items = [];
    this.addItem(new SetStatement(this.defaultSetStatements));
    this.lastItems = [getDerivedFieldDefinition(x => this.getFields(x))];
  }

  getConnections() {
    return this.items.filter(item => item.getConnection).map(item => item.getConnection());
  }

  getQixConnections() {
    return this.getConnections().map(connection => connection.getQixConnectionObject())
      .filter(connection => connection);
  }

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

  setDefaultSetStatements(defaultSetStatements, preservePreviouslyEnteredValues) {
    const that = this;

    Object.keys(defaultSetStatements).forEach((key) => {
      if (!(preservePreviouslyEnteredValues && that.defaultSetStatements[key])) {
        that.defaultSetStatements[key] = defaultSetStatements[key];
      }
    });
  }

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

  getAllScriptBlocks() {
    return this.items.concat(this.lastItems).filter(item => item.getScript());
  }

  getScript() {
    return this.getAllScriptBlocks().map(item => this.getItemScript(item))
        .join(SCRIPT_BLOCK_SPACING);
  }

  // Support to add table explicit or implicitly
  addTable(arg1, options) {
    let newTable;

    if (arg1 instanceof Table) {
      newTable = arg1;
    } else {
      newTable = new Table(arg1, options);
    }

    return this.addItem(newTable);
  }

  addItem(newItem) {
    if (newItem.getName && newItem.getName()) {
      if (this.items.filter(item => item.getName() === newItem.getName()).length > 0) {
        throw new Error('Cannot add another table with the same name.');
      }
    }

    this.items.push(newItem);

    return newItem;
  }

  getItemThatGeneratedScriptAt(charPosition) {
    const allScriptBlocks = this.getAllScriptBlocks();
    let scriptBlockStartPosition = 0;

    for (let i = 0; i < allScriptBlocks.length; i += 1) {
      const itemScript = this.getItemScript(allScriptBlocks[i]);
      const scriptBlockEndPosition = scriptBlockStartPosition +
          (`${itemScript}${SCRIPT_BLOCK_SPACING}`).length;

      if (scriptBlockStartPosition <= charPosition && charPosition <= scriptBlockEndPosition) {
        return allScriptBlocks[i];
      }

      scriptBlockStartPosition = scriptBlockEndPosition;
    }

    return undefined;
  }
}

Halyard.Table = Table;

Halyard.Connections = Connections;

export default Halyard;

module.exports = Halyard;
