import ConnectionBase from './connection-base';
import * as Utils from '../utils/utils';

class InlineData extends ConnectionBase {
  /**
   * Inline data representation. This is typically CSV formatted data.
   * @public
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
   * @public
   * @returns {string}
   */
  getScript() {
    return `INLINE "\n${Utils.escapeText(this.data)}\n"`;
  }

  /**
   * Get lib statement but there are none for inline data
   * @private
   */
  getLibStatement() {
  }

  /**
   * Get the qix connection object but there are none for inline data
   * @private
   */
  getQixConnectionObject() {
  }
}

export default InlineData;
