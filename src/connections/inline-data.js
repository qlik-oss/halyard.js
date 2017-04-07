import ConnectionBase from './connection-base';
import * as Utils from '../utils/utils';

class InlineData extends ConnectionBase {
  constructor(data) {
    super();

    this.data = data;

    this.fileExtension = 'txt';
  }

  getScript() {
    return `INLINE "\n${Utils.escapeText(this.data)}\n"`;
  }

  getLibStatement() {
  }

  getQixConnectionObject() {
  }
}

export default InlineData;
