import defaultConnectionMatcher from './default-connection-matcher';
import formatSpecification from './utils/format-specification';
import { escapeText, validFieldType, indentation } from './utils/utils';

class Table {
  constructor(connection, options) {
    this.connection = defaultConnectionMatcher.findMatch(connection);

    options = options || {};

    if (typeof options === 'string') {
      this.name = options;
      this.section = options;
      options = {};
    } else {
      this.name = options.name;
      this.fields = options.fields;
      this.prefix = options.prefix;
      if (!options.appendToPreviousSection) {
        if (options.section) {
          this.section = options.section;
        } else {
          this.section = options.name;
        }
      }
    }

    this.options = options;
  }

  getFields() {
    return this.fields;
  }

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

  isProceedingLoad() {
    return this.connection instanceof Table;
  }

  getPrefix() {
    if (this.prefix) {
      return `${this.prefix}\n`;
    }
    return '';
  }

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

  getName() {
    return this.name || '';
  }

  getSection() {
    return this.section;
  }

  getConnection() {
    return this.connection;
  }
}

export default Table;
