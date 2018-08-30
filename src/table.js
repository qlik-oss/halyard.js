import defaultConnectionMatcher from './default-connection-matcher';
import formatSpecification from './utils/format-specification';
import { escapeText, validFieldType, indentation } from './utils/utils';

class Table {
  /**
   * Table definition
   * @public
   * @param {object} connection
   * @param {object} options - Table options
   * @param {string} name - Table name
   * @param {object[]} fields - Array of field objects
   * @param {string} prefix - Add prefix before the table
   * @param {string} section - Section to add table to
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
   * Get the fields from a table
   * @public
   * @returns {object[]} Array of fields
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
   * Get specified prefix
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
   * @returns {object} Connection or Table
   */
  getConnection() {
    return this.connection;
  }
}

export default Table;
