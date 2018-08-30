import ConnectionBase from './connection-base';
import * as Utils from '../utils/utils';

class InlineData extends ConnectionBase {
  /**
   * Inline data representation. This is typically CSV formatted data.
   * @param {string} data
   * @constructor
   */
  constructor(data) {
    super();

    this.data = data;

    this.fileExtension = 'txt';
  }

  /**
   * Get the load script representation
   * @returns {string}
   */
  getScript() {
    return `INLINE "\n${Utils.escapeText(this.data)}\n"`;
  }

  /**
   * @private
   */
  getLibStatement() {
  }

  /**
   * @private
   */
  getQixConnectionObject() {
  }
}

export default InlineData;
