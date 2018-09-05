import defaultConnectionMatcher from './default-connection-matcher';
import formatSpecification from './utils/format-specification';
import { escapeText, validFieldType, indentation } from './utils/utils';

class Table {
  /**
   * Table definition
   * @public
   * @class
   * @param {Connection} connection
   * @param {object} options - Table options
   * @param {string} options.name - Table name
   * @param {Field[]} options.fields - Array of field objects
   * @param {string} options.prefix - Add prefix before the table
   * @param {string} options.section - Section to add table to
   * @constructor
   */
  constructor(connection, options) {
    this.connection = defaultConnectionMatcher.findMatch(connection);

    options = options || {};

    if (typeof options === 'string') {
      this.name = options;
      options = {};
    } else {
      this.name = options.name;
      this.fields = options.fields;
      this.prefix = options.prefix;
      if (options.section) {
        this.section = options.section;
      }
    }

    this.options = options;
  }

  /**
   * @typedef {object} Field
   * @public
   * @property {string} src - Name in the data source of the field
   * @property {string} name - Name after reload
   * @property {string} type - Date, Time, TimeStamp
   * @property {string} inputFormat - Input format to explain how a field should be parsed.
   * @property {string} displayFormat - Display format that should be used after reload.
   * @property {string} expr - Customize how this field should be loaded with Qlik Script.
   */

  /**
   * Get the fields from a table
   * @public
   * @returns {Field[]} Array of fields
   */
  getFields() {
    return this.fields;
  }

  /**
   * Get the script representation of the field list. If nothing is specified than all the fields will be returned.
   * @public
   * @returns {string}
   */
  getFieldList() {
    if (this.fields) {
      return this.fields.map((field) => {
        let formattedInput = `"${escapeText(field.src || '')}"`;

        if (validFieldType(field.type)) {
          const format = field.type.toUpperCase();

          if (field.inputFormat) {
            formattedInput = `${format}#(${formattedInput}, '${field.inputFormat}')`;
          }

          if (field.displayFormat) {
            formattedInput = `${format}(${formattedInput}, '${field.displayFormat}')`;
          } else {
            formattedInput = `${format}(${formattedInput})`;
          }
        }

        if (field.expr) {
          formattedInput = field.expr;
        }


        if (!(field.name || field.src)) {
          throw (new Error(`A name or src needs to specified on the field: ${JSON.stringify(field)}`));
        }

        return `${indentation() + formattedInput} AS "${escapeText(field.name || field.src)}"`;
      }).join(',\n');
    }

    return '*';
  }

  /**
   * Is the table used as a proceeding load
   * @public
   * @returns {boolean}
   */
  isProceedingLoad() {
    return this.connection instanceof Table;
  }

  /**
   * Returns the specified prefix of the table if it exists.
   * The prefix can be for instance be a Qlik script snippet that always should be executed before the table is loaded.
   * @public
   * @returns {string}
   */
  getPrefix() {
    if (this.prefix) {
      return `${this.prefix}\n`;
    }
    return '';
  }

  /**
   * Get the script representation of the table
   * @public
   * @returns {string}
   */
  getScript() {
    // In the future this could be moved into a connectionMatcher
    // but for sake of clarity it is kept inline.
    if (this.isProceedingLoad()) {
      return `${this.getPrefix()}LOAD\n${this.getFieldList()};\n${this.connection.getScript()}`;
    }

    // Hack!
    if (this.connection.getFileExtension) {
      this.options.fileExtension = this.connection.getFileExtension();
    }

    return `${this.getPrefix()}LOAD\n${this.getFieldList()}\n${this.connection.getScript()}${formatSpecification(this.options)};`;
  }

  /**
   * Get the name of the table
   * @public
   * @returns {string}
   */
  getName() {
    return this.name || '';
  }

  /**
   * Get the section that the table belongs to
   * @public
   * @returns {string}
   */
  getSection() {
    return this.section;
  }

  /**
   * Returns the connection or table that the table uses.
   * @public
   * @returns {(Connection|Table)} Connection or Table
   */
  getConnection() {
    return this.connection;
  }
}

export default Table;
